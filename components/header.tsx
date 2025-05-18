"use client"

import Link from "next/link"
import { HelpCircle, Home, Info, Trophy } from "lucide-react"
import { LoginButton } from "@/components/auth/LoginButton"

export default function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-950/80 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Trivia Challenge</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/" icon={<Home className="h-4 w-4" />}>
            Home
          </NavLink>
          <NavLink href="/about" icon={<Info className="h-4 w-4" />}>
            About
          </NavLink>
          <NavLink href="/help" icon={<HelpCircle className="h-4 w-4" />}>
            Help
          </NavLink>
        </nav>

        <div className="flex items-center">
          <LoginButton />
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {icon}
      {children}
    </Link>
  )
}

