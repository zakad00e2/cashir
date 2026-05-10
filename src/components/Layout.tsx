import type { ReactNode } from "react";
import type { PageKey } from "../pages";

type NavItem = {
  key: PageKey;
  label: string;
  hint: string;
};

const navItems: NavItem[] = [
  { key: "dashboard", label: "لوحة التحكم", hint: "نظرة عامة" },
  { key: "customers", label: "العملاء", hint: "الأرصدة والحسابات" },
  { key: "create-invoice", label: "إنشاء فاتورة", hint: "فاتورة جديدة" },
  { key: "invoices", label: "الفواتير", hint: "الأرشيف والمتابعة" },
  { key: "reports", label: "التقارير", hint: "المبيعات والتحصيل" },
];

type LayoutProps = {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  children: ReactNode;
};

export function Layout({ activePage, onNavigate, isMenuOpen, onToggleMenu, children }: LayoutProps) {
  return (
    <div className="app-shell">
      <aside className={`sidebar ${isMenuOpen ? "sidebar--open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">ك</span>
          <div>
            <strong>كاشير</strong>
            <small>إدارة الفواتير والأرصدة</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="التنقل الرئيسي">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={activePage === item.key ? "nav-item nav-item--active" : "nav-item"}
              onClick={() => onNavigate(item.key)}
            >
              <span className="nav-dot" aria-hidden="true" />
              <span>
                <strong>{item.label}</strong>
                <small>{item.hint}</small>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {isMenuOpen ? <button className="mobile-scrim" type="button" onClick={onToggleMenu} aria-label="إغلاق القائمة" /> : null}

      <main className="main-area">
        <header className="topbar">
          <button className="menu-button" type="button" onClick={onToggleMenu} aria-label="فتح القائمة">
            ☰
          </button>
          <div>
            <span className="eyebrow">نظام إدارة مالي</span>
            <h1>إدارة الفواتير وأرصدة العملاء</h1>
          </div>
          <div className="topbar-pill">نسخة عرض أمامية</div>
        </header>
        {children}
      </main>
    </div>
  );
}
