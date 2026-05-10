import { useMemo, useState } from "react";
import type { Invoice, InvoiceStatus } from "../types";
import { formatCurrency, formatDate, invoiceStatuses } from "../utils/invoice";
import { StatusBadge } from "../components/StatusBadge";

type InvoicesPageProps = {
  invoices: Invoice[];
  onOpenInvoice: (invoice: Invoice) => void;
};

type FilterStatus = "الكل" | InvoiceStatus;

export function InvoicesPage({ invoices, onOpenInvoice }: InvoicesPageProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("الكل");

  const filteredInvoices = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesQuery =
        invoice.number.toLowerCase().includes(normalized) ||
        invoice.customerName.toLowerCase().includes(normalized);
      const matchesStatus = status === "الكل" || invoice.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [invoices, query, status]);

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <span className="eyebrow">الفواتير</span>
          <h2>أرشيف الفواتير وحالات التحصيل</h2>
        </div>
      </div>

      <div className="toolbar toolbar--split">
        <label className="search-field">
          <span>بحث</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="رقم الفاتورة أو اسم العميل" />
        </label>

        <div className="segmented-control" role="group" aria-label="فلترة حسب الحالة">
          {(["الكل", ...invoiceStatuses] as FilterStatus[]).map((item) => (
            <button
              key={item}
              type="button"
              className={status === item ? "segment segment--active" : "segment"}
              onClick={() => setStatus(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>العميل</th>
                <th>التاريخ</th>
                <th>الإجمالي النهائي</th>
                <th>المدفوع</th>
                <th>المتبقي</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="clickable-row" onClick={() => onOpenInvoice(invoice)}>
                  <td dir="ltr">{invoice.number}</td>
                  <td>{invoice.customerName}</td>
                  <td>{formatDate(invoice.date)}</td>
                  <td>{formatCurrency(invoice.finalTotal)}</td>
                  <td>{formatCurrency(invoice.paidAmount)}</td>
                  <td>{formatCurrency(invoice.remainingBalance)}</td>
                  <td>
                    <StatusBadge status={invoice.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInvoices.length === 0 ? <p className="empty-text">لا توجد فواتير مطابقة للبحث الحالي.</p> : null}
        </div>
      </div>
    </section>
  );
}
