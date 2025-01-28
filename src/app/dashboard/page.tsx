import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-screen gap-6 text-center max-w-5xl mx-auto my-12">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-bold mb-4">Bills</h1>
        <p>
          <Button className="inline-flex gap-2" variant="ghost" asChild>
            <Link href="invoice/new">
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
          <TableRow>
            <TableCell className="font-medium text-left p-4">
              <span className="font-semibold">10/15/2024</span>
            </TableCell>
            <TableCell className="text-left p-4">
              <span className="font-semibold">Rogan S.</span>
            </TableCell>
            <TableCell className="text-left p-4">
              <span>rogans@scuise.com</span>
            </TableCell>
            <TableCell className="text-center p-4">
              <Badge className="rounded-full">Paid</Badge>
            </TableCell>
            <TableCell className="text-right p-4">
              <span>$250.00</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
