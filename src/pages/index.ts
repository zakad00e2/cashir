export type PageKey = "dashboard" | "customers" | "create-invoice" | "invoices" | "reports";

export function getPageFromHash(): PageKey {
  const page = window.location.hash.replace("#", "") as PageKey;
  const allowed: PageKey[] = ["dashboard", "customers", "create-invoice", "invoices", "reports"];

  return allowed.includes(page) ? page : "dashboard";
}
