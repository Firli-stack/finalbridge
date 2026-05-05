import { useEffect } from 'react';
import { 
  Play, 
  Users, 
  Target, 
  TrendingUp, 
  Mail,
  Phone,
  MapPin,
  ChevronRight
} from 'lucide-react';

// Inline SVG untuk GitHub
const GithubIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

// Inline SVG untuk LinkedIn
const LinkedinIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export function Landing({ onStart }) {
  const technologies = [
    { name: 'Raspberry Pi', color: 'bg-red-600', icon: '🥧' },
    { name: 'LSTM', color: 'bg-gray-800', icon: '🧠' },
    { name: 'MediaPipe', color: 'bg-blue-500', icon: '📹' },
    { name: 'React JS', color: 'bg-cyan-500', icon: '⚛️' },
    { name: 'Python', color: 'bg-yellow-500', icon: '🐍' },
    { name: 'ViteJS', color: 'bg-purple-500', icon: '⚡' },
  ];

  const team = [
    { name: 'Firl Hanifurrahman', role: 'Developer' },
    { name: 'Marsel V.P Naibaho', role: 'Developer' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-400 via-blue-400 to-blue-600 text-gray-800 overflow-y-auto">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <span className="font-bold text-xl text-gray-800">Bridge Com</span>
          </div>
          <button 
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Login sebagai Admin
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Logo Area */}
          <div className="flex justify-center md:justify-end">
            <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-2xl w-full max-w-md">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-4">
                <div className="text-9xl font-bold text-blue-600">B</div>
              </div>
              <h2 className="text-3xl font-bold text-center text-gray-800">Bridge Com</h2>
            </div>
          </div>

          {/* Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Bangun Sistem Pembelajaran Inklusif Dengan BridgeCom
            </h1>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              BridgeCom menghadirkan sistem penerjemah bahasa isyarat berbasis Internet of Things (IoT) yang dirancang untuk mendukung proses pembelajaran inklusif di perguruan tinggi. Sistem ini memanfaatkan kemajuan teknologi kecerdasan buatan untuk membantu mahasiswa penyandang tunarungu dan tunawicara dalam memahami materi kuliah secara real-time.
            </p>
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Mulai Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-white/80 backdrop-blur py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Teknologi yang kami gunakan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {technologies.map((tech) => (
              <div 
                key={tech.name}
                className={`${tech.color} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-white shadow-lg hover:scale-105 transition-transform`}
              >
                <div className="text-4xl">{tech.icon}</div>
                <span className="font-semibold text-center">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tim Pengembang
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {team.map((member) => (
              <div 
                key={member.name}
                className="bg-white/90 backdrop-blur rounded-2xl p-8 text-center shadow-xl hover:scale-105 transition-transform"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                <div className="flex justify-center gap-3 mt-4">
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <GithubIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <LinkedinIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Mail className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-white/80 backdrop-blur py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Visi</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Membantu Mahasiswa inklusif
              </p>
            </div>

            {/* Mission */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Misi</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Membantu interaksi yang efektif antara mahasiswa dan dosen dalam lingkungan kampus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl">
                  B
                </div>
                <span className="font-bold text-xl">Bridge Com</span>
              </div>
              <p className="text-blue-200 text-sm">
                © 2026 BridgeCom. All rights reserved.<br />
                Membangun pembelajaran inklusif melalui teknologi bahasa isyarat berbasis IoT di Politeknik.
              </p>
            </div>

            {/* Hubungi Kami */}
            <div>
              <h3 className="font-bold text-lg mb-4">Hubungi Kami</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-blue-200">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+62 812-3456-7890</span>
                </div>
                <div className="flex items-center gap-3 text-blue-200">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">bridgecom@poliban.ac.id</span>
                </div>
                <div className="flex items-center gap-3 text-blue-200">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Politeknik Negeri Batam</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Tautan Cepat</h3>
              <div className="space-y-2">
                <button 
                  onClick={onStart}
                  className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors w-full text-left"
                >
                  <ChevronRight className="w-4 h-4" />
                  Mulai Menggunakan
                </button>
                <a href="#" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors w-full text-left">
                  <ChevronRight className="w-4 h-4" />
                  Dokumentasi
                </a>
                <a href="#" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors w-full text-left">
                  <ChevronRight className="w-4 h-4" />
                  Tentang Kami
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-8 text-center text-blue-300 text-sm">
            <p>Dikembangkan dengan ❤️ untuk pendidikan inklusif di Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}