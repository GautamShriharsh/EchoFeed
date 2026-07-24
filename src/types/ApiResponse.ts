import { Message } from "@/models/User";
import { User } from "next-auth";


export interface ApiResponse {
    success: boolean;
    message?: string;
    isAcceptingMessage?: boolean;
    updatedUser?: User
    messages?: Array<Message>
    error?: string
}

