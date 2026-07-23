"use client";
import {
  Card,
  CardDescription,
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
import { useState } from "react";
import FlaggedMessage from "./FlaggedMessage";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>("/api/delete-message", {
      data: {
        messageId: message._id,
      },
    });
    toast(response.data.success ? "Success" : "Error", {
      description: response.data.message,
    });
    onMessageDelete(message._id.toString());
  };

  const [revealed, setRevealed] = useState(false);

  return (
    <Card
      className="
        group
        overflow-hidden
        border border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
        text-white
        shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        rounded-2xl
        transition-all duration-300
        hover:border-cyan-400/20
        hover:bg-white/[0.05]
      "
    >
      {/* CardHeader is now relative and stacks content vertically */}
      <CardHeader className="relative space-y-1">
        {/* Main Content */}
        <div className="w-full">
          {message.isFlagged && !revealed ? (
            <FlaggedMessage
              category={message.flaggedCategory}
              onReveal={() => setRevealed(true)}
            />
          ) : (
            <CardTitle className="text-lg font-semibold text-gray-100 pr-8">
              {message.content}
            </CardTitle>
          )}
        </div>

        {/* Timestamp */}
        <CardDescription className="text-sm text-gray-400 mb-0 pb-0">
          {new Date(message.createdAt).toLocaleString([], {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </CardDescription>

        {/* Floating Delete Button (Top-Right) */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="
                absolute top-1 right-2
                h-8 w-8 p-0 rounded-lg
                border border-white/5
                bg-black/20
                text-gray-500
                opacity-0
                group-hover:opacity-100
                transition-all duration-200
                hover:cursor-pointer
                hover:bg-white/10
                hover:text-white
              "
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent
            className="border border-white/10
              bg-[#0b1120]
              backdrop-blur-2xl
              text-white
              shadow-2xl
              overflow-hidden
              p-0"
          >
            <AlertDialogHeader className="px-6 pt-6">
              <AlertDialogTitle>Delete Message?</AlertDialogTitle>

              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently remove the
                anonymous message.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="bg-[#10182b] px-6 py-4 border-t border-white/5 flex items-center">
              <AlertDialogCancel className="border-white/10 bg-[#101d3b] text-gray-600 hover:bg-white hover:text-black mb-2">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/10 mb-2"
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