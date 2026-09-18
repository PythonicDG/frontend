type BadgeProps = {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
};

const toneStyles = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
};

export default function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneStyles[tone]}`}>
      {label}
    </span>
  );
}
