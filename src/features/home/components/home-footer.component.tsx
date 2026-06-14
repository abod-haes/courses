import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import type { HomeMessages } from "../home.types";

type HomeFooterProps = Readonly<{
  copy: HomeMessages;
}>;

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.9" cy="7.1" r="1" fill="currentColor" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.2" cy="8.2" r="0.95" fill="currentColor" />
      <path d="M8.2 10.6V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11.4 16v-3.1c0-1.2.9-2.1 2.1-2.1s2 .8 2 2.1V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M13.7 8.4h1.6V6.2c-.3 0-1-.1-1.9-.1-1.7 0-2.8.9-2.8 2.8V11H8.4v2.3h2.2V18h2.5v-4.7h1.9l.3-2.3h-2.2V9.1c0-.5.1-.7.6-.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

const socialIcons: Record<HomeMessages["footer"]["social"][number]["icon"], ComponentType<SVGProps<SVGSVGElement>>> = {
  instagram: InstagramIcon,
  x: XIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
};

export function HomeFooter({ copy }: HomeFooterProps) {
  return (
    <footer className="border-t border-border/60 bg-section-bg">
      <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <span className="relative block h-10 w-[9.5rem] sm:h-11 sm:w-[10.5rem]">
                <Image
                  alt={`${copy.brand} logo`}
                  src="/images/logo-blue.png"
                  fill
                  sizes="(max-width: 640px) 152px, 168px"
                  className="object-contain object-left"
                />
              </span>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-foreground/68">{copy.footer.description}</p>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">{copy.footer.socialTitle}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {copy.footer.social.map((item) => {
                  const Icon = socialIcons[item.icon];

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E8F5] bg-white text-primary transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white dark:border-white/10 dark:bg-slate-900/70 dark:text-[#cdd3ff] dark:hover:border-primary/30 dark:hover:bg-primary dark:hover:text-white"
                    >
                      <Icon className="h-5 w-5 transition duration-200 group-hover:scale-105 group-hover:text-white dark:text-current" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-10 grid-cols-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">{copy.footer.learn}</h4>
              <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                <li>
                  <Link href="#courses" className="transition hover:text-primary">
                    {copy.footer.links.courses}
                  </Link>
                </li>
                <li>
                  <a href="#books" className="transition hover:text-primary">
                    {copy.footer.links.textbooks}
                  </a>
                </li>
                <li>
                  <a href="#articles" className="transition hover:text-primary">
                    {copy.footer.links.articles}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">{copy.footer.company}</h4>
              <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                <li>
                  <a href="#" className="transition hover:text-primary">
                    {copy.footer.links.about}
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    {copy.footer.links.faculty}
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    {copy.footer.links.careers}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">{copy.footer.support}</h4>
              <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                <li>
                  <a href="#" className="transition hover:text-primary">
                    {copy.footer.links.helpCenter}
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    {copy.footer.links.contact}
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    {copy.footer.links.privacy}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-5 text-sm text-foreground/55 sm:flex sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {copy.brand}. {copy.footer.copyright}
          </p>
          <p className="mt-2 sm:mt-0 text-foreground/45">Designed for medical education and academic learning.</p>
        </div>
      </div>
    </footer>
  );
}
