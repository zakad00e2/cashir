import { FormEvent, useMemo, useState } from "react";
import type { Customer, Invoice } from "../types";
import { createId, formatCurrency, formatDate } from "../utils/invoice";
import { Modal } from "../components/Modal";
import { StatusBadge } from "../components/StatusBadge";

type CustomersPageProps = {
  customers: Customer[];
  invoices: Invoice[];
  onAddCustomer: (customer: Customer) => void;
  onOpenInvoice: (invoice: Invoice) => void;
};

export function CustomersPage({ customers, invoices, onAddCustomer, onOpenInvoice }: CustomersPageProps) {
  const [query, setQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [balance, setBalance] = useState(0);

  const filteredCustomers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalized) ||
        customer.phone.toLowerCase().includes(normalized),
    );
  }, [customers, query]);

  const selectedCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ?? filteredCustomers[0] ?? customers[0];
  const selectedInvoices = selectedCustomer
    ? invoices.filter((invoice) => invoice.customerId === selectedCustomer.id)
    : [];

  function handleAddCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextCustomer: Customer = {
      id: createId("cust"),
      name: name.trim(),
      phone: phone.trim(),
      remainingBalance: Math.max(0, balance),
      status: balance > 0 ? "مستحق" : "منتظم",
      createdAt: new Date().toISOString(),
    };

    if (!nextCustomer.name || !nextCustomer.phone) {
      return;
    }

    onAddCustomer(nextCustomer);
    setSelectedCustomerId(nextCustomer.id);
    setName("");
    setPhone("");
    setBalance(0);
    setIsModalOpen(false);
  }

  return (
    <section className="page-stack">
      <div className="section-heading section-heading--split">
        <div>
          <span className="eyebrow">العملاء</span>
          <h2>حسابات العملاء والأرصدة المتبقية</h2>
        </div>
        <button className="primary-button" type="button" onClick={() => setIsModalOpen(true)}>
          إضافة عميل
        </button>
      </div>

      <div className="toolbar">
        <label className="search-field">
          <span>بحث</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالاسم أو رقم الهاتف" />
        </label>
      </div>

      <div className="two-column">
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>العميل</th>
                  <th>الهاتف</th>
                  <th>الرصيد</th>
                  <th>الفواتير</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const invoiceCount = invoices.filter((invoice) => invoice.customerId === customer.id).length;

                  return (
                    <tr
                      key={customer.id}
                      className={customer.id === selectedCustomer?.id ? "clickable-row row-selected" : "clickable-row"}
                      onClick={() => setSelectedCustomerId(customer.id)}
                    >
                      <td>{customer.name}</td>
                      <td dir="ltr">{customer.phone}</td>
                      <td>{formatCurrency(customer.remainingBalance)}</td>
                      <td>{invoiceCount}</td>
                      <td>
                        <StatusBadge status={customer.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="side-panel">
          {selectedCustomer ? (
            <>
              <div className="customer-card">
                <span className="eyebrow">تفاصيل العميل</span>
                <h3>{selectedCustomer.name}</h3>
                <p dir="ltr">{selectedCustomer.phone}</p>
                <div className="info-grid">
                  <div>
                    <span>الرصيد الحالي</span>
                    <strong>{formatCurrency(selectedCustomer.remainingBalance)}</strong>
                  </div>
                  <div>
                    <span>عدد الفواتير</span>
                    <strong>{selectedInvoices.length}</strong>
                  </div>
                </div>
                <StatusBadge status={selectedCustomer.status} />
              </div>

              <div className="mini-list">
                <h3>سجل الفواتير</h3>
                {selectedInvoices.length ? (
                  selectedInvoices.map((invoice) => (
                    <button key={invoice.id} type="button" onClick={() => onOpenInvoice(invoice)}>
                      <span>
                        <strong dir="ltr">{invoice.number}</strong>
                        <small>{formatDate(invoice.date)}</small>
                      </span>
                      <b>{formatCurrency(invoice.remainingBalance)}</b>
                    </button>
                  ))
                ) : (
                  <p className="empty-text">لا توجد فواتير لهذا العميل بعد.</p>
                )}
              </div>
            </>
          ) : (
            <p className="empty-text">لا توجد نتائج مطابقة.</p>
          )}
        </aside>
      </div>

      {isModalOpen ? (
        <Modal title="إضافة عميل جديد" onClose={() => setIsModalOpen(false)}>
          <form className="form-grid" onSubmit={handleAddCustomer}>
            <label>
              اسم العميل
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="مثال: شركة القدس" />
            </label>
            <label>
              رقم الهاتف
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0590000000" dir="ltr" />
            </label>
            <label>
              رصيد سابق
              <input
                type="number"
                min="0"
                value={balance}
                onChange={(event) => setBalance(Number(event.target.value))}
              />
            </label>
            <div className="modal-actions">
              <button className="ghost-button" type="button" onClick={() => setIsModalOpen(false)}>
                إلغاء
              </button>
              <button className="primary-button" type="submit">
                حفظ العميل
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </section>
  );
}
