"use client"

import Link from "next/link"
import { Heart, Plus } from "lucide-react"
import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight"
        >
          Stays
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/listings/create">
              <Button
                variant="ghost"
                className="gap-2 rounded-full"
              >
                <Plus className="h-4 w-4" />
                Host your home
              </Button>
            </Link>

            <Link
              href="/likes"
              className="rounded-full p-2 hover:bg-muted"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="text-sm font-medium"
            >
              Sign in
            </Link>

            <Link href="/sign-up">
              <Button size="sm" className="rounded-full">
                Sign up
              </Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
