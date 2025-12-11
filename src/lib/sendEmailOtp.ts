import nodemailer from "nodemailer";

export async function sendEmailOtp(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Email Verification",
    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lokalads Verification Code</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0px;
      background-color: #f8f8f8;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      style="
        border: 0px;
        width: 100%;
        border-collapse: collapse;
        background-color: white;
      "
    >
      <!--  Main header section -->
      <tr>
        <td
          style="
            border: 0px;
            padding-bottom: 14px;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 20px;
          "
        >
          <img
            src="https://www.lokalads.com/la-logo.png"
            style="width: 190px; height: auto"
          />
        </td>
      </tr>
      <!--  Main body section -->
      <tr>
        <td
          style="
            border: 0px;
            padding-top: 4px;
            padding-left: 20px;
            padding-right: 20px;
          "
        >
          <p
            style="
              font-size: 18px;
              color: #333;
              line-height: 1.55;
              padding: 0;
              padding-bottom: 18px;
              margin: 0;
            "
          >
            Use this one-time passcode (OTP) to verify your email address for
            your lokalads account.
          </p>
          <p
            style="
              background-color: #f2f3f5;
              border-left: 6px solid #ff3366;
              padding: 14px 18px;
              font-size: 32px;
              font-weight: bold;
              margin-top: 0;
              margin-bottom: 8px;
            "
          >
            ${otp}
          </p>
          <p
            style="
              font-size: 16px;
              color: #777;
              font-style: italic;
              padding: 0px;
              padding-bottom: 16px;
              margin: 0px;
            "
          >
            For your security, do not share this code with anyone.
          </p>
          <p
            style="
              font-size: 18px;
              color: #555;
              padding-bottom: 18px;
              margin: 0;
            "
          >
            This code will expire in <b>10 minutes</b>.
          </p>
          <hr
            style="
              border: none;
              border-top: 1px solid #d1d1d1;
              padding: 0;
              margin: 0;
            "
          />
        </td>
      </tr>
      <!--  Main footer section -->
      <tr>
        <td
          style="
            border: none;
            padding-bottom: 14px;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 14px;
            font-size: 16px;
            color: #777;
          "
        >
          <p style="margin: 0 0 8px 0; font-size: 16px; color: #777">
            Please do not reply to this email – it’s an automatic message from
            an unmonitored account.
          </p>
          <p style="margin: 0">© 2025 lokalads.com – All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
  };

  await transporter.sendMail(mailOptions);
}
