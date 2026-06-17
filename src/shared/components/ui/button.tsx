import Link from "next/link";
import { cn } from "@/shared/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type CommonButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonLinkProps = CommonButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
    href: string;
    className?: string;
  };

type ButtonElementProps = CommonButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary px-5 py-3 text-sm !text-white shadow-[0_8px_22px_rgba(29,23,213,0.14)] hover:bg-primary-strong hover:!text-white hover:shadow-[0_10px_26px_rgba(29,23,213,0.18)] active:translate-y-0 dark:bg-primary dark:!text-white dark:hover:bg-primary/90 dark:hover:!text-white",
  secondary:
    "border border-primary/15 bg-white/86 px-5 py-3 text-sm text-primary shadow-[0_8px_22px_rgba(17,24,39,0.045)] backdrop-blur-md hover:border-primary/25 hover:bg-primary/8 hover:text-primary-strong active:translate-y-0 dark:border-white/10 dark:bg-white/8 dark:text-[#dbe1ff] dark:hover:bg-white/12",
  ghost: "px-3 py-2 text-sm text-foreground/75 hover:text-primary",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
};

function getButtonClasses(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(
    base,
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button(props: ButtonLinkProps): React.JSX.Element;
export function Button(props: ButtonElementProps): React.JSX.Element;
export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: ButtonLinkProps | ButtonElementProps) {
  const classes = getButtonClasses(variant, size, className);

  if (typeof href === "string") {
    const { onClick, onMouseEnter, onMouseLeave, onTouchStart, target, rel, ...linkProps } = props as Omit<
      ButtonLinkProps,
      "href"
    >;
    return (
      <Link href={href} className={classes} target={target} rel={rel} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onTouchStart} onTouchStart={onTouchStart} {...linkProps} />
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonElementProps;

  return <button type={type} className={classes} {...buttonProps} />;
}
