CREATE TABLE "run_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"age" integer NOT NULL,
	"mobile" varchar(20) NOT NULL,
	"address" text NOT NULL,
	"email" varchar(150),
	"t_shirt_size" varchar(10) NOT NULL,
	"t_shirt_price" integer NOT NULL,
	"payment_number" varchar(20) NOT NULL,
	"transaction_id" varchar(100) NOT NULL,
	"payment_screenshot" text,
	"payment_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payment_verified_at" timestamp,
	"payment_verified_by" integer,
	"email_notification_sent" integer DEFAULT 0 NOT NULL,
	"whatsapp_notification_sent" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "run_t_shirts" (
	"id" serial PRIMARY KEY NOT NULL,
	"size" varchar(10) NOT NULL,
	"price" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "run_t_shirts_size_unique" UNIQUE("size")
);
