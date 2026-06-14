import { AuthPage, generateAuthMetadata } from "@/features/auth/auth-page.component";

export const generateMetadata = () => generateAuthMetadata("forgot-password");

export default function Page() {
  return <AuthPage mode="forgot-password" />;
}
