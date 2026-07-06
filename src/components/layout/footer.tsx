import Link from "next/link";
import { Mail } from "lucide-react";

import { footerNav } from "@/lib/data/nav";
import { site } from "@/lib/data/site";
import { Logo } from "@/components/shared/logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { InstagramIcon, FacebookIcon, LinkedinIcon } from "@/components/shared/social-icons";

const socialLinks = [
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedinIcon },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr_1fr_1.3fr]">
          <div className="flex flex-col gap-4">
            <Logo invert />
            <p className="max-w-xs text-sm leading-6 text-white/60">
              {site.legalName} develops innovative educational experiences
              that empower learners, strengthen communities, and inspire
              lifelong curiosity.
            </p>
            <p className="text-sm text-white/60">
              Home of{" "}
              <Link href="/focus-flex" className="text-white underline underline-offset-4 hover:text-brand-orange">
                Focus + FLEX Academy
              </Link>
              <span className="block text-xs uppercase tracking-wide text-white/40">
                A Marked Minds Initiative
              </span>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Quick Links
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Contact
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand-orange hover:text-brand-orange"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Stay Connected
            </h3>
            <p className="mt-4 text-sm text-white/60">
              Get updates on Focus + FLEX sessions, scholarships, and
              community events.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. All rights
            reserved.
          </p>
          <p>Designed and built with purpose.</p>
        </div>
      </div>
    </footer>
  );
}
