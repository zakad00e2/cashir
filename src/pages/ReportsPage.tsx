import type { Customer, Invoice } from "../types";
import { formatCurrency, formatDate, getInvoiceNetSale, isSameDay, isSameMonth } from "../utils/invoice";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";

type ReportsPageProps = {
  customers: Customer[];
  invoices: Invoice[];
  onOpenInvoice: (invoice: Invoice) => void;
};

const monthLabels = ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"];

export function ReportsPage({ customers, invoices, onOpenInvoice }: ReportsPageProps) {
  const todaySales = invoices
    .filter((invoice) => isSameDay(invoice.date))
    .reduce((sum, invoice) => sum + getInvoiceNetSale(invoice), 0);
  const monthlySales = invoices
    .filter((invoice) => isSameMonth(invoice.date))
    .reduce((sum, invoice) => sum + getInvoiceNetSale(invoice), 0);
  const totalBalances = customers.reduce((sum, customer) => sum + customer.remainingBalance, 0);
  const highestBalances = [...customers].sort((a, b) => b.remainingBalance - a.remainingBalance).slice(0, 4);
  const latestUnpaid = invoices
    .filter((invoice) => invoice.status !== "خالصة")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const chartData = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const total = invoices
      .filter((invoice) => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate.getMonth() === date.getMonth() && invoiceDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, invoice) => sum + getInvoiceNetSale(invoice), 0);

    return {
      label: monthLabels[date.getMonth()],
      total,
    };
  });
  const maxChartValue = Math.max(...chartData.map((item) => item.total), 1);

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <span className="eyebrow">التقارير</span>
          <h2>ملخص المبيعات والتحصيل</h2>
        </div>
      </div>

      <div className="stats-grid stats-grid--three">
        <StatCard title="مبيعات اليوم" value={formatCurrency(todaySales)} tone="green" />
        <StatCard title="مبيعات الشهر" value={formatCurrency(monthlySales)} />
        <StatCard title="أرصدة العملاء" value={formatCurrency(totalBalances)} tone="orange" />
      </div>

      <div className="reports-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>مبيعات آخر ستة أشهر</h3>
              <p>رسم بسيط يعتمد على بيانات الفواتير المحلية.</p>
            </div>
          </div>
          <div className="bar-chart" aria-label="مخطط مبيعات آخر ستة أشهر">
            {chartData.map((item) => (
              <div className="bar-chart__item" key={item.label}>
                <div className="bar-chart__track">
                  <span style={{ height: `${Math.max(8, (item.total / maxChartValue) * 100)}%` }} />
                </div>
                <strong>{formatCurrency(item.total)}</strong>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>أعلى أرصدة العملاء</h3>
              <p>العملاء الأكثر حاجة للمتابعة.</p>
            </div>
          </div>
          <div className="balance-list">
            {highestBalances.map((customer) => (
              <div key={customer.id}>
                <span>
                  <strong>{customer.name}</strong>
                  <small dir="ltr">{customer.phone}</small>
                </span>
                <b>{formatCurrency(customer.remainingBalance)}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>أحدث الفواتير غير الخالصة</h3>
            <p>تشمل الفواتير غير المدفوعة وفواتير ناقص التسليم.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>العميل</th>
                <th>التاريخ</th>
                <th>المتبقي</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {latestUnpaid.map((invoice) => (
                <tr key={invoice.id} className="clickable-row" onClick={() => onOpenInvoice(invoice)}>
                  <td dir="ltr">{invoice.number}</td>
                  <td>{invoice.customerName}</td>
                  <td>{formatDate(invoice.date)}</td>
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
