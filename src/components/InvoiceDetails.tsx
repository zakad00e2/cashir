import type { Invoice } from "../types";
import { formatCurrency, formatDate, getItemTotal } from "../utils/invoice";
import { StatusBadge } from "./StatusBadge";

type InvoiceDetailsProps = {
  invoice: Invoice;
};

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  return (
    <div className="invoice-details">
      <div className="invoice-details__header">
        <div>
          <span className="eyebrow">تفاصيل الفاتورة</span>
          <h2>{invoice.number}</h2>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      <div className="info-grid">
        <div>
          <span>العميل</span>
          <strong>{invoice.customerName}</strong>
        </div>
        <div>
          <span>رقم الهاتف</span>
          <strong dir="ltr">{invoice.customerPhone}</strong>
        </div>
        <div>
          <span>التاريخ</span>
          <strong>{formatDate(invoice.date)}</strong>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>{formatCurrency(getItemTotal(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-list">
        <div>
          <span>المجموع الفرعي</span>
          <strong>{formatCurrency(invoice.subtotal)}</strong>
        </div>
        <div>
          <span>الخصم</span>
          <strong>{formatCurrency(invoice.discount)}</strong>
        </div>
        <div>
          <span>الرصيد السابق</span>
          <strong>{formatCurrency(invoice.oldBalance)}</strong>
        </div>
        <div className="summary-list__total">
          <span>الإجمالي النهائي</span>
          <strong>{formatCurrency(invoice.finalTotal)}</strong>
        </div>
        <div>
          <span>المدفوع</span>
          <strong>{formatCurrency(invoice.paidAmount)}</strong>
        </div>
        <div>
          <span>المتبقي</span>
          <strong>{formatCurrency(invoice.remainingBalance)}</strong>
        </div>
      </div>

      <div className="note-box">
        <span>ملاحظات التسليم</span>
        <p>{invoice.deliveryNotes || "لا توجد ملاحظات تسليم"}</p>
      </div>
    </div>
  );
}
