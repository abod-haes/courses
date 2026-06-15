import type { AuthCopyByLocale, AuthMode, AuthModeCopy } from "./auth.types";

export const authCopyByLocale: AuthCopyByLocale = {
  en: {
    visual: {
      brandLine: "IASS secure learning portal",
      title: "Continue your medical learning journey with confidence.",
      description:
        "Access courses, books, saved resources, digital certificates, and clinical learning materials from one polished dashboard.",
      cards: ["Protected student profile", "Fast access to courses", "Digital library included"],
      metrics: [
        { value: "24/7", label: "Learning access" },
        { value: "CME", label: "Eligible content" },
        { value: "SSL", label: "Secure portal" },
      ],
    },
    modes: {
      login: {
        meta: {
          title: "Login - IASS",
          description: "Sign in to your IASS account and continue your learning experience.",
        },
        eyebrow: "Welcome back",
        title: "Sign in to your account",
        subtitle: "Enter your details to continue to your courses, books, and saved medical resources.",
        submitLabel: "Sign In",
        fields: {
          email: { label: "Email address", placeholder: "name@example.com" },
          password: { label: "Password", placeholder: "Enter your password" },
        },
        rememberLabel: "Remember me",
        forgotPasswordLabel: "Forgot password?",
        switchPrompt: "New to IASS?",
        switchLabel: "Create an account",
        switchHref: "/register",
        homeLabel: "Home page",
      },
      register: {
        meta: {
          title: "Create Account - IASS",
          description: "Create your IASS account and start exploring professional medical learning content.",
        },
        eyebrow: "Start learning",
        title: "Create your student account",
        subtitle: "Join the IASS learning portal and unlock courses, textbooks, and clinical study resources.",
        submitLabel: "Create Account",
        fields: {
          firstName: { label: "First name", placeholder: "Sarah" },
          lastName: { label: "Last name", placeholder: "Jenkins" },
          email: { label: "Email address", placeholder: "name@example.com" },
          password: { label: "Password", placeholder: "Create a strong password" },
          confirmPassword: { label: "Confirm password", placeholder: "Repeat your password" },
        },
        termsLabel: "I agree to the Terms, Privacy Policy, and learning portal rules.",
        switchPrompt: "Already have an account?",
        switchLabel: "Sign in",
        switchHref: "/login",
        homeLabel: "Home page",
      },
      "forgot-password": {
        meta: {
          title: "Reset Password - IASS",
          description: "Request a secure password reset link for your IASS account.",
        },
        eyebrow: "Account recovery",
        title: "Reset your password",
        subtitle: "Enter your email and we will send a secure reset link to help you get back in.",
        submitLabel: "Send Reset Link",
        fields: {
          email: { label: "Email address", placeholder: "name@example.com" },
        },
        helperText: "For security, reset links expire shortly after being sent.",
        switchPrompt: "Remembered your password?",
        switchLabel: "Back to login",
        switchHref: "/login",
        homeLabel: "Home page",
      },
    },
  },
  ar: {
    visual: {
      brandLine: "بوابة IASS التعليمية الآمنة",
      title: "تابع رحلتك الطبية التعليمية بثقة ووضوح.",
      description:
        "ادخل إلى الكورسات، الكتب، الموارد المحفوظة، الشهادات الرقمية، والمحتوى السريري من لوحة واحدة منظمة.",
      cards: ["حساب طالب محمي", "وصول سريع للكورسات", "مكتبة رقمية مدمجة"],
      metrics: [
        { value: "24/7", label: "وصول دائم" },
        { value: "CME", label: "محتوى مؤهل" },
        { value: "SSL", label: "بوابة آمنة" },
      ],
    },
    modes: {
      login: {
        meta: {
          title: "تسجيل الدخول - IASS",
          description: "سجّل دخولك إلى حساب IASS وتابع تجربة التعلم الخاصة بك.",
        },
        eyebrow: "أهلاً بعودتك",
        title: "تسجيل الدخول إلى حسابك",
        subtitle: "أدخل بياناتك للمتابعة إلى الكورسات والكتب والموارد الطبية المحفوظة.",
        submitLabel: "تسجيل الدخول",
        fields: {
          email: { label: "البريد الإلكتروني", placeholder: "name@example.com" },
          password: { label: "كلمة المرور", placeholder: "أدخل كلمة المرور" },
        },
        rememberLabel: "تذكرني",
        forgotPasswordLabel: "نسيت كلمة المرور؟",
        switchPrompt: "ليس لديك حساب؟",
        switchLabel: "إنشاء حساب",
        switchHref: "/register",
        homeLabel: "الصفحة الرئيسية",
      },
      register: {
        meta: {
          title: "إنشاء حساب - IASS",
          description: "أنشئ حسابك في IASS وابدأ باستكشاف المحتوى الطبي الاحترافي.",
        },
        eyebrow: "ابدأ التعلم",
        title: "أنشئ حسابك التعليمي",
        subtitle: "انضم إلى بوابة IASS التعليمية وافتح الكورسات والكتب والموارد السريرية.",
        submitLabel: "إنشاء حساب",
        fields: {
          firstName: { label: "الاسم الأول", placeholder: "سارة" },
          lastName: { label: "الكنية", placeholder: "جينكنز" },
          email: { label: "البريد الإلكتروني", placeholder: "name@example.com" },
          password: { label: "كلمة المرور", placeholder: "أنشئ كلمة مرور قوية" },
          confirmPassword: { label: "تأكيد كلمة المرور", placeholder: "أعد كتابة كلمة المرور" },
        },
        termsLabel: "أوافق على الشروط وسياسة الخصوصية وقواعد البوابة التعليمية.",
        switchPrompt: "لديك حساب مسبقاً؟",
        switchLabel: "تسجيل الدخول",
        switchHref: "/login",
        homeLabel: "الصفحة الرئيسية",
      },
      "forgot-password": {
        meta: {
          title: "استعادة كلمة المرور - IASS",
          description: "اطلب رابط استعادة آمن لكلمة مرور حساب IASS.",
        },
        eyebrow: "استعادة الحساب",
        title: "استعادة كلمة المرور",
        subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً لإعادة تعيين كلمة المرور.",
        submitLabel: "إرسال رابط الاستعادة",
        fields: {
          email: { label: "البريد الإلكتروني", placeholder: "name@example.com" },
        },
        helperText: "لأمان حسابك، تنتهي صلاحية رابط الاستعادة بعد مدة قصيرة.",
        switchPrompt: "تذكرت كلمة المرور؟",
        switchLabel: "العودة لتسجيل الدخول",
        switchHref: "/login",
        homeLabel: "الصفحة الرئيسية",
      },
    },
  },
};

export function getAuthModeCopy(locale: keyof typeof authCopyByLocale, mode: AuthMode): AuthModeCopy {
  return authCopyByLocale[locale].modes[mode];
}
