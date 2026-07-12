import { LegalPage, generateLegalMetadata } from "@/features/legal/legal-pages.component";

export const generateMetadata = () => generateLegalMetadata("privacy");

export default function Page() {
  return <LegalPage page="privacy" />;
}
