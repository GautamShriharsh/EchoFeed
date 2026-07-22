"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { MessageSquare, SendHorizonal, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function SendMessagePage() {
  const { username } = useParams<{ username: string }>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const fetchSuggestions = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post("/api/suggest-messages");

      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error in generating suggestions", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast("Failed to get suggestions", {
        description: errorMessage,
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/send-message`, {
        username,
        content: data.content,
      });

      toast("Success", {
        description: response.data.message,
      });

      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast("Failed to send message", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-12">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
              <MessageSquare className="h-8 w-8 text-blue-400" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              Send Anonymous Message
            </h1>

            <p className="mt-3 text-base text-zinc-400">
              Share your thoughts anonymously with{" "}
              <span className="font-semibold text-white">@{username}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="content"
                    className="text-sm text-zinc-300"
                  >
                    Your Message
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id="content"
                      placeholder="Write something anonymous..."
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      className="h-14 rounded-xl border-white/10 bg-white/5 px-4 text-base text-white placeholder:text-zinc-500 focus-visible:ring-blue-500/30"
                    />

                    <Sparkles className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-white text-black transition-all hover:bg-zinc-200"
            >
              <SendHorizonal className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </form>

          <div className="mt-4 space-y-4">
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={fetchSuggestions}
                disabled={isSuggestLoading}
                className="min-w-[220px] rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
              >
                {isSuggestLoading
                  ? "Generating suggestions..."
                  : "Suggest Messages"}
              </Button>
            </div>
            {suggestions.length > 0 && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => form.setValue("content", suggestion)}
                      className="
                            rounded-2xl
                            border border-white/10
                            bg-white/[0.03]
                            p-4
                            text-left
                            text-sm
                            text-zinc-200
                            transition-all
                            hover:border-white/20
                            hover:bg-white/[0.06]
                            hover:shadow-lg
                            min-h-[140px]
                            flex items-start
                          "
                    >
                      <span className="leading-7">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer text */}
          <div className="mt-8 rounded-2xl  p-4 text-center">
            <p className="text-sm text-zinc-400">
              Your identity remains completely anonymous.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendMessagePage;
