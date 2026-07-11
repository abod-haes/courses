import type { BookItemView } from "@/features/books/books.types";
import { getBooks } from "@/features/books/books.data";
import type { CourseItemView } from "@/features/courses/courses.types";
import { getCourses } from "@/features/courses/courses.data";
import type { Locale } from "@/shared/lib/types";
import type { CheckoutCopy, CheckoutItemType, CheckoutItemView, OrderView } from "./checkout.types";

const checkoutCopyByLocale: Readonly<Record<Locale, CheckoutCopy>> = {
  en: {
    meta: {
      checkoutTitle: "Checkout Review - IASS",
      checkoutDescription: "Review selected courses and books before continuing to secure payment.",
      successTitle: "Checkout Complete - IASS",
      successDescription: "Your purchase was confirmed. Your learning resources are ready in your library.",
      cancelTitle: "Checkout Cancelled - IASS",
      cancelDescription: "Your payment was not completed. You can safely retry checkout when ready.",
      ordersTitle: "Order History - IASS",
      ordersDescription: "Review your medical learning purchases, payment status, and order details.",
      libraryTitle: "My Library - IASS",
      libraryDescription: "Access purchased medical courses and books from one focused learning library.",
    },
    checkout: {
      eyebrow: "Secure checkout",
      title: "Review your learning order",
      subtitle: "Confirm the selected courses and books before continuing to payment. Payment is handled securely through Stripe.",
      reviewTitle: "Selected items",
      reviewDescription: "Courses and books unlock in your library after successful payment confirmation.",
      totalTitle: "Order summary",
      subtotal: "Subtotal",
      total: "Total",
      securePayment: "Secure payment · No card data is stored on IASS",
      continueToPayment: "Continue to Payment",
      continueBrowsing: "Continue Browsing",
      remove: "Remove",
      emptyTitle: "Your checkout is empty",
      emptyDescription: "Choose a course or book to start building your medical learning library.",
      browseCourses: "Browse Courses",
      browseBooks: "Browse Books",
      itemCountLabel: "items selected",
    },
    result: {
      successEyebrow: "Payment confirmed",
      successTitle: "Your order is complete",
      successDescription: "Your purchased resources are now ready in your library. Continue learning whenever you are ready.",
      cancelEyebrow: "Checkout cancelled",
      cancelTitle: "Payment was not completed",
      cancelDescription: "No charge was made. Your selected resources are still available, and you can retry checkout at any time.",
      purchasedItems: "Purchased items",
      goToLibrary: "Go to Library",
      browseMore: "Browse More",
      retryCheckout: "Retry Checkout",
      backToCatalog: "Back to Catalog",
      orderNumber: "Order number",
    },
    orders: {
      eyebrow: "Student account",
      title: "Order history",
      subtitle: "Track your purchases and payment states from one clean view.",
      status: "Status",
      total: "Total",
      date: "Date",
      items: "Items",
      details: "View details",
      paymentSummary: "Payment summary",
      emptyTitle: "No orders yet",
      emptyDescription: "Your completed course and book purchases will appear here.",
      browseCourses: "Browse Courses",
    },
    library: {
      eyebrow: "Student library",
      title: "Your purchased resources",
      subtitle: "Continue courses and download books purchased through your IASS account.",
      coursesTab: "Purchased Courses",
      booksTab: "Purchased Books",
      continueLearning: "Continue Learning",
      accessBook: "Download Book",
      emptyTitle: "Your library is empty",
      emptyDescription: "Purchased courses and books will appear here after checkout is confirmed.",
      browseCourses: "Browse Courses",
      browseBooks: "Browse Books",
    },
    labels: {
      course: "Course",
      book: "Book",
      paid: "Paid",
      pending: "Pending",
      cancelled: "Cancelled",
      digitalAccess: "Digital access",
      lifetimeAccess: "Lifetime access",
    },
  },
  ar: {
    meta: {
      checkoutTitle: "مراجعة الطلب - IASS",
      checkoutDescription: "راجع الكورسات والكتب المختارة قبل المتابعة إلى الدفع الآمن.",
      successTitle: "تم الدفع بنجاح - IASS",
      successDescription: "تم تأكيد عملية الشراء، ومصادر التعلم أصبحت جاهزة داخل مكتبتك.",
      cancelTitle: "تم إلغاء الدفع - IASS",
      cancelDescription: "لم تكتمل عملية الدفع. يمكنك إعادة المحاولة بأمان في أي وقت.",
      ordersTitle: "سجل الطلبات - IASS",
      ordersDescription: "راجع مشترياتك التعليمية وحالة الدفع وتفاصيل الطلبات.",
      libraryTitle: "مكتبتي - IASS",
      libraryDescription: "ادخل إلى الكورسات والكتب الطبية التي اشتريتها من مكتبة تعليمية واحدة.",
    },
    checkout: {
      eyebrow: "دفع آمن",
      title: "راجع طلبك التعليمي",
      subtitle: "تأكد من الكورسات والكتب المختارة قبل المتابعة للدفع. تتم معالجة الدفع بأمان عبر Stripe.",
      reviewTitle: "العناصر المختارة",
      reviewDescription: "تُفتح الكورسات والكتب داخل مكتبتك بعد تأكيد الدفع بنجاح.",
      totalTitle: "ملخص الطلب",
      subtotal: "المجموع الفرعي",
      total: "الإجمالي",
      securePayment: "دفع آمن · لا يتم تخزين بيانات البطاقة داخل IASS",
      continueToPayment: "المتابعة إلى الدفع",
      continueBrowsing: "متابعة التصفح",
      remove: "إزالة",
      emptyTitle: "سلة الدفع فارغة",
      emptyDescription: "اختر كورسًا أو كتابًا لتبدأ بناء مكتبتك التعليمية الطبية.",
      browseCourses: "تصفح الكورسات",
      browseBooks: "تصفح الكتب",
      itemCountLabel: "عناصر مختارة",
    },
    result: {
      successEyebrow: "تم تأكيد الدفع",
      successTitle: "اكتمل طلبك بنجاح",
      successDescription: "أصبحت المصادر التي اشتريتها جاهزة داخل مكتبتك. يمكنك متابعة التعلم في أي وقت.",
      cancelEyebrow: "تم إلغاء الدفع",
      cancelTitle: "لم تكتمل عملية الدفع",
      cancelDescription: "لم يتم خصم أي مبلغ. ما زالت المصادر المختارة متاحة ويمكنك إعادة المحاولة متى أردت.",
      purchasedItems: "العناصر المشتراة",
      goToLibrary: "الذهاب إلى المكتبة",
      browseMore: "تصفح المزيد",
      retryCheckout: "إعادة المحاولة",
      backToCatalog: "العودة إلى التصفح",
      orderNumber: "رقم الطلب",
    },
    orders: {
      eyebrow: "حساب الطالب",
      title: "سجل الطلبات",
      subtitle: "تابع مشترياتك وحالات الدفع من واجهة واضحة ومنظمة.",
      status: "الحالة",
      total: "الإجمالي",
      date: "التاريخ",
      items: "العناصر",
      details: "عرض التفاصيل",
      paymentSummary: "ملخص الدفع",
      emptyTitle: "لا توجد طلبات بعد",
      emptyDescription: "ستظهر مشتريات الكورسات والكتب هنا بعد تأكيد الدفع.",
      browseCourses: "تصفح الكورسات",
    },
    library: {
      eyebrow: "مكتبة الطالب",
      title: "مصادرك المشتراة",
      subtitle: "تابع الكورسات وحمّل الكتب التي اشتريتها من حسابك في IASS.",
      coursesTab: "الكورسات المشتراة",
      booksTab: "الكتب المشتراة",
      continueLearning: "متابعة التعلم",
      accessBook: "تحميل الكتاب",
      emptyTitle: "مكتبتك فارغة",
      emptyDescription: "ستظهر الكورسات والكتب المشتراة هنا بعد تأكيد الدفع.",
      browseCourses: "تصفح الكورسات",
      browseBooks: "تصفح الكتب",
    },
    labels: {
      course: "كورس",
      book: "كتاب",
      paid: "مدفوع",
      pending: "قيد الانتظار",
      cancelled: "ملغي",
      digitalAccess: "وصول رقمي",
      lifetimeAccess: "وصول دائم",
    },
  },
};

function parseAmount(price: string): number {
  const normalized = price.replace(/[^0-9.]/g, "");
  return Number.parseFloat(normalized) || 0;
}

function formatTotal(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function courseToCheckoutItem(course: CourseItemView, copy: CheckoutCopy): CheckoutItemView {
  return {
    id: course.id,
    type: "course",
    typeLabel: copy.labels.course,
    title: course.title,
    description: course.description,
    category: course.category,
    price: course.price,
    amount: parseAmount(course.price),
    image: course.image,
    imageAlt: course.imageAlt,
    href: course.href,
    accessLabel: copy.labels.lifetimeAccess,
  };
}

function bookToCheckoutItem(book: BookItemView, copy: CheckoutCopy): CheckoutItemView {
  return {
    id: book.id,
    type: "book",
    typeLabel: copy.labels.book,
    title: book.title,
    description: book.description,
    category: book.category,
    price: book.price,
    amount: parseAmount(book.price),
    image: book.image,
    imageAlt: book.imageAlt,
    href: book.href,
    accessLabel: copy.labels.digitalAccess,
  };
}

export function getCheckoutCopy(locale: Locale): CheckoutCopy {
  return checkoutCopyByLocale[locale];
}

export function getCheckoutItems(locale: Locale): CheckoutItemView[] {
  const copy = getCheckoutCopy(locale);
  const [firstCourse, secondCourse] = getCourses(locale);
  const [firstBook] = getBooks(locale);

  return [
    ...(firstCourse ? [courseToCheckoutItem(firstCourse, copy)] : []),
    ...(firstBook ? [bookToCheckoutItem(firstBook, copy)] : []),
    ...(secondCourse ? [courseToCheckoutItem(secondCourse, copy)] : []),
  ];
}

export function getCheckoutItem(locale: Locale, itemType?: string, itemId?: string): CheckoutItemView | undefined {
  const copy = getCheckoutCopy(locale);

  if (itemType === "course" && itemId) {
    const course = getCourses(locale).find((item) => item.id === itemId);
    return course ? courseToCheckoutItem(course, copy) : undefined;
  }

  if (itemType === "book" && itemId) {
    const book = getBooks(locale).find((item) => item.id === itemId);
    return book ? bookToCheckoutItem(book, copy) : undefined;
  }

  return undefined;
}

export function getCheckoutSelection(
  locale: Locale,
  itemType?: CheckoutItemType | string,
  itemId?: string,
  isEmpty?: boolean,
): CheckoutItemView[] {
  if (isEmpty) {
    return [];
  }

  const selectedItem = getCheckoutItem(locale, itemType, itemId);
  return selectedItem ? [selectedItem] : getCheckoutItems(locale).slice(0, 2);
}

export function getCheckoutTotal(items: readonly CheckoutItemView[]): string {
  return formatTotal(items.reduce((total, item) => total + item.amount, 0));
}

export function getMockOrder(locale: Locale): OrderView {
  const copy = getCheckoutCopy(locale);
  const items = getCheckoutItems(locale).slice(0, 2);

  return {
    id: "ord_iass_2601",
    orderNumber: "IASS-2026-0001",
    status: "paid",
    statusLabel: copy.labels.paid,
    date: locale === "ar" ? "16 حزيران 2026" : "June 16, 2026",
    total: getCheckoutTotal(items),
    itemCount: items.length,
    items,
    paymentSummary:
      locale === "ar"
        ? "تم تأكيد الدفع عبر Stripe وتم منح الوصول إلى العناصر المشتراة."
        : "Stripe payment confirmed and access was granted to purchased items.",
  };
}

export function getMockOrders(locale: Locale): OrderView[] {
  const copy = getCheckoutCopy(locale);
  const paidOrder = getMockOrder(locale);
  const pendingItems = getCheckoutItems(locale).slice(1, 2);

  return [
    paidOrder,
    {
      id: "ord_iass_2600",
      orderNumber: "IASS-2026-0000",
      status: "pending",
      statusLabel: copy.labels.pending,
      date: locale === "ar" ? "14 حزيران 2026" : "June 14, 2026",
      total: getCheckoutTotal(pendingItems),
      itemCount: pendingItems.length,
      items: pendingItems,
      paymentSummary:
        locale === "ar"
          ? "بانتظار تأكيد الدفع من مزود الخدمة."
          : "Waiting for payment provider confirmation.",
    },
  ];
}
