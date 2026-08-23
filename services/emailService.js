import nodemailer from "nodemailer";


// =====================================================
// GMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// =====================================================
// CHECK SMTP CONNECTION
// =====================================================

try {
  await transporter.verify();

  console.log("✅ Gmail SMTP Server Ready");

} catch (error) {

  console.error(
    "❌ Gmail SMTP Error:",
    error.message
  );
}


// =====================================================
// SEND PAYMENT APPROVED EMAIL
// =====================================================

export const sendPaymentApprovedEmail = async ({
  email,
  fullName,
  transactionId,
  tShirtSize,
  tShirtPrice,
}) => {

  console.log("================================");
  console.log("📧 PAYMENT APPROVED EMAIL");
  console.log("================================");

  console.log("To:", email);
  console.log("Name:", fullName);
  console.log("Transaction:", transactionId);


  // ===================================================
  // EMAIL CHECK
  // ===================================================

  if (!email) {

    console.log(
      "❌ Participant email পাওয়া যায়নি"
    );

    return {
      success: false,
      message: "Participant has no email",
    };
  }


  try {

    // =================================================
    // MAIL DATA
    // =================================================

    const mailOptions = {

      from: `"Fulgazi Runners Community" <${process.env.EMAIL_USER}>`,

      to: email,

      subject:
        "🏃 Fulgazi 5K Run - Payment Approved",

      html: `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
Fulgazi 5K Run
</title>

</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial,sans-serif;
  "
>

  <div
    style="
      max-width:600px;
      margin:30px auto;
      background:#ffffff;
      border-radius:12px;
      overflow:hidden;
      border:1px solid #eeeeee;
    "
  >

    <!-- HEADER -->

    <div
      style="
        background:#db2777;
        padding:30px 20px;
        text-align:center;
        color:white;
      "
    >

      <h1 style="margin:0;">
        🏃 Fulgazi Runners Community
      </h1>

      <p>
        Fulgazi 5K Run
      </p>

    </div>


    <!-- BODY -->

    <div
      style="
        padding:30px;
        color:#333333;
      "
    >

      <h2>
        Payment Approved ✅
      </h2>


      <p>
        Dear
        <strong>${fullName}</strong>,
      </p>


      <p>
        আপনার Fulgazi 5K Run registration-এর
        payment সফলভাবে গ্রহণ করা হয়েছে।
      </p>


      <!-- DETAILS -->

      <div
        style="
          background:#fdf2f8;
          padding:20px;
          border-radius:10px;
          margin-top:20px;
        "
      >

        <p>
          <strong>
            Transaction ID:
          </strong>

          ${transactionId}
        </p>


        <p>
          <strong>
            T-Shirt Size:
          </strong>

          ${tShirtSize}
        </p>


        <p>
          <strong>
            Registration Fee:
          </strong>

          ৳${tShirtPrice}
        </p>


        <p>

          <strong>
            Payment Status:
          </strong>

          <span
            style="
              color:green;
              font-weight:bold;
            "
          >
            Approved
          </span>

        </p>

      </div>


      <p
        style="
          margin-top:25px;
        "
      >
        আপনার registration এখন confirmed।
      </p>


      <p>
        🏃 Run • Inspire • Achieve
      </p>

    </div>

  </div>

</body>

</html>
      `,
    };


    // =================================================
    // SEND
    // =================================================

    console.log(
      "📤 Sending email..."
    );


    const info =
      await transporter.sendMail(mailOptions);


    // =================================================
    // SMTP RESPONSE
    // =================================================

    console.log(
      "✅ Email request accepted by Gmail"
    );

    console.log(
      "Message ID:",
      info.messageId
    );

    console.log(
      "Accepted:",
      info.accepted
    );

    console.log(
      "Rejected:",
      info.rejected
    );


    // =================================================
    // CHECK IF GMAIL ACCEPTED EMAIL
    // =================================================

    if (
      !info.accepted ||
      info.accepted.length === 0
    ) {

      console.error(
        "❌ Gmail did not accept the email"
      );

      return {
        success: false,

        message:
          "Gmail did not accept the email",

        accepted:
          info.accepted,

        rejected:
          info.rejected,
      };
    }


    return {

      success: true,

      message:
        "Payment approval email sent",

      messageId:
        info.messageId,

      accepted:
        info.accepted,

      rejected:
        info.rejected,

    };


  } catch (error) {

    console.error(
      "❌ Email sending failed"
    );

    console.error(
      "Error:",
      error.message
    );


    return {

      success: false,

      message:
        "Email sending failed",

      error:
        error.message,

    };
  }
};