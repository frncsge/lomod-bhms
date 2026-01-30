import transporter from "../config/mailer.js";

export const sendEmailVerificationLink = async (
  verificationLink,
  receiverEmail,
) => {
  await transporter.sendMail({
    from: `"Francel Boarding House" <${process.env.SMTP_USER}>`,
    to: receiverEmail,
    subject: "Francel BHMS Email Verification",
    html: `<h2>Welcome to Francel BHMS!</h2>
             <p>Click the link below to verify your email. Expires in 3 minutes.</p>
             <a href="${verificationLink}">Verify Email</a>
      `,
  });
};
