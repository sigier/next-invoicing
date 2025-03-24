"use server";

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function createAction(formData: FormData) {
  const { userId } = await auth();
  const value = Math.floor(parseFloat(String(formData.get("value")))) * 100;
  const description = formData.get("description") as string;

  if (!userId) {
    return;
  }

  const result = await db
    .insert(Invoices)
    .values({
      value,
      description,
      status: "open",
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoice/${result[0].id}`);
}
