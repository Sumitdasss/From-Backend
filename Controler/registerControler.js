import { db } from "../db/index.js";
import {
  RunRegistrations,
  RunTShirts,
} from "../db/schema.js";

import { eq } from "drizzle-orm";
import {
  sendPaymentApprovedEmail,
} from "../services/emailService.js";




export const ParticipentRegister = async (req, res) => {
  try {
    const {
      fullName,
      age,
      mobile,
      address,
      email,
      tShirtSize,
      paymentNumber,
      transactionId,
    } = req.body;

    if (
      !fullName ||
      !age ||
      !mobile ||
      !address ||
      !tShirtSize ||
      !paymentNumber ||
      !transactionId
    ) {
      return res.status(400).json({
        success: false,
        message: "সব required field পূরণ করুন",
      });
    }

    // T-shirt database থেকে বের করা
    const [shirt] = await db
      .select()
      .from(RunTShirts)
      .where(eq(RunTShirts.size, tShirtSize));

    if (!shirt) {
      return res.status(400).json({
        success: false,
        message: "Invalid T-shirt size",
      });
    }

    // Stock check
    if (shirt.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "এই T-shirt size-এর stock শেষ",
      });
    }

    // ==============================
    // CLOUDINARY UPLOAD
    // ==============================

    const paymentScreenshot =
  req.file?.path || null;

console.log("Uploaded File:", req.file);
console.log(
  "Cloudinary URL:",
  paymentScreenshot
);

    // ==============================
    // DATABASE INSERT
    // ==============================

    const [registration] = await db
      .insert(RunRegistrations)
      .values({
        fullName,

        age: Number(age),

        mobile,

        address,

        email: email || null,

        tShirtSize,

        // Price DB থেকে
        tShirtPrice: shirt.price,

        paymentNumber,

        transactionId,

        paymentScreenshot,

        // Admin পরে verify করবে
        paymentStatus: "pending",
      })
      .returning();

    // ==============================
    // STOCK UPDATE
    // ==============================

    await db
      .update(RunTShirts)
      .set({
        stock: shirt.stock - 1,
      })
      .where(eq(RunTShirts.id, shirt.id));

    return res.status(201).json({
      success: true,

      message:
        "Registration submitted successfully",

      data: registration,
    });

  } catch (error) {

    console.error(
      "Participant Registration Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

export const getTShirtSize = async (req, res) => {
  try {
    const shirts = await db
      .select({
        id: RunTShirts.id,
        size: RunTShirts.size,
        price: RunTShirts.price,
        stock: RunTShirts.stock,
      })
      .from(RunTShirts);

    return res.status(200).json({
      success: true,
      data: shirts,
    });

  } catch (err) {
    console.error(
      "Get T-Shirt Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "T-Shirt data পাওয়া যায়নি",
    });
  }
};

export const deleteTshirt = async (req, res) => {
  try {
    const { id } = req.params;

    const tshirtId = Number(id);

    if (Number.isNaN(tshirtId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid T-Shirt ID",
      });
    }

    // T-Shirt আছে কিনা check
    const [tshirt] = await db
      .select()
      .from(RunTShirts)
      .where(eq(RunTShirts.id, tshirtId));

    if (!tshirt) {
      return res.status(404).json({
        success: false,
        message: "T-Shirt not found",
      });
    }

    // Delete
    await db
      .delete(RunTShirts)
      .where(eq(RunTShirts.id, tshirtId));

    return res.status(200).json({
      success: true,
      message: "T-Shirt deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete T-Shirt Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete T-Shirt",
      error: error.message,
    });
  }
};



export const createTshirt = async (req, res) => {
  try {
    const {
      size,
      price,
      stock,
    } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (!size || !size.trim()) {
      return res.status(400).json({
        success: false,
        message: "T-Shirt size is required",
      });
    }

    const tshirtPrice = Number(price);
    const tshirtStock = Number(stock);

    if (!price || Number.isNaN(tshirtPrice) || tshirtPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    if (Number.isNaN(tshirtStock) || tshirtStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid stock is required",
      });
    }

    const tshirtSize = size.trim().toUpperCase();

    // ==============================
    // CHECK DUPLICATE SIZE
    // ==============================

    const [existingTshirt] = await db
      .select()
      .from(RunTShirts)
      .where(eq(RunTShirts.size, tshirtSize));

    if (existingTshirt) {
      return res.status(409).json({
        success: false,
        message: `${tshirtSize} size already exists`,
      });
    }

    // ==============================
    // INSERT
    // ==============================

    const [newTshirt] = await db
      .insert(RunTShirts)
      .values({
        size: tshirtSize,
        price: tshirtPrice,
        stock: tshirtStock,
      })
      .returning();

    // ==============================
    // RESPONSE
    // ==============================

    return res.status(201).json({
      success: true,
      message: "T-Shirt added successfully",
      data: newTshirt,
    });

  } catch (error) {

    console.error(
      "Create T-Shirt Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to add T-Shirt",
      error: error.message,
    });
  }
};


export const deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    const registrationId = Number(id);

    if (Number.isNaN(registrationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID",
      });
    }

    // Registration খুঁজে বের করা
    const [registration] = await db
      .select()
      .from(RunRegistrations)
      .where(eq(RunRegistrations.id, registrationId));

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Registration delete
    await db
      .delete(RunRegistrations)
      .where(eq(RunRegistrations.id, registrationId));

    // T-shirt stock আবার ১ বাড়ানো
    const [shirt] = await db
      .select()
      .from(RunTShirts)
      .where(eq(RunTShirts.size, registration.tShirtSize));

    if (shirt) {
      await db
        .update(RunTShirts)
        .set({
          stock: shirt.stock + 1,
        })
        .where(eq(RunTShirts.id, shirt.id));
    }

    return res.status(200).json({
      success: true,
      message: "Participant deleted successfully",
    });

  } catch (error) {
    console.error("Delete Participant Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete participant",
      error: error.message,
    });
  }
};