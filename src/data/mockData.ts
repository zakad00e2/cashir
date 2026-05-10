import type { Customer, Invoice, InvoiceItem } from "../types";
import { calculateInvoiceTotals, getInvoiceStatus } from "../utils/invoice";

function isoDate(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(10, 30, 0, 0);
  return date.toISOString();
}

function invoice(
  input: Omit<
    Invoice,
    "subtotal" | "finalTotal" | "remainingBalance" | "status"
  > & {
    items: InvoiceItem[];
  },
): Invoice {
  const totals = calculateInvoiceTotals(input.items, input.discount, input.oldBalance, input.paidAmount);

  return {
    ...input,
    ...totals,
    status: getInvoiceStatus(totals.remainingBalance, input.deliveryNotes),
  };
}

export const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "أحمد أبو خالد",
    phone: "0591112345",
    remainingBalance: 180,
    status: "مستحق",
    createdAt: isoDate(-60),
  },
  {
    id: "cust-2",
    name: "محل البركة",
    phone: "0567773311",
    remainingBalance: 0,
    status: "منتظم",
    createdAt: isoDate(-48),
  },
  {
    id: "cust-3",
    name: "محمد النجار",
    phone: "0592224455",
    remainingBalance: 420,
    status: "متابعة",
    createdAt: isoDate(-31),
  },
  {
    id: "cust-4",
    name: "شركة الأمانة للتجارة",
    phone: "0523008899",
    remainingBalance: 260,
    status: "مستحق",
    createdAt: isoDate(-20),
  },
];

export const mockInvoices: Invoice[] = [
  invoice({
    id: "inv-1",
    number: "INV-2026-0001",
    customerId: "cust-1",
    customerName: "أحمد أبو خالد",
    customerPhone: "0591112345",
    date: isoDate(0),
    oldBalance: 180,
    discount: 20,
    paidAmount: 375,
    deliveryNotes: "",
    items: [
      { id: "item-1", name: "ترنق أطفال", quantity: 3, price: 85 },
      { id: "item-2", name: "بنطال رياضي", quantity: 2, price: 70 },
    ],
  }),
  invoice({
    id: "inv-2",
    number: "INV-2026-0002",
    customerId: "cust-2",
    customerName: "محل البركة",
    customerPhone: "0567773311",
    date: isoDate(0),
    oldBalance: 0,
    discount: 50,
    paidAmount: 1200,
    deliveryNotes: "",
    items: [
      { id: "item-3", name: "جواكيت رجالي", quantity: 4, price: 190 },
      { id: "item-4", name: "قمصان قطن", quantity: 8, price: 55 },
      { id: "item-5", name: "أحزمة جلد", quantity: 2, price: 25 },
    ],
  }),
  invoice({
    id: "inv-3",
    number: "INV-2026-0003",
    customerId: "cust-3",
    customerName: "محمد النجار",
    customerPhone: "0592224455",
    date: isoDate(-4),
    oldBalance: 420,
    discount: 0,
    paidAmount: 600,
    deliveryNotes: "باقي ٣ ترنق أطفال",
    items: [
      { id: "item-6", name: "ترنق أطفال", quantity: 6, price: 75 },
      { id: "item-7", name: "بيجاما شتوي", quantity: 3, price: 110 },
    ],
  }),
  invoice({
    id: "inv-4",
    number: "INV-2026-0004",
    customerId: "cust-4",
    customerName: "شركة الأمانة للتجارة",
    customerPhone: "0523008899",
    date: isoDate(-11),
    oldBalance: 260,
    discount: 30,
    paidAmount: 640,
    deliveryNotes: "",
    items: [
      { id: "item-8", name: "قمصان مدارس", quantity: 10, price: 42 },
      { id: "item-9", name: "بنطال قماش", quantity: 5, price: 50 },
    ],
  }),
  invoice({
    id: "inv-5",
    number: "INV-2026-0005",
    customerId: "cust-2",
    customerName: "محل البركة",
    customerPhone: "0567773311",
    date: isoDate(-20),
    oldBalance: 0,
    discount: 10,
    paidAmount: 390,
    deliveryNotes: "",
    items: [
      { id: "item-10", name: "ملابس داخلية", quantity: 12, price: 25 },
      { id: "item-11", name: "جوارب", quantity: 10, price: 10 },
    ],
  }),
];
