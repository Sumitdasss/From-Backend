import { db } from "../db/index.js";
import {
  RunRegistrations,
  RunTShirts,
} from "../db/schema.js";
import { sendPaymentApprovedEmail } from "../services/emailService.js";
import { eq, sql } from "drizzle-orm";


// ==========================================
// GET ALL REGISTRATIONS
// ==========================================

export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await db
      .select()
      .from(RunRegistrations)
      .orderBy(
        sql`${RunRegistrations.createdAt} DESC`
      );

    return res.status(200).json({
      success: true,
      data: registrations,
    });

  } catch (error) {

    console.error(
      "Get Registrations Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Registrations পাওয়া যায়নি",
    });
  }
};


// ==========================================
// GET SINGLE PARTICIPANT
// ==========================================

export const getRegistrationById = async (req, res) => {
  try {

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid participant ID",
      });
    }

    const [registration] = await db
      .select()
      .from(RunRegistrations)
      .where(
        eq(RunRegistrations.id, id)
      );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Participant পাওয়া যায়নি",
      });
    }

    return res.status(200).json({
      success: true,
      data: registration,
    });

  } catch (error) {

    console.error(
      "Get Participant Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Participant data পাওয়া যায়নি",
    });
  }
};


// ==========================================
// APPROVE / REJECT PAYMENT
// ==========================================

export const updatePaymentStatus = async (req, res) => {
 
  try {



    const { id } = req.params;
    const { status } = req.body;

    // -----------------------------------------------
    // Validate status
    // -----------------------------------------------

    if (
      !["pending", "approved", "rejected"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const registrationId = Number(id);

    if (Number.isNaN(registrationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID",
      });
    }

    // -----------------------------------------------
    // Find registration
    // -----------------------------------------------

    const [registration] = await db
      .select()
      .from(RunRegistrations)
      .where(
        eq(
          RunRegistrations.id,
          registrationId
        )
      );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

console.log("========== PAYMENT DEBUG ==========");

console.log("ID:", registrationId);
console.log("STATUS:", status);

console.log("REGISTRATION:", registration);

console.log("EMAIL:", registration.email);

console.log(
  "EMAIL SENT:",
  registration.emailNotificationSent
);

    console.log("Payment status update:", {
      id: registrationId,
      oldStatus: registration.paymentStatus,
      newStatus: status,
      email: registration.email,
      emailNotificationSent:
        registration.emailNotificationSent,
    });

    // -----------------------------------------------
    // Update payment status
    // -----------------------------------------------

    await db
      .update(RunRegistrations)
      .set({
        paymentStatus: status,

        paymentVerifiedAt:
          status === "approved"
            ? new Date()
            : null,

        updatedAt: new Date(),
      })
      .where(
        eq(
          RunRegistrations.id,
          registrationId
        )
      );

    // =================================================
    // SEND EMAIL ONLY WHEN APPROVED
    // =================================================

   if (status === "approved") {

  console.log("================================");
  console.log("💳 PAYMENT APPROVED");
  console.log("================================");

  console.log("Registration ID:", registrationId);
  console.log("Email:", registration.email);
  console.log(
    "Email notification sent:",
    registration.emailNotificationSent
  );

  if (!registration.email) {

    console.log(
      "❌ No email address found"
    );

  } else {

    console.log(
      "📧 Calling sendPaymentApprovedEmail..."
    );

    const emailResult =
      await sendPaymentApprovedEmail({
        email: registration.email,

        fullName:
          registration.fullName,

        transactionId:
          registration.transactionId,

        tShirtSize:
          registration.tShirtSize,

        tShirtPrice:
          registration.tShirtPrice,
      });

    console.log(
      "📨 EMAIL RESULT:",
      emailResult
    );

    if (emailResult.success) {

      await db
        .update(RunRegistrations)
        .set({
          emailNotificationSent: 1,
          updatedAt: new Date(),
        })
        .where(
          eq(
            RunRegistrations.id,
            registrationId
          )
        );

      console.log(
        "✅ Email sent and database updated"
      );

    } else {

      console.error(
        "❌ Email sending failed:",
        emailResult
      );

    }
  }
}
    // -----------------------------------------------
    // Final registration
    // -----------------------------------------------

    const [finalRegistration] =
      await db
        .select()
        .from(RunRegistrations)
        .where(
          eq(
            RunRegistrations.id,
            registrationId
          )
        );

    return res.status(200).json({
      success: true,

      message:
        `Payment ${status} successfully`,

      data: finalRegistration,
    });

  } catch (error) {

    console.error(
      "Update Payment Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update payment status",
      error: error.message,
    });
  }
};
export const getDashboardStats = async (req, res) => {
  try {

    const registrations = await db
      .select()
      .from(RunRegistrations);

    const total = registrations.length;

    const pending = registrations.filter(
      (item) =>
        item.paymentStatus === "pending"
    ).length;

    const approved = registrations.filter(
      (item) =>
        item.paymentStatus === "approved"
    ).length;

    const rejected = registrations.filter(
      (item) =>
        item.paymentStatus === "rejected"
    ).length;

    const totalCollection =
      registrations
        .filter(
          (item) =>
            item.paymentStatus === "approved"
        )
        .reduce(
          (sum, item) =>
            sum +
            Number(item.tShirtPrice || 0),
          0
        );

    return res.status(200).json({
      success: true,

      data: {
        total,
        pending,
        approved,
        rejected,
        totalCollection,
      },
    });

  } catch (error) {

    console.error(
      "Dashboard Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Dashboard statistics পাওয়া যায়নি",
    });
  }
};