export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-8 text-sm text-slate-600">
      <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
      {message}
    </div>
  );
}
