import type { Customer, Invoice } from "../types";
import { formatCurrency, formatDate, getInvoiceNetSale, isSameDay, isSameMonth } from "../utils/invoice";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";

type DashboardPageProps = {
  customers: Customer[];
  invoices: Invoice[];
  onOpenInvoice: (invoice: Invoice) => void;
};

export function DashboardPage({ customers, invoices, onOpenInvoice }: DashboardPageProps) {
  const todaySales = invoices
    .filter((invoice) => isSameDay(invoice.date))
    .reduce((sum, invoice) => sum + getInvoiceNetSale(invoice), 0);
  const monthlySales = invoices
    .filter((invoice) => isSameMonth(invoice.date))
    .reduce((sum, invoice) => sum + getInvoiceNetSale(invoice), 0);
  const totalBalances = customers.reduce((sum, customer) => sum + customer.remainingBalance, 0);
  const unpaidInvoices = invoices.filter((invoice) => invoice.status === "غير خالصة").length;
  const missingDelivery = invoices.filter((invoice) => invoice.status === "ناقص تسليم").length;
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <span className="eyebrow">لوحة التحكم</span>
          <h2>مؤشرات اليوم والحسابات المفتوحة</h2>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="مبيعات اليوم" value={formatCurrency(todaySales)} detail="صافي الفواتير الجديدة" tone="green" />
        <StatCard title="مبيعات الشهر" value={formatCurrency(monthlySales)} detail="بدون الأرصدة السابقة" />
        <StatCard title="أرصدة العملاء المتبقية" value={formatCurrency(totalBalances)} detail="إجمالي الحسابات المفتوحة" tone="orange" />
        <StatCard title="فواتير غير خالصة" value={`${unpaidInvoices}`} detail="تحتاج متابعة" tone="orange" />
        <StatCard title="فواتير ناقص تسليم" value={`${missingDelivery}`} detail="أصناف لم تسلم بعد" tone="amber" />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>أحدث الفواتير</h3>
            <p>آخر الحركات المسجلة داخل النموذج التجريبي.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>العميل</th>
                <th>التاريخ</th>
                <th>الإجمالي</th>
                <th>المتبقي</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="clickable-row" onClick={() => onOpenInvoice(invoice)}>
                  <td dir="ltr">{invoice.number}</td>
                  <td>{invoice.customerName}</td>
                  <td>{formatDate(invoice.date)}</td>
                  <td>{formatCurrency(invoice.finalTotal)}</td>
                  <td>{formatCurrency(invoice.remainingBalance)}</td>
                  <td>
                    <StatusBadge status={invoice.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
