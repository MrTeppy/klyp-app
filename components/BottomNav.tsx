"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNav() {
  const pathname = usePathname()

  const item = (href: string, label: string) => {
    const active = pathname === href

    return (
      <Link href={href} className="flex flex-col items-center text-xs">
        <div
          className={`px-3 py-1 rounded-full transition ${
            active
              ? "bg-white/20 text-white"
              : "text-zinc-400"
          }`}
        >
          {label}
        </div>
      </Link>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-around items-center p-3 backdrop-blur-xl bg-black/40 border-t border-white/10">
      {item("/", "Home")}
      {item("/search", "Explore")}

      <Link href="/upload">
        <div className="klyp-button px-4 py-2 text-lg font-bold">
          +
        </div>
      </Link>

      {item("/feed", "Feed")}
      {item("/profile", "Profile")}
    </div>
  )
}
