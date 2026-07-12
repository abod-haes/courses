import { LegalPage, generateLegalMetadata } from "@/features/legal/legal-pages.component";

export const generateMetadata = () => generateLegalMetadata("terms");

export default function Page() {
  return <LegalPage page="terms" />;
}
