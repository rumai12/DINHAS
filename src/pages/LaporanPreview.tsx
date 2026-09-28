import { useState } from "react";
import Layout from "../components/Layout";
import { newsData, sentimentData, topicData, summaryText, keyInsights } from "../data/mockData";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import { ChevronLeft, ChevronRight, Download, ArrowLeft, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAVY = "#0D1B2E";
const GOLD = "#C9A53E";

const timelineData = [
  { tanggal: "13 Sep", berita: 2 }, { tanggal: "14 Sep", berita: 3 },
  { tanggal: "15 Sep", berita: 5 }, { tanggal: "16 Sep", berita: 8 },
  { tanggal: "17 Sep", berita: 12 }, { tanggal: "18 Sep", berita: 15 },
  { tanggal: "19 Sep", berita: 11 }, { tanggal: "20 Sep", berita: 9 },
  { tanggal: "21 Sep", berita: 7 },
];

const platformData = [
  { platform: "Online", count: 48 }, { platform: "Twitter/X", count: 127 },
  { platform: "Instagram", count: 89 }, { platform: "Facebook", count: 63 },
];

const relevan = newsData.filter(n => n.relevansi === "Relevan");

function SlideContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-xl overflow-hidden relative flex flex-col" style={{ backgroundColor: NAVY, aspectRatio: "16/9" }}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none"><circle cx="100" cy="0" r="80" fill={GOLD} /></svg>
      </div>
      <div className="absolute bottom-0 left-0 w-20 h-20 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none"><circle cx="0" cy="100" r="60" fill={GOLD} /></svg>
      </div>
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 opacity-30 pointer-events-none">
        <div className="w-3.5 h-3.5 rounded flex items-center justify-center" style={{ backgroundColor: GOLD }}>
          <span className="text-white font-bold" style={{ fontSize: "7px" }}>D</span>
        </div>
        <span className="text-white" style={{ fontFamily: "DM Sans, sans-serif", fontSize: "9px" }}>DINHAS</span>
      </div>
      {children}
    </div>
  );
}

function SlideHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 md:px-8 pt-5 md:pt-7 pb-3 md:pb-4">
      <div className="w-1 h-6 md:h-8 rounded-full flex-shrink-0" style={{ backgroundColor: GOLD }} />
      <div>
        <h2 className="text-base md:text-xl font-bold text-white" style={{ fontFamily: "DM Sans, sans-serif" }}>{title}</h2>
        {sub && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{sub}</p>}
      </div>
    </div>
  );
}

const slides = [
  {
    label: "Judul Isu",
    render: () => (
      <SlideContainer>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 md:px-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: GOLD }}>
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-white text-base font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>DINHAS</span>
          </div>
          <h1 className="text-base md:text-2xl font-bold text-white mb-3 leading-snug" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Laporan Monitoring Berita<br />Kebakaran PT Anisa Jaya Utama Brebes
          </h1>
          <div className="w-12 h-0.5 mb-3" style={{ backgroundColor: GOLD }} />
          <p className="text-xs md:text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Periode Monitoring: 13–21 September 2026</p>
        </div>
      </SlideContainer>
    ),
  },
  {
    label: "Ringkasan Informasi",
    render: () => (
      <SlideContainer>
        <SlideHeader title="Ringkasan Informasi" sub="Executive Summary" />
        <div className="flex-1 px-5 md:px-8 pb-5 overflow-hidden">
          <p className="text-xs leading-relaxed text-white opacity-80 line-clamp-4 mb-3">{summaryText.split("\n\n")[0]}</p>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[
              { label: "Total Berita", value: newsData.length },
              { label: "Berita Relevan", value: relevan.length },
              { label: "Sumber Media", value: 6 },
            ].map(item => (
              <div key={item.label} className="rounded-lg p-2 md:p-3 text-center" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <p className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "DM Sans, sans-serif" }}>{item.value}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SlideContainer>
    ),
  },
  {
    label: "Statistik Berita",
    render: () => (
      <SlideContainer>
        <SlideHeader title="Statistik Berita" sub="Distribusi data hasil monitoring" />
        <div className="flex-1 px-5 md:px-8 pb-5 grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Proporsi Relevansi</p>
            <div className="flex h-3 rounded-full overflow-hidden mb-1">
              <div style={{ width: `${(relevan.length / newsData.length) * 100}%`, backgroundColor: GOLD }} />
              <div style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)" }} />
            </div>
            <div className="flex gap-3 text-xs">
              <span style={{ color: GOLD }}>Relevan: {relevan.length}</span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>Tidak: {newsData.length - relevan.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Positif", value: newsData.filter(n => n.sentimen === "Positif").length, color: "#22C55E" },
              { label: "Netral", value: newsData.filter(n => n.sentimen === "Netral").length, color: "#94A3B8" },
              { label: "Negatif", value: newsData.filter(n => n.sentimen === "Negatif").length, color: "#EF4444" },
              { label: "Total", value: newsData.length, color: GOLD },
            ].map(item => (
              <div key={item.label} className="rounded p-2 text-center" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <p className="text-lg font-bold" style={{ color: item.color, fontFamily: "DM Sans, sans-serif" }}>{item.value}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SlideContainer>
    ),
  },
  {
    label: "Analisis Sentimen",
    render: () => (
      <SlideContainer>
        <SlideHeader title="Analisis Sentimen" sub="Distribusi pemberitaan berdasarkan sentimen" />
        <div className="flex-1 px-5 md:px-8 pb-5 flex items-center gap-4 md:gap-8">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={sentimentData} innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value">
                {sentimentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2.5">
            {sentimentData.map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-white flex-1">{s.name}</span>
                <div className="flex-1">
                  <div className="h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                    <div className="h-2 rounded-full" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-white w-8 text-right">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </SlideContainer>
    ),
  },
  {
    label: "Klasifikasi Topik/Isu",
    render: () => (
      <SlideContainer>
        <SlideHeader title="Klasifikasi Topik/Isu" sub="Pengelompokan berita berdasarkan topik" />
        <div className="flex-1 px-5 md:px-8 pb-4">
          <div className="space-y-2">
            {topicData.map(t => (
              <div key={t.topik} className="flex items-center gap-3">
                <span className="text-xs text-white w-36 truncate flex-shrink-0">{t.topik}</span>
                <div className="flex-1 h-5 rounded overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded flex items-center px-2" style={{ width: `${(t.jumlah / 24) * 100}%`, backgroundColor: GOLD }}>
                    <span className="text-xs font-bold text-white">{t.jumlah}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SlideContainer>
    ),
  },
  {
    label: "Perkembangan Isu",
    render: () => (
      <SlideContainer>
        <SlideHeader title="Perkembangan Isu" sub="Volume pemberitaan dari waktu ke waktu" />
        <div className="flex-1 px-2 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#1E3452", border: "none", color: "white", fontSize: "11px" }} />
              <Line type="monotone" dataKey="berita" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 3 }} name="Berita" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SlideContainer>
    ),
  },
  {
    label: "Sumber Media",
    render: () => (
      <SlideContainer>
        <SlideHeader title="Sumber Media" sub="Platform yang menjadi sumber pemberitaan" />
        <div className="flex-1 px-2 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="platform" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#1E3452", border: "none", color: "white", fontSize: "11px" }} />
              <Bar dataKey="count" fill={GOLD} radius={[3, 3, 0, 0]} name="Berita" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SlideContainer>
    ),
  },
  {
    label: "Berita Relevan",
    render: () => (
      <SlideContainer>
        <SlideHeader title="Berita Relevan" sub={`${relevan.length} berita terfilter`} />
        <div className="flex-1 px-5 md:px-8 pb-4 overflow-hidden">
          <div className="space-y-2">
            {relevan.slice(0, 5).map((n, i) => (
              <div key={n.id} className="flex items-start gap-2 py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: GOLD, fontFamily: "JetBrains Mono, monospace" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-xs text-white flex-1 line-clamp-1">{n.judul}</p>
                <span className="text-xs flex-shrink-0 hidden sm:block" style={{ color: "rgba(255,255,255,0.4)" }}>{n.sumber}</span>
              </div>
            ))}
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>+ {relevan.length - 5} berita lainnya di lampiran</p>
          </div>
        </div>
      </SlideContainer>
    ),
  },
  {
    label: "Insight",
    render: () => (
      <SlideContainer>
        <SlideHeader title="Insight & Temuan" sub="Key findings dari analisis AI" />
        <div className="flex-1 px-5 md:px-8 pb-5 grid grid-cols-2 gap-2 md:gap-3 overflow-hidden">
          {keyInsights.slice(0, 4).map(insight => (
            <div key={insight.judul} className="rounded-lg p-2 md:p-3" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">{insight.icon}</span>
                <p className="text-xs font-semibold text-white">{insight.judul}</p>
              </div>
              <p className="text-xs leading-snug line-clamp-2" style={{ color: "rgba(255,255,255,0.6)" }}>{insight.isi}</p>
            </div>
          ))}
        </div>
      </SlideContainer>
    ),
  },
  {
    label: "Kesimpulan",
    render: () => (
      <SlideContainer>
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12">
          <div className="w-10 h-0.5 mb-4" style={{ backgroundColor: GOLD }} />
          <h2 className="text-lg md:text-xl font-bold text-white mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>Kesimpulan</h2>
          <ul className="space-y-2.5">
            {[
              "Kebakaran PT Anisa Jaya Utama adalah isu prioritas dengan dampak sosial-ekonomi yang luas.",
              "Respons pemerintah daerah yang cepat berhasil meredam eskalasi sentimen negatif.",
              "Investigasi forensik dan status karyawan terdampak membutuhkan pemantauan berkelanjutan.",
              "Monitoring lanjutan disarankan dalam 7–14 hari ke depan.",
            ].map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: GOLD }} />
                <p className="text-xs leading-snug text-white opacity-80">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </SlideContainer>
    ),
  },
];

export default function LaporanPreview() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [showThumbs, setShowThumbs] = useState(false);

  return (
    <Layout title="Preview Laporan PowerPoint" subtitle="DINHAS_Report_Kebakaran_Anisa_Jaya_2026.pptx · 10 Slides">
      {/* Mobile slide picker */}
      <div className="md:hidden mb-3">
        <button
          onClick={() => setShowThumbs(!showThumbs)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-white rounded-xl border"
          style={{ borderColor: "#E2E8F0", color: "#0D1B2E" }}
        >
          <Layers size={14} />
          Slide {current + 1} / {slides.length}: {slides[current].label}
        </button>
        {showThumbs && (
          <div className="bg-white rounded-xl border mt-2 p-3 grid grid-cols-3 sm:grid-cols-5 gap-2" style={{ borderColor: "#E2E8F0" }}>
            {slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setShowThumbs(false); }}
                className="rounded-lg overflow-hidden border-2 text-left"
                style={{ borderColor: current === i ? GOLD : "#E2E8F0" }}
              >
                <div className="aspect-video flex items-end p-1.5" style={{ backgroundColor: NAVY }}>
                  <p className="text-white text-xs truncate leading-tight opacity-70" style={{ fontSize: "8px" }}>{slide.label}</p>
                </div>
                <div className="px-1.5 py-0.5 text-center" style={{ fontSize: "9px", color: current === i ? GOLD : "#64748B" }}>
                  {i + 1}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 md:gap-5">
        {/* Desktop thumbnails */}
        <div className="hidden md:block w-44 flex-shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>
            Slide Navigator
          </p>
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
            {slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-full text-left rounded-lg overflow-hidden border-2 transition-all"
                style={{ borderColor: current === i ? GOLD : "#E2E8F0" }}
              >
                <div className="aspect-video flex items-end p-2" style={{ backgroundColor: NAVY }}>
                  <p className="text-xs text-white opacity-70 truncate leading-tight">{slide.label}</p>
                </div>
                <div
                  className="px-2 py-1 text-xs font-medium"
                  style={{ backgroundColor: current === i ? "rgba(201,165,62,0.1)" : "#F8FAFC", color: current === i ? GOLD : "#64748B", fontFamily: "JetBrains Mono, monospace", fontSize: "10px" }}
                >
                  {i + 1} / {slides.length}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main preview */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            {slides[current].render()}
          </div>

          {/* Slide nav controls */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => navigate("/laporan")}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
              style={{ color: "#64748B" }}
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Kembali ke Laporan</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
                className="p-2 rounded-lg border hover:bg-slate-50 disabled:opacity-40 transition-colors"
                style={{ borderColor: "#E2E8F0" }}
              >
                <ChevronLeft size={16} style={{ color: "#475569" }} />
              </button>
              <span className="text-sm font-medium" style={{ color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>
                {current + 1} / {slides.length}
              </span>
              <button
                onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))}
                disabled={current === slides.length - 1}
                className="p-2 rounded-lg border hover:bg-slate-50 disabled:opacity-40 transition-colors"
                style={{ borderColor: "#E2E8F0" }}
              >
                <ChevronRight size={16} style={{ color: "#475569" }} />
              </button>
            </div>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: NAVY }}
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download</span> PowerPoint
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
