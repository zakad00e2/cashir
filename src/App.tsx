import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { Modal } from "./components/Modal";
import { InvoiceDetails } from "./components/InvoiceDetails";
import { mockCustomers, mockInvoices } from "./data/mockData";
import { usePersistentState } from "./hooks/usePersistentState";
import { CustomersPage } from "./pages/CustomersPage";
import { CreateInvoicePage } from "./pages/CreateInvoicePage";
import { DashboardPage } from "./pages/DashboardPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { ReportsPage } from "./pages/ReportsPage";
import { getPageFromHash, type PageKey } from "./pages";
import type { Customer, Invoice } from "./types";

function App() {
  const [customers, setCustomers] = usePersistentState<Customer[]>("cashir.customers", mockCustomers);
  const [invoices, setInvoices] = usePersistentState<Invoice[]>("cashir.invoices", mockInvoices);
  const [activePage, setActivePage] = useState<PageKey>(getPageFromHash);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const handleHashChange = () => setActivePage(getPageFromHash());
    window.addEventListener("hashchange", handleHashChange);

    if (!window.location.hash) {
      window.location.hash = "dashboard";
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function handleNavigate(page: PageKey) {
    window.location.hash = page;
    setActivePage(page);
    setIsMenuOpen(false);
  }

  function handleAddCustomer(customer: Customer) {
    setCustomers((currentCustomers) => [...currentCustomers, customer]);
  }

  function handleSaveInvoice(invoice: Invoice) {
    setInvoices((currentInvoices) => [invoice, ...currentInvoices]);
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === invoice.customerId
          ? {
              ...customer,
              remainingBalance: invoice.remainingBalance,
              status: invoice.remainingBalance > 0 ? "مستحق" : "منتظم",
            }
          : customer,
      ),
    );
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={handleNavigate}
      isMenuOpen={isMenuOpen}
      onToggleMenu={() => setIsMenuOpen((value) => !value)}
    >
      {activePage === "dashboard" ? (
        <DashboardPage customers={customers} invoices={invoices} onOpenInvoice={setSelectedInvoice} />
      ) : null}
      {activePage === "customers" ? (
        <CustomersPage
          customers={customers}
          invoices={invoices}
          onAddCustomer={handleAddCustomer}
          onOpenInvoice={setSelectedInvoice}
        />
      ) : null}
      {activePage === "create-invoice" ? (
        <CreateInvoicePage customers={customers} invoices={invoices} onSaveInvoice={handleSaveInvoice} />
      ) : null}
      {activePage === "invoices" ? <InvoicesPage invoices={invoices} onOpenInvoice={setSelectedInvoice} /> : null}
      {activePage === "reports" ? (
        <ReportsPage customers={customers} invoices={invoices} onOpenInvoice={setSelectedInvoice} />
      ) : null}

      {selectedInvoice ? (
        <Modal title="تفاصيل الفاتورة" onClose={() => setSelectedInvoice(null)}>
          <InvoiceDetails invoice={selectedInvoice} />
        </Modal>
      ) : null}
    </Layout>
  );
}

export default App;
