CREATE TYPE "public"."status" AS ENUM('open', 'paid', 'archived');--> statement-breakpoint
CREATE TABLE "Customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"createTs" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"userId" text NOT NULL,
	"organizationId" text
);
--> statement-breakpoint
CREATE TABLE "Invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"createTs" timestamp DEFAULT now() NOT NULL,
	"value" integer NOT NULL,
	"description" text NOT NULL,
	"userId" text NOT NULL,
	"organizationId" text,
	"customerId" integer NOT NULL,
	"status" "status" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_customerId_Customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."Customers"("id") ON DELETE no action ON UPDATE no action;