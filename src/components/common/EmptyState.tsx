type EmptyStateProps = {
  title: string;
  message?: string;
};

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
      <p className="text-base font-semibold text-slate-800">{title}</p>
      {message ? <p className="mt-2 text-sm">{message}</p> : null}
    </div>
  );
}
