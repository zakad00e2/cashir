import type { CustomerStatus, InvoiceStatus } from "../types";

type StatusBadgeProps = {
  status: InvoiceStatus | CustomerStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone =
    status === "خالصة" || status === "منتظم"
      ? "success"
      : status === "ناقص تسليم" || status === "متابعة"
        ? "warning"
        : "danger";

  return <span className={`status-badge status-badge--${tone}`}>{status}</span>;
}
