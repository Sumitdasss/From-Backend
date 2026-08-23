export const sendPaymentApprovedWhatsApp = async ({
  mobile,
  fullName,
  transactionId,
  tShirtSize,
  tShirtPrice,
}) => {

  if (!mobile) {
    return {
      success: false,
      message: "Participant has no mobile number",
    };
  }

  try {

    // ============================
    // Bangladesh number formatting
    // ============================

    let phone = String(mobile)
      .replace(/\D/g, "");

    if (phone.startsWith("0")) {
      phone = "880" + phone.substring(1);
    }

    // Example:
    // 01812345678
    // ↓
    // 8801812345678


    const version =
      process.env.WHATSAPP_GRAPH_API_VERSION ||
      "v23.0";

    const phoneNumberId =
      process.env.WHATSAPP_PHONE_NUMBER_ID;

    const accessToken =
      process.env.WHATSAPP_ACCESS_TOKEN;

    const templateName =
      process.env.WHATSAPP_TEMPLATE_NAME ||
      "payment_approved";

    const language =
      process.env.WHATSAPP_TEMPLATE_LANGUAGE ||
      "en_US";


    const url =
      `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;


    // ============================
    // WhatsApp Template
    // ============================

    const response = await fetch(url, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${accessToken}`,
      },

      body: JSON.stringify({

        messaging_product: "whatsapp",

        to: phone,

        type: "template",

        template: {

          name: templateName,

          language: {
            code: language,
          },

          components: [

            {
              type: "body",

              parameters: [

                {
                  type: "text",
                  text: fullName,
                },

                {
                  type: "text",
                  text: transactionId,
                },

                {
                  type: "text",
                  text: tShirtSize,
                },

                {
                  type: "text",
                  text: `৳${tShirtPrice}`,
                },

              ],
            },

          ],

        },

      }),

    });


    const data =
      await response.json();


    if (!response.ok) {

      console.error(
        "WhatsApp API Error:",
        data
      );

      return {
        success: false,
        error: data,
      };
    }


    console.log(
      "WhatsApp message sent:",
      data
    );


    return {
      success: true,
      data,
    };


  } catch (error) {

    console.error(
      "WhatsApp sending failed:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};