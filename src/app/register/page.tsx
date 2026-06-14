import { AuthPage, generateAuthMetadata } from "@/features/auth/auth-page.component";

export const generateMetadata = () => generateAuthMetadata("register");

export default function Page() {
  return <AuthPage mode="register" />;
}
