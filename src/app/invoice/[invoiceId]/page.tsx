import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Invoice from "./Invoice";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const resolvedParams = await params;
  const { invoiceId } = resolvedParams;

  const invoiceIdNumber = Number(invoiceId);

  if (isNaN(invoiceIdNumber)) {
    throw new Error("Incorrect invoice ID");
  }

  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const [invoice] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceIdNumber), eq(Invoices.userId, userId)))
    .limit(1);

  if (!invoice) {
    notFound();
  }

  return <Invoice invoice={invoice}></Invoice>;
}
