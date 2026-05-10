export type InvoiceStatus = "خالصة" | "غير خالصة" | "ناقص تسليم";

export type CustomerStatus = "منتظم" | "مستحق" | "متابعة";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  remainingBalance: number;
  status: CustomerStatus;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  oldBalance: number;
  finalTotal: number;
  paidAmount: number;
  remainingBalance: number;
  deliveryNotes: string;
  status: InvoiceStatus;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  oldBalance: number;
  finalTotal: number;
  paidAmount: number;
  remainingBalance: number;
}
