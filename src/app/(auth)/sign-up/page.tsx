"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2}  from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [debouncedUsername] = useDebounceValue(username, 300);

  const router = useRouter();

  //zod implementation for form validation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debouncedUsername}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ||
              "Error checking username uniqueness",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      toast("Success", {
        description: response.data.message,
      });

      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast("Signup failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

 
return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b1120] via-[#111827] to-black px-4 py-10 text-white">
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-8 md:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Join EchoFeed
        </h1>

        <p className="mt-4 text-sm md:text-base text-gray-400">
          Sign up to start your anonymous adventure
        </p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Username */}
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="username"
                className="text-gray-200"
              >
                Username
              </FieldLabel>

              <Input
                {...field}
                id="username"
                placeholder="john_doe"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                onChange={(e) => {
                  field.onChange(e);
                  setUsername(e.target.value);
                }}
              />

              {isCheckingUsername && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking username...
                </div>
              )}

              {!isCheckingUsername && usernameMessage && (
                <FieldDescription
                  className={`mt-1 text-sm ${
                    usernameMessage === "Username is already taken"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {usernameMessage}
                </FieldDescription>
              )}

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="email"
                className="text-gray-200"
              >
                Email
              </FieldLabel>

              <Input
                {...field}
                id="email"
                placeholder="john_doe@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500"
              />

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="password"
                className="text-gray-200"
              >
                Password
              </FieldLabel>

              <Input
                {...field}
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500"
              />

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Button */}
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            isCheckingUsername ||
            usernameMessage === "Username is already taken"
          }
          className="w-full h-11 rounded-xl bg-white text-black hover:bg-gray-200 transition-all duration-200 font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center mt-8 text-gray-400">
        <p>
          Already a member?{" "}
          <Link
            href="/sign-in"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  </div>
)
};

export default Page;