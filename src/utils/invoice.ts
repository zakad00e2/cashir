import type { Invoice, InvoiceItem, InvoiceStatus, InvoiceTotals } from "../types";

export const invoiceStatuses: InvoiceStatus[] = ["خالصة", "غير خالصة", "ناقص تسليم"];

export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getItemTotal(item: InvoiceItem) {
  return Math.max(0, item.quantity) * Math.max(0, item.price);
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
  discountValue: number,
  oldBalanceValue: number,
  paidAmountValue: number,
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + getItemTotal(item), 0);
  const discount = Math.min(Math.max(0, discountValue), subtotal);
  const oldBalance = Math.max(0, oldBalanceValue);
  const paidAmount = Math.max(0, paidAmountValue);
  const finalTotal = Math.max(0, subtotal - discount) + oldBalance;
  const remainingBalance = Math.max(0, finalTotal - paidAmount);

  return {
    subtotal,
    discount,
    oldBalance,
    finalTotal,
    paidAmount,
    remainingBalance,
  };
}

export function getInvoiceStatus(remainingBalance: number, deliveryNotes: string): InvoiceStatus {
  if (deliveryNotes.trim().length > 0) {
    return "ناقص تسليم";
  }

  return remainingBalance <= 0 ? "خالصة" : "غير خالصة";
}

export function getInvoiceNetSale(invoice: Invoice) {
  return Math.max(0, invoice.subtotal - invoice.discount);
}

export function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString("en-US")} ₪`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function isSameDay(dateValue: string, reference = new Date()) {
  const date = new Date(dateValue);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

export function isSameMonth(dateValue: string, reference = new Date()) {
  const date = new Date(dateValue);
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth();
}

export function getNextInvoiceNumber(invoices: Invoice[]) {
  const year = new Date().getFullYear();
  const next = invoices.length + 1;
  return `INV-${year}-${String(next).padStart(4, "0")}`;
}
