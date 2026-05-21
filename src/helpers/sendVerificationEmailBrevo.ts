import { BrevoClient } from "@getbrevo/brevo";
import { ApiResponse } from "@/types/ApiResponse";

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await client.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL!,
        name: "EchoFeed",
      },

      to: [
        {
          email,
          name: username,
        },
      ],

      subject: "EchoFeed | Verification Code",

      htmlContent: `
    <div style="font-family:sans-serif">
      <h2>Hello ${username}</h2>
      <p>Your verification code is:</p>
      <h1>${verifyCode}</h1>
      <p>This code expires in 1 hour.</p>
    </div>
  `,
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email", error);

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
