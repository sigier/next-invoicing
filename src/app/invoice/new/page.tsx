import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export default async function Home() {
  const result = await db.execute(sql`SELECT current_database()`);

  return (
    <main className="flex flex-col justify-left h-screen gap-6 max-w-5xl mx-auto">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-bold mb-4 mt-4">Create invoice</h1>
      </div>
      {JSON.stringify(result)}
      <form className="grid gap-4 max-w-xs">
        <div>
          <div className="mb-3">
            <Label htmlFor="name" className="block font-semibold text-sm mb-1">
              Billing name
            </Label>
            <Input id="name" name="name" type="text"></Input>
          </div>

          <div className="mb-3">
            <Label htmlFor="email" className="block font-semibold text-sm mb-1">
              Billing Email
            </Label>
            <Input id="email" name="email" type="email"></Input>
          </div>

          <div className="mb-3">
            <Label htmlFor="value" className="block font-semibold text-sm mb-1">
              Value
            </Label>
            <Input id="value" name="value" type="text"></Input>
          </div>

          <div className="mb-3">
            <Label
              htmlFor="description"
              className="block font-semibold text-sm mb-1"
            >
              Description
            </Label>
            <Textarea id="description" name="description"></Textarea>
          </div>
          <div className="w-full font-semibold">
            <Button>Submit</Button>
          </div>
        </div>
      </form>
    </main>
  );
}
