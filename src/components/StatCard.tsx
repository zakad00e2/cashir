type StatCardProps = {
  title: string;
  value: string;
  detail?: string;
  tone?: "dark" | "green" | "orange" | "amber";
};

export function StatCard({ title, value, detail, tone = "dark" }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </article>
  );
}
