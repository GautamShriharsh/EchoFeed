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
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2}  from "lucide-react";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignIn = () => {
 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  //zod implementation for form validation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
   // setIsSubmitting(true);
    
    const result = await signIn('credentials',{
      redirect: false,
      identifier: data.identifier,
      password: data.password
     })

     if (result?.error) {
      toast("Sign In Failed", {
        description: "Incorrect username or password"
      })
     }

     if (result?.url) {
        router.replace('/dashboard')
      }


  };

   
return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b1120] via-[#111827] to-black px-4 py-10 text-white">
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-8 md:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>

        <p className="mt-4 text-sm md:text-base text-gray-400">
          Sign In to continue your anonymous adventure
        </p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Identifier */}
        <Controller
          name="identifier"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="email"
                className="text-gray-200"
              >
                Email or Username
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
                autoComplete="password"
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
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl bg-white text-black hover:bg-gray-200 transition-all duration-200 font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center mt-8 text-gray-400">
        <p>
          Do not have an account?{" "}
          <Link
            href="/sign-up"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  </div>
)

};  

export default SignIn;
