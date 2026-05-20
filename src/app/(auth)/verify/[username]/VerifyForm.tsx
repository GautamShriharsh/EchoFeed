"use client";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

function VerifyForm({ username }: { username: string }) {
  const router = useRouter();
  //const { username } = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username,
        code: data.code,
      });

      toast("Success", {
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verifying user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast("Verification failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              Verify Your Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Enter the verification code sent to your email to activate your
              EchoFeed account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="code" className="text-sm text-zinc-300">
                    Verification Code
                  </FieldLabel>

                  <Input
                    {...field}
                    id="code"
                    placeholder="Enter verification code"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    className="
                    h-14
                    rounded-xl
                    border-white/10
                    bg-white/5
                    px-4
                    text-base
                    tracking-widest
                    text-white
                    placeholder:text-zinc-500
                    focus-visible:ring-blue-500/30
                  "
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

                <Button
                type="submit"
                className="
                h-12
                w-full
                rounded-xl
                bg-white
                text-black
                transition-all
                hover:bg-zinc-200
                "
                >
                Verify Account
                </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <p className="text-sm text-zinc-400">
              Your account will be activated after successful verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyForm;
