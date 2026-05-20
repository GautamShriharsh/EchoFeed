"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import {
  Mail,
  MessageSquare,
  Shield,
  Sparkles,
} from "lucide-react";


function HomePageClient() {
   return (
    <div className="min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* Hero Section */}
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">
        
        <section className="mb-16 flex max-w-3xl flex-col items-center text-center">
          
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10">
            <MessageSquare className="h-10 w-10 text-blue-400" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Honest Messages.
            <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Zero Identity.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
            EchoFeed lets people send completely anonymous messages,
            feedback, and thoughts — safely and privately.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              <Shield className="h-4 w-4 text-blue-400" />
              Anonymous
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              <Sparkles className="h-4 w-4 text-violet-400" />
              AI Suggestions
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              <Mail className="h-4 w-4 text-cyan-400" />
              Real Feedback
            </div>
          </div>
        </section>

        {/* Carousel */}
        <section className="w-full max-w-4xl">
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/2"
                >
                  <div className="p-2">
                    <Card className="h-full rounded-3xl border border-white/10 bg-white/[0.04] text-white shadow-2xl backdrop-blur-xl transition-all hover:bg-white/[0.06]">
                      
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                          <Mail className="h-5 w-5 text-blue-400" />
                          {message.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-base leading-7 text-zinc-300">
                            {message.content}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {message.received}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="border-white/10 bg-white/10 text-white hover:bg-white/20" />
            <CarouselNext className="border-white/10 bg-white/10 text-white hover:bg-white/20" />
          </Carousel>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <p className="text-sm text-zinc-500">
            © 2026 EchoFeed. Built for honest conversations.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default HomePageClient;