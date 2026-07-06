"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { primaryNav } from "@/lib/data/nav";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-ink/8 bg-white/85 backdrop-blur-md"
          : "border-b border-transparent bg-white/0",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8"
      >
        <Logo />

        <ul className="hidden items-center gap-8 lg:flex">
          {primaryNav.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative py-2 text-sm font-medium tracking-tight text-charcoal/80 transition-colors hover:text-ink",
                    active && "text-ink",
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-orange" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild size="sm">
            <Link href="/donate">Support Our Mission</Link>
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="sr-only">Menu</DialogTitle>
            <div className="mt-2 flex items-center justify-between">
              <Logo />
            </div>
            <ul className="mt-10 flex flex-col gap-1">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <DialogClose asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-lg px-3 py-3 text-lg font-medium tracking-tight text-ink transition-colors hover:bg-mist",
                        pathname === link.href && "text-brand-orange-dark",
                      )}
                    >
                      {link.label}
                    </Link>
                  </DialogClose>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Button asChild>
                <Link href="/donate">Support Our Mission</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/focus-flex">Explore Focus + FLEX</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
}
