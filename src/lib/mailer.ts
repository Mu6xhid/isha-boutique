// src/lib/mailer.ts
import nodemailer from "nodemailer";

export async function sendResetMail(to: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER, // your Gmail address
      pass: process.env.SMTP_PASS, // your Gmail app password
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Shop Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: "Password Reset",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });
}
