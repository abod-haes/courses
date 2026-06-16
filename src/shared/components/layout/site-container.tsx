import { cn } from "@/shared/lib/utils";

type SiteContainerProps = Readonly<{
  as?: "div" | "section" | "header" | "main" | "footer";
  className?: string;
  children: React.ReactNode;
}>;

export function SiteContainer({ as: Component = "div", className, children }: SiteContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-[1168px] px-4 sm:px-5 md:px-6 lg:px-7 min-[1220px]:px-4 2xl:max-w-[1200px]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
