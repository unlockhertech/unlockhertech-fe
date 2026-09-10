export function PageLoadingFallback() {
  return (
    <div
      className="min-h-screen bg-stone-50 flex items-center justify-center p-4"
      role="status"
      aria-label="Loading page content"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#B42970] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-stone-500">Loading...</span>
      </div>
    </div>
  );
}
