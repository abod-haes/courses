import { LibraryBig } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CheckoutSuccessPage, generateCheckoutSuccessMetadata } from "@/features/checkout/checkout-pages.component";

export const generateMetadata = generateCheckoutSuccessMetadata;

export default function Page() {
  return (
    <>
      <CheckoutSuccessPage />
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-none">
        <Button href="/library" className="pointer-events-auto rounded-full shadow-[0_16px_36px_rgba(0,74,198,0.24)]">
          <LibraryBig className="h-4 w-4" aria-hidden="true" />
          مكتبتي
        </Button>
      </div>
    </>
  );
}
