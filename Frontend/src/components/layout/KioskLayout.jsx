export function KioskLayout({ children }) {
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 text-white overflow-hidden">
      {children}
    </div>
  );
}