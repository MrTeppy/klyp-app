"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function RetroShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const links = [
    ["/feed", "home"],
    ["/upload", "post song"],
    ["/profile", "my profile"],
    ["/friends", "friends"],
    ["/messages", "messages"],
    ["/search", "search"],
  ];

  return (
    <main
      className="min-h-screen text-[#333] [font-family:Arial,Helvetica,sans-serif]"
      style={{
        backgroundColor: "#dce8f4",
        backgroundImage:
          "radial-gradient(#b8cce2 0.8px, transparent 0.8px), linear-gradient(180deg, #dce8f4 0%, #cfdff0 55%, #e8f0f8 100%)",
        backgroundSize: "9px 9px, 100% 100%",
      }}
    >
      <style>{`
        .klyp-oldweb-glass {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.65),
            0 1px 0 rgba(30,74,128,.12);
        }

        .klyp-linkline button:hover {
          background: rgba(255,255,255,.08);
        }

        .klyp-box {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.8),
            1px 1px 0 rgba(90,143,194,.14);
        }

        .klyp-box-title {
          text-shadow: 0 1px 0 rgba(0,0,0,.22);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.22);
        }

        .klyp-tiny-tab {
          border: 1px solid #b0c8e0;
          background: linear-gradient(180deg, #fff 0%, #edf5fd 100%);
          padding: 2px 6px;
          color: #1a4a99;
          font-size: 10px;
        }
      `}</style>
      <header className="border-b-2 border-[#1e4a80] bg-gradient-to-b from-[#5b8ecc] via-[#3d6fad] to-[#2f5c99] px-3 py-2">
        <div className="mx-auto flex max-w-[900px] items-center justify-between">
          <button onClick={() => router.push("/feed")} className="text-left">
            <div className="font-serif text-[30px] font-bold leading-7 text-white drop-shadow">
              <span className="text-[#a8caf0]">[</span>klyp<span className="text-[#a8caf0]">]</span>
            </div>
            <div className="mt-1 text-[10px] italic text-[#b8d4f0]">
              music. memory. people who get it.
            </div>
          </button>

          <div className="text-right text-[11px] text-[#c8dff5]">
            <div>klyp.life</div>
            <div className="text-[10px] text-[#a8c8f0]">
              {user ? "signed in" : "new here?"}
            </div>
          </div>
        </div>
      </header>

      <nav className="klyp-oldweb-glass border-b border-[#1e4270] bg-gradient-to-b from-[#3567a5] to-[#244f87] px-3 py-1">
        <div className="klyp-linkline mx-auto flex max-w-[900px] flex-wrap items-center text-[11px]">
          {links.map(([href, label]) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`border-r border-[#3a6aaa] px-2 py-[1px] ${
                pathname === href
                  ? "font-bold text-white"
                  : "text-[#c8dff5] hover:text-white hover:underline"
              }`}
            >
              {label}
            </button>
          ))}

          <div className="ml-auto flex items-center">
            {user ? (
              <button onClick={signOut} className="px-2 text-[#ffd0c8] hover:underline">
                sign out
              </button>
            ) : (
              <>
                <button onClick={() => router.push("/login")} className="border-r border-[#3a6aaa] px-2 text-[#ffd0c8] hover:underline">
                  login
                </button>
                <button onClick={() => router.push("/signup")} className="px-2 text-[#ffd0c8] hover:underline">
                  sign up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="border-b border-[#b0c8e0] bg-[#eef6ff] px-3 py-[3px] text-[10px] text-[#557799]">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            <span className="klyp-tiny-tab">klyp.life</span>
            <span className="klyp-tiny-tab">beta</span>
            <span className="klyp-tiny-tab">music profiles</span>
          </div>
          <div className="hidden sm:block">
            online now: friends · support · new posts
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#7aaad5] to-[#5a8fc2] px-3 py-1 text-[12px] font-bold text-white">
        <div className="mx-auto max-w-[900px]">
          {title} <span className="font-normal text-[#d8eaf8]">{subtitle || ""}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-2 py-2">{children}</div>

      <footer className="mt-4 border-t border-[#b0c8e0] bg-[#e8f0f8] p-4 text-center text-[10px] text-[#6688aa]">
        <button onClick={() => router.push("/about")} className="text-[#1a4a99] hover:underline">about</button>
        {" · "}
        <button onClick={() => router.push("/faq")} className="text-[#1a4a99] hover:underline">faq</button>
        {" · "}
        <button onClick={() => router.push("/terms")} className="text-[#1a4a99] hover:underline">terms</button>
        {" · "}
        <button onClick={() => router.push("/privacy")} className="text-[#1a4a99] hover:underline">privacy</button>
        {" · "}
        <button onClick={() => router.push("/contact")} className="text-[#1a4a99] hover:underline">contact</button>
        <br />
        <br />
        [klyp] 2026 · klyp.life · music. memory. people who get it.
      </footer>
    </main>
  );
}

export function RetroBox({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="klyp-box mb-2 border border-[#9fbad6] bg-white">
      <div className="klyp-box-title bg-gradient-to-b from-[#72a5d3] via-[#5a8fc2] to-[#3f72a8] px-2 py-1 text-[11px] font-bold text-white">
        {title}
      </div>
      <div className="p-2 text-[12px]">{children}</div>
    </section>
  );
}

export function RetroButton({
  children,
  onClick,
  primary,
  danger,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`border px-3 py-1 text-[11px] disabled:opacity-50 ${
        primary
          ? "border-[#1e4a80] bg-[#2f5c99] font-bold text-white"
          : danger
          ? "border-[#cc6666] bg-[#fff0f0] text-[#660000]"
          : "border-[#7aacca] bg-gradient-to-b from-[#ffffff] via-[#edf5fd] to-[#d7e7f6] text-[#1a3a66] shadow-[inset_0_1px_0_rgba(255,255,255,.9)]"
      }`}
    >
      {children}
    </button>
  );
}

export function MiniAvatar({
  label = "ME",
  src,
  size = "sm",
}: {
  label?: string;
  src?: string | null;
  size?: "sm" | "lg";
}) {
  const box = size === "lg" ? "h-[150px] w-full text-[44px]" : "h-10 w-10 text-[12px]";
  const initials = (label || "ME").slice(0, 2).toUpperCase();

  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden border border-[#b0c8e0] bg-[#3d6fad] font-bold text-white ${box}`}>
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

