"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAction } from "@/app/actions";
import { SyntheticEvent, useState } from "react";
import Form from "next/form";
import SubmitButton from "@/components/submitButton";
import Container from "@/components/Container";

export default function Home() {
  const [state, setState] = useState("ready");

  async function handleOnSubmit(event: SyntheticEvent) {
    if (state == "pending") {
      event.preventDefault();
      return;
    }

    setState("pending");
  }
  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between w-full mb-6">
          <h1 className="text-3xl font-bold mb-4 mt-4">Create invoice</h1>
        </div>
        <Form
          action={createAction}
          onSubmit={handleOnSubmit}
          className="grid gap-4 max-w-xs"
        >
          <div>
            <div className="mb-3">
              <Label
                htmlFor="name"
                className="block font-semibold text-sm mb-1"
              >
                Billing name
              </Label>
              <Input id="name" name="name" type="text"></Input>
            </div>

            <div className="mb-3">
              <Label
                htmlFor="email"
                className="block font-semibold text-sm mb-1"
              >
                Billing Email
              </Label>
              <Input id="email" name="email" type="email"></Input>
            </div>

            <div className="mb-3">
              <Label
                htmlFor="value"
                className="block font-semibold text-sm mb-1"
              >
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
              <SubmitButton />
            </div>
          </div>
        </Form>
      </Container>
    </main>
  );
}
