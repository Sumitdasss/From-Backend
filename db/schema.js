import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";


// ==========================================
// T-SHIRT
// ==========================================

export const RunTShirts = pgTable("run_t_shirts", {
  id: serial("id").primaryKey(),

  size: varchar("size", {
    length: 10,
  }).notNull().unique(),

  price: integer("price").notNull(),

  stock: integer("stock")
    .notNull()
    .default(0),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});


// ==========================================
// REGISTRATION
// ==========================================

export const RunRegistrations = pgTable("run_registrations", {
  id: serial("id").primaryKey(),

  // Participant Information
  fullName: varchar("full_name", {
    length: 150,
  }).notNull(),

  age: integer("age").notNull(),

  mobile: varchar("mobile", {
    length: 20,
  }).notNull(),

  address: text("address").notNull(),

  email: varchar("email", {
    length: 150,
  }),

  // T-Shirt
  tShirtSize: varchar("t_shirt_size", {
    length: 10,
  }).notNull(),

  tShirtPrice: integer("t_shirt_price").notNull(),

  // Payment
  paymentNumber: varchar("payment_number", {
    length: 20,
  }).notNull(),

  transactionId: varchar("transaction_id", {
    length: 100,
  }).notNull(),

  paymentScreenshot: text("payment_screenshot"),

  // pending / approved / rejected
  paymentStatus: varchar("payment_status", {
    length: 20,
  })
    .notNull()
    .default("pending"),

  // Admin verification
  paymentVerifiedAt: timestamp(
    "payment_verified_at"
  ),

  paymentVerifiedBy: integer(
    "payment_verified_by"
  ),

  // Notification status
  emailNotificationSent: integer(
    "email_notification_sent"
  )
    .notNull()
    .default(0),

  whatsappNotificationSent: integer(
    "whatsapp_notification_sent"
  )
    .notNull()
    .default(0),

  // Registration time
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});