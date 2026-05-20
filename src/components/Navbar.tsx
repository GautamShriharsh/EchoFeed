"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="
        sticky top-0 z-50
        border-b border-white/[0.04]
        bg-[#020617]/95
        backdrop-blur-md
      ">
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent"
        >
          EchoFeed
        </Link>

        {/* Right Section */}
        {session ? (
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
                Signed In As
              </span>

              <span className="text-sm font-semibold text-gray-200">
                {user.username || user.email}
              </span>
            </div>

            {/* Logout */}
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="
                h-10 rounded-xl
                border border-white/10
                bg-[#0f172a]
                px-5
                text-white
                backdrop-blur-md
                transition-all duration-200
                hover:bg-white
                hover:text-black
                hover:shadow-lg
              "
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button
              variant="outline"
              className="
                h-10 rounded-xl
                border border-white/10
                bg-[#0f172a]
                px-5
                text-white
                backdrop-blur-md
                transition-all duration-200
                hover:bg-white
                hover:text-black
                hover:shadow-lg
              "
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
