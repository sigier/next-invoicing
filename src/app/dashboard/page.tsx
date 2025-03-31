import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@clerk/nextjs/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { eq, isNull, and } from "drizzle-orm";

export default async function Home() {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  let result;

  if (orgId) {
    result = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId));
  } else {
    result = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
  }

  const bills = result?.map(({ Invoices, Customers }) => {
    return {
      ...Invoices,
      customer: Customers,
    };
  });

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between w-full">
          <h1 className="text-3xl font-bold mb-4">Bills</h1>
          <p>
            <Button className="inline-flex gap-2" variant="ghost" asChild>
              <Link href="invoices/new">
                <CirclePlus className="h-4 w-4" />
                Bills
              </Link>
            </Button>
          </p>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-4">Date</TableHead>
              <TableHead className="p-4">Customer</TableHead>
              <TableHead className="p-4">Email</TableHead>
              <TableHead className="text-center p-4">Status</TableHead>
              <TableHead className="text-right p-4">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-left p-0">
                    <Link
                      href={`/invoices/${item.id}`}
                      className="font-semibold block p-4"
                    >
                      {new Date(item.createTs).toLocaleDateString()}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">
                    <Link
                      href={`/invoices/${item.id}`}
                      className="font-semibold block p-4"
                    >
                      {item.customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">
                    <Link className="block p-4" href={`/invoices/${item.id}`}>
                      {item.customer.email}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center p-0">
                    <Link className="block p-4" href={`/invoices/${item.id}`}>
                      <Badge
                        className={cn(
                          "rounded-full capitalize",
                          item.status === "open" && "bg-blue-500",
                          item.status === "paid" && "bg-green-600"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-semibold p-0">
                    <Link className="block p-4" href={`/invoices/${item.id}`}>
                      ${(item.value / 100).toFixed(2)}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
