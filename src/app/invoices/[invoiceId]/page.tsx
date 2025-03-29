export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import Invoice from "./Invoice";

export default async function InvoicePage(props: {
  params: { invoiceId: string };
}) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const { invoiceId } = await props.params;
  const parsedInvoiceId = Number.parseInt(invoiceId);

  if (Number.isNaN(parsedInvoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  const conditions = orgId
    ? and(eq(Invoices.id, parsedInvoiceId), eq(Invoices.organizationId, orgId))
    : and(
        eq(Invoices.id, parsedInvoiceId),
        eq(Invoices.userId, userId),
        isNull(Invoices.organizationId)
      );

  const result: Array<{
    Invoices: typeof Invoices.$inferSelect;
    Customers: typeof Customers.$inferSelect;
  }> = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(conditions)
    .limit(1);

  console.log(result);
  const [row] = result;

  if (!row) {
    notFound();
  }

  const invoice = {
    ...row.Invoices,
    customer: row.Customers,
  };

  return <Invoice invoice={invoice} />;
}
