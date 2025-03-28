import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Invoice from "./Invoice";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return;
  }
  const resolvedParams = await params;
  const { invoiceId } = resolvedParams;

  const invoiceIdNumber = Number(invoiceId);

  if (isNaN(invoiceIdNumber)) {
    throw new Error("Incorrect invoice ID");
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(eq(Invoices.id, invoiceIdNumber), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) {
    notFound();
  }

  const invoice = { ...result.invoices, customer: result.customers };

  return <Invoice invoice={invoice}></Invoice>;
}
