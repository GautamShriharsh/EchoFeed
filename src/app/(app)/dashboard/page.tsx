"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { ObjectId } from "mongoose";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { resolve } from "path";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id.toString() !== messageId),
    );
  };

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: true,
    },
  });

  const { handleSubmit, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("acceptMessages", response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to fetch accept message status",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages`);

        if (response.data.success) {
          setMessages(response.data.messages || []);
        }
        if (refresh) {
          toast("Refreshed Messages", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

        toast("Error", {
          description:
            axiosError.response?.data.message ||
            "Failed to fetch accept message status",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages],
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchAcceptMessage();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", response.data.isAcceptingMessage ?? false);
      toast("Success", {
        description: "Status updated successfully",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to update message status",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const username = session?.user?.username;
  console.log(session);

  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  //another easier way to get baseURL 'http://localhost:3000
  //const baseURL = `${window.location.origin}`

  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("URL Copied!", {
      description: "Profile URL has been copied to clipboard.",
    });
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1120] via-[#111827] to-black text-white tracking-[-0.04em]">
      {/* Main Container */}
      <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent ">
            {session?.user?.username}&apos;s dashboard
          </h1>

          <p className="mt-4 text-base text-gray-400 ">
            Manage your anonymous message experience
          </p>
        </div>

        {/* Profile Link Section */}
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-100 mb-4 ">
            Copy Your Unique Link
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="
              h-12 w-full rounded-2xl
              border border-white/10
              bg-white/5
              px-5
              text-gray-300
              backdrop-blur-md
              outline-none
            "
            />

            <Button
              onClick={copyToClipboard}
              className="
              h-12 rounded-2xl
              bg-white text-black
              hover:bg-gray-200
              transition-all duration-200
              font-semibold
              px-8
            "
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Messages */}
        <div className="mb-12 flex items-center justify-between max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-sm">
          <div>
            <h3 className="text-xl font-semibold text-gray-100 ">
              Accept Anonymous Messages
            </h3>

            <p className="mt-1 text-sm text-gray-400 ">
              Allow others to send you anonymous feedback
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Controller
              control={form.control}
              name="acceptMessages"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={handleSwitchChange}
                />
              )}
            />

            <span className="text-sm font-medium text-gray-300">
              {acceptMessages ? "On" : "Off"}
            </span>
          </div>
        </div>

        {/* Separator */}
        <Separator className="bg-white/10 mb-12" />

        {/* Messages Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-100">Your Messages</h2>

            <p className="mt-2 text-gray-400">
              View and manage received anonymous messages
            </p>
          </div>

          <Button
            className="
            h-12 w-12 rounded-2xl
            border border-white/10
            bg-white/5
            text-white
            hover:bg-white
            hover:text-black
            transition-all duration-200
          "
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
              <p className="text-lg text-gray-400">No messages to display.</p>

              <p className="mt-2 text-sm text-gray-500">
                Share your profile link to start receiving anonymous messages.
              </p>
            </div>
          )}
        </div>
        {/* Footer CTA */}
        <div className="mt-20 border-t border-white/10 pt-10 text-center">
          <p className="text-lg md:text-xl text-gray-300 font-medium">
            Share your unique link to start receiving anonymous messages
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Your identity always stays private on EchoFeed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
