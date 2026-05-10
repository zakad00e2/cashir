import { useMemo, useState } from "react";
import type { Customer, Invoice, InvoiceItem } from "../types";
import {
  calculateInvoiceTotals,
  createId,
  formatCurrency,
  getInvoiceStatus,
  getItemTotal,
  getNextInvoiceNumber,
} from "../utils/invoice";
import { StatusBadge } from "../components/StatusBadge";
import { InvoiceDetails } from "../components/InvoiceDetails";

type CreateInvoicePageProps = {
  customers: Customer[];
  invoices: Invoice[];
  onSaveInvoice: (invoice: Invoice) => void;
};

const defaultItem = (): InvoiceItem => ({
  id: createId("item"),
  name: "",
  quantity: 1,
  price: 0,
});

export function CreateInvoicePage({ customers, invoices, onSaveInvoice }: CreateInvoicePageProps) {
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: createId("item"), name: "ترنق أطفال", quantity: 1, price: 85 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const selectedCustomer = customers.find((customer) => customer.id === customerId) ?? customers[0];
  const oldBalance = selectedCustomer?.remainingBalance ?? 0;
  const totals = calculateInvoiceTotals(items, discount, oldBalance, paidAmount);
  const invoiceStatus = getInvoiceStatus(totals.remainingBalance, deliveryNotes);

  const invoiceDraft = useMemo<Invoice>(() => {
    const customer = selectedCustomer;

    return {
      id: createId("inv-draft"),
      number: getNextInvoiceNumber(invoices),
      customerId: customer?.id ?? "",
      customerName: customer?.name ?? "عميل غير محدد",
      customerPhone: customer?.phone ?? "",
      date: new Date().toISOString(),
      items,
      ...totals,
      deliveryNotes,
      status: invoiceStatus,
    };
  }, [deliveryNotes, invoiceStatus, invoices, items, selectedCustomer, totals]);

  function updateItem(id: string, field: keyof InvoiceItem, value: string | number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "name" ? String(value) : Number(value) || 0,
            }
          : item,
      ),
    );
  }

  function handleAddItem() {
    setItems((currentItems) => [...currentItems, defaultItem()]);
  }

  function handleDeleteItem(id: string) {
    setItems((currentItems) => (currentItems.length > 1 ? currentItems.filter((item) => item.id !== id) : currentItems));
  }

  function handleSaveInvoice() {
    if (!selectedCustomer || items.some((item) => !item.name.trim())) {
      setSavedMessage("أكمل بيانات العميل والأصناف قبل الحفظ.");
      return;
    }

    const invoiceToSave: Invoice = {
      ...invoiceDraft,
      id: createId("inv"),
      number: getNextInvoiceNumber(invoices),
      date: new Date().toISOString(),
      items: items.map((item) => ({ ...item, name: item.name.trim() })),
    };

    onSaveInvoice(invoiceToSave);
    setSavedMessage(`تم حفظ الفاتورة ${invoiceToSave.number} محليا.`);
    setItems([defaultItem()]);
    setDiscount(0);
    setPaidAmount(0);
    setDeliveryNotes("");
  }

  function handleShareWhatsApp() {
    const message = [
      `فاتورة ${invoiceDraft.number}`,
      `العميل: ${invoiceDraft.customerName}`,
      `الإجمالي النهائي: ${formatCurrency(invoiceDraft.finalTotal)}`,
      `المدفوع: ${formatCurrency(invoiceDraft.paidAmount)}`,
      `المتبقي: ${formatCurrency(invoiceDraft.remainingBalance)}`,
      `الحالة: ${invoiceDraft.status}`,
      invoiceDraft.deliveryNotes ? `ملاحظات التسليم: ${invoiceDraft.deliveryNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <span className="eyebrow">إنشاء فاتورة</span>
          <h2>فاتورة جديدة مع احتساب الرصيد السابق تلقائيا</h2>
        </div>
      </div>

      <div className="invoice-workspace">
        <div className="panel invoice-form-panel">
          <div className="form-grid form-grid--two">
            <label>
              العميل
              <select value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              الرصيد السابق
              <input value={formatCurrency(oldBalance)} readOnly />
            </label>
          </div>

          <div className="table-section-header">
            <h3>أصناف الفاتورة</h3>
            <button className="secondary-button" type="button" onClick={handleAddItem}>
              إضافة صنف
            </button>
          </div>

          <div className="table-wrap">
            <table className="items-table">
              <thead>
                <tr>
                  <th>الصنف</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                  <th>الإجمالي</th>
                  <th>حذف</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input value={item.name} onChange={(event) => updateItem(item.id, "name", event.target.value)} />
                    </td>
                    <td>
                      <input
                        inputMode="decimal"
                        value={item.quantity}
                        onChange={(event) => updateItem(item.id, "quantity", event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        inputMode="decimal"
                        value={item.price}
                        onChange={(event) => updateItem(item.id, "price", event.target.value)}
                      />
                    </td>
                    <td>{formatCurrency(getItemTotal(item))}</td>
                    <td>
                      <button className="icon-button icon-button--danger" type="button" onClick={() => handleDeleteItem(item.id)} aria-label="حذف الصنف">
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-grid form-grid--two">
            <label>
              الخصم
              <input inputMode="decimal" value={discount} onChange={(event) => setDiscount(Number(event.target.value) || 0)} />
            </label>
            <label>
              المبلغ المدفوع
              <input inputMode="decimal" value={paidAmount} onChange={(event) => setPaidAmount(Number(event.target.value) || 0)} />
            </label>
          </div>

          <label className="wide-label">
            ملاحظات التسليم
            <textarea
              value={deliveryNotes}
              onChange={(event) => setDeliveryNotes(event.target.value)}
              placeholder="باقي ٣ ترنق أطفال"
              rows={3}
            />
          </label>

          <div className="status-line">
            <span>حالة الفاتورة</span>
            <StatusBadge status={invoiceStatus} />
          </div>

          {savedMessage ? <p className="inline-message">{savedMessage}</p> : null}

          <div className="actions-row">
            <button className="primary-button" type="button" onClick={handleSaveInvoice}>
              حفظ الفاتورة
            </button>
            <button className="secondary-button" type="button" onClick={handlePrint}>
              تصدير PDF
            </button>
            <button className="whatsapp-button" type="button" onClick={handleShareWhatsApp}>
              مشاركة واتساب
            </button>
          </div>
        </div>

        <aside className="summary-panel">
          <h3>ملخص الفاتورة</h3>
          <div className="summary-list">
            <div>
              <span>المجموع الفرعي</span>
              <strong>{formatCurrency(totals.subtotal)}</strong>
            </div>
            <div>
              <span>الخصم</span>
              <strong>{formatCurrency(totals.discount)}</strong>
            </div>
            <div>
              <span>الرصيد السابق</span>
              <strong>{formatCurrency(totals.oldBalance)}</strong>
            </div>
            <div className="summary-list__total">
              <span>الإجمالي النهائي</span>
              <strong>{formatCurrency(totals.finalTotal)}</strong>
            </div>
            <div>
              <span>المدفوع</span>
              <strong>{formatCurrency(totals.paidAmount)}</strong>
            </div>
            <div>
              <span>المتبقي</span>
              <strong>{formatCurrency(totals.remainingBalance)}</strong>
            </div>
          </div>
        </aside>
      </div>

      <div className="print-document">
        <InvoiceDetails invoice={invoiceDraft} />
      </div>
    </section>
  );
}
