"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Message } from "@/models/User";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`,
    );

    toast(response.data.success ? "Success" : "Error", {
      description: response.data.message,
    });
    onMessageDelete(message._id.toString());
  };

  return (
    <Card
      className="
          group
          border border-white/10
          bg-white/5
          backdrop-blur-md
          text-white
          shadow-xl
          rounded-2xl
          transition-all duration-200
          hover:border-white/20
        "
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        {/* Left Content */}
        <div className="space-y-3">
          <CardTitle className="text-lg font-semibold text-gray-100">
            {message.content}
          </CardTitle>

          <CardDescription className="text-sm text-gray-400">
            {new Date(message.createdAt).toLocaleString()}
          </CardDescription>
        </div>

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="
              h-8 w-8 p-0 rounded-lg
              border border-white/5
              bg-black/20
              text-gray-500
              opacity-0
              group-hover:opacity-100
              transition-all duration-200
              hover:bg-white/10
              hover:text-white
            "
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="border border-white/10 bg-[#111827] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Message?</AlertDialogTitle>

              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently remove the
                anonymous message.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white hover:text-black">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
}

export default MessageCard;
