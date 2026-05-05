import { useState } from 'react';
import { Landing } from './pages/LandingPage';
import { KioskLayout } from './components/layout/KioskLayout';

function TranslationInterface({ onBack }) {
  return (
    <KioskLayout>
      <header className="h-12 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <h1 className="text-lg font-bold text-blue-400">BRIDGECOM - Translation Mode</h1>
        <button 
          onClick={onBack} 
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          ← Kembali ke Beranda
        </button>
      </header>
      <main className="flex-1 p-4 flex gap-4 overflow-hidden">
        <section className="flex-1 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-600 min-w-0">
          <p className="text-slate-500 text-center">Video Feed Component<br/><span className="text-xs">Waiting for stream...</span></p>
        </section>
        <aside className="w-80 bg-slate-800 rounded-xl flex flex-col border border-slate-600 shrink-0">
          <div className="p-3 border-b border-slate-700">
            <h2 className="text-sm font-semibold text-slate-300">Terjemahan</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <p className="text-2xl font-bold text-white mb-2">...</p>
            <p className="text-xs text-slate-500">Menunggu input...</p>
          </div>
        </aside>
      </main>
    </KioskLayout>
  );
}

function App() {
  const [view, setView] = useState('landing');

  if (view === 'landing') {
    return <Landing onStart={() => setView('translation')} />;
  }

  return <TranslationInterface onBack={() => setView('landing')} />;
}

export default App;