"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { Customers, Invoices, type Status } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
const resend = new Resend(process.env.RESEND_API_KEY);

import { InvoiceCreatedEmail } from "@/emails/invoice-created";

export async function createAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const rawValue = formData.get("value");
  const parsedValue = Number.parseFloat(String(rawValue));

  if (Number.isNaN(parsedValue)) {
    throw new Error("Invalid invoice value");
  }

  const value = Math.floor(parsedValue * 100);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
      organizationId: orgId || null,
    })
    .returning({
      id: Customers.id,
    });

  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      customerId: customer.id,
      status: "open",
      organizationId: orgId || null,
    })
    .returning({
      id: Invoices.id,
    });

  await resend.emails.send({
    from: "Space Jelly <info@test.spacejelly.dev>",
    to: [email],
    subject: "You Have a New Invoice",
    react: InvoiceCreatedEmail({ invoiceId: results[0].id }),
  });

  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return;
  }

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;

  if (orgId) {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, Number.parseInt(id)),
          eq(Invoices.organizationId, orgId)
        )
      );
  } else {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, Number.parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  revalidatePath(`/invoices/${id}`, "page");
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const id = formData.get("id") as string;

  if (orgId) {
    await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, Number.parseInt(id)),
          eq(Invoices.organizationId, orgId)
        )
      );
  } else {
    await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, Number.parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  redirect("/dashboard");
}

export async function createPayment(formData: FormData) {
  const headersList = await headers();
  const origin = headersList.get("origin");
  const id = Number.parseInt(formData.get("id") as string);

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product: String(process.env.STRIPE_PRODUCT_ID),
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error("Invalid Session");
  }

  redirect(session.url);
}
