import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "EchoFeed | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    
    console.log(response);

    if (response.error) {
      return {
        success: false,
        message: response.error.message,
      };
    }

    return { success: true, message: "Verificaiton email sent successfully" };
  } catch (emailError) {
    console.log("Error sending verification Email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
