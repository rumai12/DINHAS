import { useState } from "react";
import Layout from "../components/Layout";
import { newsData, summaryText, keyInsights, sentimentData, topicData } from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { FileText, Settings, CheckSquare, Download, Loader, CheckCircle, BarChart2, Newspaper, Lightbulb, BookOpen } from "lucide-react";

const NAVY = "#0D1B2E";
const GOLD = "#C9A53E";

const genSteps = [
  "Mengambil hasil analisis",
  "Memasukkan ringkasan",
  "Memasukkan insight",
  "Membuat visualisasi",
  "Menyusun slide",
  "Menerapkan template",
  "PowerPoint selesai",
];

export default function Laporan() {
  const navigate = useNavigate();
  const relevan = newsData.filter(n => n.relevansi === "Relevan");
  const [title, setTitle] = useState("Laporan Monitoring Kebakaran PT Anisa Jaya Utama Brebes");
  const [template, setTemplate] = useState("Formal Institusional");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeNews, setIncludeNews] = useState(true);
  const [includeInsight, setIncludeInsight] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleGenerate = () => {
    setDone(false);
    setGenerating(true);
    setGenStep(0);
    genSteps.forEach((_, i) => {
      setTimeout(() => {
        setGenStep(i);
        if (i === genSteps.length - 1) {
          setTimeout(() => { setGenerating(false); setDone(true); }, 600);
        }
      }, i * 700);
    });
  };

  const sections = [
    { no: 1, title: "Identitas Isu", icon: <BookOpen size={14} style={{ color: GOLD }} /> },
    { no: 2, title: "Ringkasan Informasi", icon: <FileText size={14} style={{ color: GOLD }} /> },
    { no: 3, title: "Jumlah Berita", icon: <Newspaper size={14} style={{ color: GOLD }} /> },
    { no: 4, title: "Analisis Sentimen", icon: <BarChart2 size={14} style={{ color: GOLD }} /> },
    { no: 5, title: "Klasifikasi Topik/Isu", icon: <BarChart2 size={14} style={{ color: GOLD }} /> },
    { no: 6, title: "Perkembangan Isu", icon: <BarChart2 size={14} style={{ color: GOLD }} /> },
    { no: 7, title: "Sumber Media", icon: <Newspaper size={14} style={{ color: GOLD }} /> },
    { no: 8, title: "Berita Relevan", icon: <Newspaper size={14} style={{ color: GOLD }} /> },
    { no: 9, title: "Insight", icon: <Lightbulb size={14} style={{ color: GOLD }} /> },
    { no: 10, title: "Kesimpulan", icon: <BookOpen size={14} style={{ color: GOLD }} /> },
  ];

  return (
    <Layout title="Generate Laporan" subtitle="Buat laporan monitoring yang komprehensif dan profesional">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 md:mb-5">
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: NAVY }}>
          Buat Laporan
        </button>
        <button
          onClick={() => navigate("/laporan/history")}
          className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
          style={{ color: "#64748B" }}
        >
          Riwayat Laporan
        </button>
      </div>

      {/* Mobile settings toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white rounded-xl border text-sm font-medium"
          style={{ borderColor: "#E2E8F0", color: NAVY }}
        >
          <Settings size={14} />
          Report Settings
          <span className="ml-auto" style={{ transform: showSettings ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
        </button>
        {showSettings && (
          <div className="bg-white rounded-xl border mt-2 p-4 space-y-4" style={{ borderColor: "#E2E8F0" }}>
            <SettingsPanel
              title={title} setTitle={setTitle}
              template={template} setTemplate={setTemplate}
              includeCharts={includeCharts} setIncludeCharts={setIncludeCharts}
              includeNews={includeNews} setIncludeNews={setIncludeNews}
              includeInsight={includeInsight} setIncludeInsight={setIncludeInsight}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {/* Preview */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
            {/* Report header */}
            <div className="p-4 md:p-6" style={{ backgroundColor: NAVY }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: GOLD }}>
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="text-white text-sm font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>DINHAS</span>
                <span className="text-xs ml-auto hidden sm:block" style={{ color: "rgba(255,255,255,0.5)" }}>Digital Intelligence News & Analysis System</span>
              </div>
              <h2 className="text-sm md:text-lg font-bold text-white leading-tight mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                {title}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                <span>Periode: 13–21 September 2026</span>
                <span>Total: {newsData.length} berita</span>
                <span>Relevan: {relevan.length} berita</span>
              </div>
            </div>

            {/* Report sections */}
            <div className="p-4 md:p-5 space-y-4 md:space-y-5">
              {sections.map(s => (
                <div key={s.no} className="border-l-2 pl-4" style={{ borderColor: "#E2E8F0" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>
                      {String(s.no).padStart(2, "0")}
                    </span>
                    {s.icon}
                    <h4 className="font-semibold text-sm" style={{ color: NAVY }}>{s.title}</h4>
                  </div>
                  {s.no === 1 && (
                    <div className="text-xs space-y-1" style={{ color: "#64748B" }}>
                      <p><b style={{ color: NAVY }}>Keyword:</b> Kebakaran PT Anisa Jaya Utama Brebes</p>
                      <p><b style={{ color: NAVY }}>Tanggal Monitoring:</b> 21 September 2026</p>
                    </div>
                  )}
                  {s.no === 2 && <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#64748B" }}>{summaryText.split("\n\n")[0]}</p>}
                  {s.no === 3 && (
                    <div className="flex gap-6 text-xs">
                      <span><b style={{ color: NAVY }}>{newsData.length}</b> <span style={{ color: "#64748B" }}>total</span></span>
                      <span><b style={{ color: "#1D4ED8" }}>{relevan.length}</b> <span style={{ color: "#64748B" }}>relevan</span></span>
                    </div>
                  )}
                  {s.no === 4 && (
                    <div className="flex flex-wrap gap-3 text-xs">
                      {sentimentData.map(sd => (
                        <div key={sd.name} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sd.color }} />
                          <span style={{ color: "#64748B" }}>{sd.name}: <b style={{ color: NAVY }}>{sd.value}%</b></span>
                        </div>
                      ))}
                    </div>
                  )}
                  {s.no === 5 && (
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {topicData.map(t => (
                        <span key={t.topik} className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#475569" }}>
                          {t.topik} ({t.jumlah})
                        </span>
                      ))}
                    </div>
                  )}
                  {s.no === 6 && <p className="text-xs" style={{ color: "#64748B" }}>Puncak pemberitaan pada 18 Sep 2026 dengan 15 berita/hari.</p>}
                  {s.no === 7 && <p className="text-xs" style={{ color: "#64748B" }}>Kompas.com, Detik.com, CNN Indonesia, Antara News, Suara Merdeka, dan lainnya.</p>}
                  {s.no === 8 && <p className="text-xs" style={{ color: "#64748B" }}>{relevan.length} berita relevan tersedia di lampiran.</p>}
                  {s.no === 9 && <p className="text-xs line-clamp-2" style={{ color: "#64748B" }}>{keyInsights[0].isi}</p>}
                  {s.no === 10 && <p className="text-xs" style={{ color: "#64748B" }}>Kebakaran PT Anisa Jaya Utama membutuhkan pemantauan lanjutan terkait investigasi dan dampak karyawan.</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings — desktop only */}
        <div className="hidden md:space-y-4 md:block">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2 mb-4">
              <Settings size={15} style={{ color: NAVY }} />
              <h3 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>Report Settings</h3>
            </div>
            <SettingsPanel
              title={title} setTitle={setTitle}
              template={template} setTemplate={setTemplate}
              includeCharts={includeCharts} setIncludeCharts={setIncludeCharts}
              includeNews={includeNews} setIncludeNews={setIncludeNews}
              includeInsight={includeInsight} setIncludeInsight={setIncludeInsight}
            />
          </div>

          <GeneratePanel
            generating={generating} done={done} genStep={genStep}
            onGenerate={handleGenerate} navigate={navigate}
          />
        </div>
      </div>

      {/* Mobile generate button & progress */}
      <div className="md:hidden mt-4">
        <GeneratePanel
          generating={generating} done={done} genStep={genStep}
          onGenerate={handleGenerate} navigate={navigate}
        />
      </div>
    </Layout>
  );
}

function SettingsPanel({ title, setTitle, template, setTemplate, includeCharts, setIncludeCharts, includeNews, setIncludeNews, includeInsight, setIncludeInsight }: any) {
  const GOLD = "#C9A53E";
  const NAVY = "#0D1B2E";
  const inputStyle = { borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", color: NAVY };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "#475569" }}>Judul Laporan</label>
        <textarea value={title} onChange={e => setTitle(e.target.value)} rows={3} className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none" style={inputStyle} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "#475569" }}>Periode</label>
        <input type="text" defaultValue="13–21 September 2026" className="w-full px-3 py-2 text-xs rounded-lg border outline-none" style={inputStyle} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "#475569" }}>Template</label>
        <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border outline-none" style={inputStyle}>
          {["Formal Institusional", "Modern Profesional", "Akademik"].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-medium" style={{ color: "#475569" }}>Konten Laporan</p>
        {[
          { label: "Include Charts & Visualisasi", state: includeCharts, set: setIncludeCharts },
          { label: "Include Berita Relevan", state: includeNews, set: setIncludeNews },
          { label: "Include Insight", state: includeInsight, set: setIncludeInsight },
        ].map(item => (
          <label key={item.label} className="flex items-center gap-3 cursor-pointer">
            <div
              className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0"
              style={{ borderColor: item.state ? GOLD : "#CBD5E0", backgroundColor: item.state ? GOLD : "transparent" }}
              onClick={() => item.set(!item.state)}
            >
              {item.state && <CheckSquare size={10} className="text-white" />}
            </div>
            <span className="text-xs" style={{ color: "#475569" }}>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function GeneratePanel({ generating, done, genStep, onGenerate, navigate }: any) {
  const NAVY = "#0D1B2E";
  const GOLD = "#C9A53E";

  if (!generating && !done) {
    return (
      <button
        onClick={onGenerate}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all"
        style={{ backgroundColor: NAVY, fontFamily: "DM Sans, sans-serif" }}
      >
        <Download size={16} />
        Generate PowerPoint
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-4 md:p-5" style={{ borderColor: "#E2E8F0" }}>
      <h4 className="font-semibold text-sm mb-4" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
        {done ? "Pembuatan Selesai" : "Membuat Laporan…"}
      </h4>
      <div className="space-y-2.5">
        {genSteps.map((step, i) => {
          const isDone = i < genStep || (i === genStep && done);
          const isActive = i === genStep && !done;
          return (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: isDone ? "#DCFCE7" : isActive ? "rgba(201,165,62,0.1)" : "#F1F5F9" }}>
                {isDone ? <CheckCircle size={10} style={{ color: "#16A34A" }} />
                  : isActive ? <Loader size={10} className="animate-spin" style={{ color: GOLD }} />
                    : null}
              </div>
              <span className="text-xs" style={{ color: isDone ? "#16A34A" : isActive ? GOLD : "#94A3B8" }}>
                {isDone ? "✓ " : ""}{step}
              </span>
            </div>
          );
        })}
      </div>
      {done && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F1F5F9" }}>
          <div className="p-3 md:p-4 rounded-xl border flex items-center gap-3" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(201,165,62,0.15)" }}>
              <FileText size={20} style={{ color: GOLD }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: NAVY }}>DINHAS_Report_Kebakaran_Anisa_Jaya_2026.pptx</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>4.2 MB · 10 Slides</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => navigate("/laporan/preview")} className="flex-1 py-2 rounded-lg border text-xs font-medium hover:bg-slate-50" style={{ borderColor: "#E2E8F0", color: "#475569" }}>
              Lihat Preview
            </button>
            <button className="flex-1 py-2 rounded-lg text-white text-xs font-medium flex items-center justify-center gap-1.5" style={{ backgroundColor: NAVY }}>
              <Download size={12} />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
