import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { site } from "@/lib/data/site";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/shared/contact-form";
import { InstagramIcon, FacebookIcon, LinkedinIcon } from "@/components/shared/social-icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Marked Minds LLC — questions about Focus + FLEX Academy, partnerships, sponsorships, or media inquiries.",
  alternates: { canonical: "/contact" },
};

const socialLinks = [
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedinIcon },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about what's next."
        description="Whether you're a parent, partner, sponsor, or just curious, our team responds to every message personally."
      />

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Reach us directly
            </h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 flex items-center gap-3 text-lg font-medium text-ink transition-colors hover:text-brand-orange-dark"
            >
              <Mail className="size-5" />
              {site.email}
            </a>
            <p className="mt-6 text-charcoal/70">
              We typically respond within two business days. For urgent
              scholarship or enrollment questions, please note that in your
              message.
            </p>

            <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-charcoal/50">
              Follow Along
            </h3>
            <div className="mt-4 flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-full border border-ink/10 text-ink transition-colors hover:border-brand-orange hover:text-brand-orange-dark"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-mist/60 p-8 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
