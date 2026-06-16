export type CheckoutItemType = "course" | "book";
export type CheckoutStatus = "paid" | "pending" | "cancelled";

export type CheckoutItemView = Readonly<{
  id: string;
  type: CheckoutItemType;
  typeLabel: string;
  title: string;
  description: string;
  category: string;
  price: string;
  amount: number;
  image: string;
  imageAlt: string;
  href: string;
  accessLabel: string;
}>;

export type CheckoutCopy = Readonly<{
  meta: Readonly<{
    checkoutTitle: string;
    checkoutDescription: string;
    successTitle: string;
    successDescription: string;
    cancelTitle: string;
    cancelDescription: string;
    ordersTitle: string;
    ordersDescription: string;
    libraryTitle: string;
    libraryDescription: string;
  }>;
  checkout: Readonly<{
    eyebrow: string;
    title: string;
    subtitle: string;
    reviewTitle: string;
    reviewDescription: string;
    totalTitle: string;
    subtotal: string;
    total: string;
    securePayment: string;
    continueToPayment: string;
    continueBrowsing: string;
    remove: string;
    emptyTitle: string;
    emptyDescription: string;
    browseCourses: string;
    browseBooks: string;
    itemCountLabel: string;
  }>;
  result: Readonly<{
    successEyebrow: string;
    successTitle: string;
    successDescription: string;
    cancelEyebrow: string;
    cancelTitle: string;
    cancelDescription: string;
    purchasedItems: string;
    goToLibrary: string;
    browseMore: string;
    retryCheckout: string;
    backToCatalog: string;
    orderNumber: string;
  }>;
  orders: Readonly<{
    eyebrow: string;
    title: string;
    subtitle: string;
    status: string;
    total: string;
    date: string;
    items: string;
    details: string;
    paymentSummary: string;
    emptyTitle: string;
    emptyDescription: string;
    browseCourses: string;
  }>;
  library: Readonly<{
    eyebrow: string;
    title: string;
    subtitle: string;
    coursesTab: string;
    booksTab: string;
    continueLearning: string;
    accessBook: string;
    emptyTitle: string;
    emptyDescription: string;
    browseCourses: string;
    browseBooks: string;
  }>;
  labels: Readonly<{
    course: string;
    book: string;
    paid: string;
    pending: string;
    cancelled: string;
    digitalAccess: string;
    lifetimeAccess: string;
  }>;
}>;

export type OrderView = Readonly<{
  id: string;
  orderNumber: string;
  status: CheckoutStatus;
  statusLabel: string;
  date: string;
  total: string;
  itemCount: number;
  items: CheckoutItemView[];
  paymentSummary: string;
}>;
