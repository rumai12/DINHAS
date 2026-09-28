import { useState } from "react";
import Layout from "../components/Layout";
import { keyInsights } from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { Sparkles, RefreshCw, Save, CheckCircle, ChevronRight, AlertTriangle } from "lucide-react";

const NAVY = "#0D1B2E";
const GOLD = "#C9A53E";

const developments = [
  { date: "18 Sep", event: "Kebakaran gudang PT Anisa Jaya Utama terjadi, api dipadamkan setelah 4 jam." },
  { date: "19 Sep", event: "Pemerintah Brebes bentuk tim khusus pascakebakaran. Investigasi Labfor dimulai." },
  { date: "20 Sep", event: "Bantuan mulai mengalir dari pemerintah dan swasta. Ratusan karyawan terdampak." },
  { date: "21 Sep", event: "Investigasi masih berlanjut. Tuntutan ganti rugi dari korban mulai bermunculan." },
];

const mainFindings = [
  "Kebakaran PT Anisa Jaya Utama adalah peristiwa dengan dampak sosial-ekonomi paling signifikan dalam monitoring ini.",
  "Sentimen pemberitaan bergerak dari negatif ke lebih positif seiring respons pemerintah yang cepat.",
  "Isu ini mendapat atensi media yang luas, baik dari media lokal maupun nasional.",
  "Perkembangan isu masih aktif dan perlu pemantauan lanjutan dalam 7–14 hari ke depan.",
];

const attentionPoints = [
  "Status ratusan karyawan yang terancam PHK belum memiliki kejelasan hukum resmi.",
  "Investigasi Labfor Polda Jateng belum memberikan kepastian penyebab kebakaran.",
  "Warga sekitar lokasi kebakaran berpotensi terpapar dampak lingkungan asap dan bahan kimia.",
  "Potensi tuntutan hukum dari pihak yang dirugikan perlu dipantau perkembangannya.",
];

export default function Insight() {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleGenerate = () => {
    setGenerated(false);
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2500);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout title="Pembentukan Insight" subtitle="Insight dihasilkan dari analisis, ringkasan, dan perkembangan isu">
      {/* Generation source — scrollable on mobile */}
      <div className="bg-white rounded-xl p-4 md:p-5 border mb-4 md:mb-5" style={{ borderColor: "#E2E8F0" }}>
        <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>Insight Dihasilkan Dari</p>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {[
            { label: "Hasil Analisis", sub: "Sentimen & Topik", color: "#DBEAFE", textColor: "#1D4ED8" },
            { label: "Ringkasan Informasi", sub: "5 poin utama", color: "rgba(201,165,62,0.12)", textColor: GOLD },
            { label: "Perkembangan Isu", sub: "4 milestone", color: "#DCFCE7", textColor: "#16A34A" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: item.color }}>
                <p className="text-xs font-semibold whitespace-nowrap" style={{ color: item.textColor }}>{item.label}</p>
                <p className="text-xs mt-0.5 whitespace-nowrap" style={{ color: item.textColor, opacity: 0.7 }}>{item.sub}</p>
              </div>
              {i < 2 && <ChevronRight size={14} style={{ color: "#CBD5E0" }} className="flex-shrink-0" />}
            </div>
          ))}
          <ChevronRight size={14} style={{ color: "#CBD5E0" }} className="flex-shrink-0" />
          <div className="px-3 py-2 rounded-lg flex items-center gap-2 flex-shrink-0" style={{ backgroundColor: "rgba(201,165,62,0.15)" }}>
            <Sparkles size={14} style={{ color: GOLD }} />
            <p className="text-xs font-semibold" style={{ color: GOLD }}>AI Insight</p>
          </div>
        </div>
      </div>

      {generating && (
        <div className="bg-white rounded-xl p-8 border mb-4 flex flex-col items-center gap-4" style={{ borderColor: "#E2E8F0" }}>
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${GOLD}40`, borderTopColor: GOLD }} />
          <p className="text-sm font-medium" style={{ color: "#64748B" }}>AI sedang membentuk insight…</p>
        </div>
      )}

      {generated && !generating && (
        <>
          {/* Key insight */}
          <div className="rounded-xl p-4 md:p-5 border mb-4 md:mb-5" style={{ backgroundColor: NAVY, borderColor: NAVY }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} style={{ color: GOLD }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: GOLD, fontFamily: "JetBrains Mono, monospace" }}>Key Insight</p>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-white" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Kebakaran PT Anisa Jaya Utama di Brebes merupakan isu dengan eskalasi berita yang signifikan (puncak 15 berita/hari) dan dampak sosial-ekonomi yang luas. Respons pemerintah daerah yang cepat berhasil meredam sentimen negatif, namun status hukum karyawan terdampak dan hasil investigasi forensik masih menjadi perhatian utama.
            </p>
          </div>

          {/* Insight cards — 1 col on mobile, 3 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-5">
            {keyInsights.slice(0, 3).map((insight, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border" style={{ borderColor: "#E2E8F0" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{insight.icon}</span>
                  <h4 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>{insight.judul}</h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{insight.isi}</p>
              </div>
            ))}
          </div>

          {/* Second row — 1 col on mobile, 2 on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
            {keyInsights.slice(3).map((insight, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border" style={{ borderColor: "#E2E8F0" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{insight.icon}</span>
                  <h4 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>{insight.judul}</h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{insight.isi}</p>
              </div>
            ))}

            {/* Perkembangan isu */}
            <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "#E2E8F0" }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>Perkembangan Isu (Kronologis)</h4>
              <div className="space-y-3">
                {developments.map((d, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs font-bold px-2 py-1 rounded flex-shrink-0" style={{ backgroundColor: "rgba(201,165,62,0.1)", color: GOLD, fontFamily: "JetBrains Mono, monospace" }}>
                      {d.date}
                    </span>
                    <p className="text-xs leading-snug" style={{ color: "#475569" }}>{d.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Temuan & Indikasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
            <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "#E2E8F0" }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>Temuan Utama</h4>
              <ul className="space-y-2.5">
                {mainFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: GOLD }} />
                    <p className="text-sm leading-snug" style={{ color: "#475569" }}>{f}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} style={{ color: "#EAB308" }} />
                <h4 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>Indikasi Perhatian</h4>
              </div>
              <ul className="space-y-2.5">
                {attentionPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#EAB308" }} />
                    <p className="text-sm leading-snug" style={{ color: "#475569" }}>{p}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Actions — wrap on mobile */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        <button onClick={handleGenerate} className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-lg border text-sm font-medium hover:bg-slate-50" style={{ borderColor: "#E2E8F0", color: "#475569" }}>
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Regenerate</span> Insight
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: saved ? "#16A34A" : NAVY }}>
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? "Tersimpan!" : "Simpan Insight"}
        </button>
        <button onClick={() => navigate("/laporan")} className="ml-auto px-4 md:px-5 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: GOLD }}>
          Generate Laporan →
        </button>
      </div>
    </Layout>
  );
}
