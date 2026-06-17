import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { SiteContainer } from "@/shared/components/layout/site-container";
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
    <footer className="relative overflow-hidden  ">
      <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-12 h-64 w-64 rounded-full bg-primary/7 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-64 w-64 rounded-full bg-secondary/7 blur-3xl" />

      <SiteContainer className="relative w-full py-10   sm:py-12  px-0  p-5  backdrop-blur md:p-7">
        <div className="">
          <div className="grid gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            <div className="max-w-xl">
              <Link href="/" className="inline-flex items-center transition duration-200 hover:-translate-y-0.5 hover:opacity-90">
                <span className="relative block h-10 w-32 sm:h-12 sm:w-40">
                  <Image
                    alt={`${copy.brand} logo`}
                    src="/images/logo-blue.png"
                    fill
                    sizes="(max-width: 640px) 128px, 160px"
                    className="object-contain object-left rtl:object-right dark:brightness-0 dark:invert"
                  />
                </span>
              </Link>

              <p className="mt-4 max-w-md text-[0.9rem] leading-7 text-foreground/68">{copy.footer.description}</p>

              <div className="mt-2 gap-2 flex items-center">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-foreground/48">{copy.footer.socialTitle}</p>
                <div className="flex flex-wrap gap-2.5">
                  {copy.footer.social.map((item) => {
                    const Icon = socialIcons[item.icon];

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        aria-label={item.label}
                        className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E6E8F5] bg-white text-primary transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white dark:border-white/10 dark:bg-slate-900/70 dark:text-[#cdd3ff] dark:hover:border-primary/30 dark:hover:bg-primary dark:hover:text-white"
                      >
                        <Icon className="h-4.5 w-4.5 transition duration-200 group-hover:scale-105 group-hover:text-white dark:text-current" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid gap-7 sm:grid-cols-3">
              <div>
                <h4 className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-foreground/48">{copy.footer.learn}</h4>
                <ul className="mt-3 space-y-2.5 text-[0.88rem] text-foreground/70">
                  <li>
                    <Link href="/courses" className="transition hover:text-primary">
                      {copy.footer.links.courses}
                    </Link>
                  </li>
                  <li>
                    <Link href="/books" className="transition hover:text-primary">
                      {copy.footer.links.textbooks}
                    </Link>
                  </li>
                  <li>
                    <Link href="/articles" className="transition hover:text-primary">
                      {copy.footer.links.articles}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-foreground/48">{copy.footer.company}</h4>
                <ul className="mt-3 space-y-2.5 text-[0.88rem] text-foreground/70">
                  <li>
                    <Link href="/about-us" className="transition hover:text-primary">
                      {copy.footer.links.about}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us#founder" className="transition hover:text-primary">
                      {copy.footer.links.faculty}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us#academy" className="transition hover:text-primary">
                      {copy.footer.links.careers}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-foreground/48">{copy.footer.support}</h4>
                <ul className="mt-3 space-y-2.5 text-[0.88rem] text-foreground/70">
                  <li>
                    <Link href="/about-us#academy" className="transition hover:text-primary">
                      {copy.footer.links.helpCenter}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us#founder" className="transition hover:text-primary">
                      {copy.footer.links.contact}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us" className="transition hover:text-primary">
                      {copy.footer.links.privacy}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border/60 pt-4 text-[0.82rem] text-foreground/55 sm:flex sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {copy.brand}. {copy.footer.copyright}
            </p>
            <p className="mt-2 text-foreground/45 sm:mt-0">Designed for medical education and academic learning.</p>
          </div>
        </div>
      </SiteContainer>
    </footer>
  );
}
