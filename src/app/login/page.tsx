import { AuthPage, generateAuthMetadata } from "@/features/auth/auth-page.component";

export const generateMetadata = () => generateAuthMetadata("login");

export default function Page() {
  return <AuthPage mode="login" />;
}
