import SibApiV3Sdk from "sib-api-v3-sdk";

// ==========================
// BREVO CONFIG
// ==========================

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey =
  client.authentications["api-key"];

apiKey.apiKey =
  process.env.BREVO_API_KEY;

// ==========================
// PATIENT EMAIL
// ==========================

export const sendPatientEmail = async (
  toEmail,
  name,
  password
) => {
  try {

    const apiInstance =
      new SibApiV3Sdk.TransactionalEmailsApi();

    const email = {
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME,
      },

      to: [
        {
          email: toEmail,
          name: name,
        },
      ],

      subject:
        "Welcome to SehatConnect 🏥",

      htmlContent: `
        <h2>Hello ${name},</h2>

        <p>
          You have been successfully registered on 
          <b>SehatConnect</b>.
        </p>

        <p><b>Login Details:</b></p>

        <p>Email: ${toEmail}</p>
        <p>Password: ${password}</p>

        <br/>

        <p>
          Please change your password after login.
        </p>

        <p>
          Regards,<br/>
          SehatConnect Team
        </p>
      `,
    };

    await apiInstance.sendTransacEmail(
      email
    );

    console.log(
      "✅ Patient email sent successfully"
    );

  } catch (error) {

    console.error(
      "❌ Patient email failed:",
      error.message
    );
  }
};

// ==========================
// HEALTHWORKER EMAIL
// ==========================

export const sendHealthworkerEmail = async (
  toEmail,
  name,
  password
) => {
  try {

    const apiInstance =
      new SibApiV3Sdk.TransactionalEmailsApi();

    const email = {
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME,
      },

      to: [
        {
          email: toEmail,
          name: name,
        },
      ],

      subject:
        "Welcome Healthworker to SehatConnect 🏥",

      htmlContent: `
        <h2>Hello ${name},</h2>

        <p>
          You have been successfully added as a 
          <b>Healthworker</b> in 
          <b>SehatConnect</b>.
        </p>

        <p><b>Your Login Details:</b></p>

        <p>Email: ${toEmail}</p>
        <p>Password: ${password}</p>

        <br/>

        <p>
          Please login and change your password.
        </p>

        <p>
          Regards,<br/>
          SehatConnect Team
        </p>
      `,
    };

    await apiInstance.sendTransacEmail(
      email
    );

    console.log(
      "✅ Healthworker email sent successfully"
    );

  } catch (error) {

    console.error(
      "❌ Healthworker email failed:",
      error.message
    );
  }
};