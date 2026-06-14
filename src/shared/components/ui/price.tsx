type PriceProps = Readonly<{
  value: number;
  currency?: string;
  locale?: string;
  className?: string;
}>;

export function Price({ value, currency = "USD", locale = "en-US", className }: PriceProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

  return <span className={className}>{formatted}</span>;
}

