import { LegalPage, generateLegalMetadata } from "@/features/legal/legal-pages.component";

export const generateMetadata = () => generateLegalMetadata("support");

export default function Page() {
  return <LegalPage page="support" />;
}
