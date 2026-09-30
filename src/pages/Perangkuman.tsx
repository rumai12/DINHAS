import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { newsData, summaryText } from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Edit, Save, CheckCircle, Sparkles } from "lucide-react";

const NAVY = "#0D1B2E";
const GOLD = "#C9A53E";

function SentimentBadge({ value }: { value: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    Positif: { bg: "#DCFCE7", text: "#16A34A" },
    Netral: { bg: "#F1F5F9", text: "#475569" },
    Negatif: { bg: "#FEE2E2", text: "#DC2626" },
  };
  const s = map[value] || { bg: "#F1F5F9", text: "#475569" };
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{value}</span>;
}

const keyPoints = [
  "Kebakaran gudang PT Anisa Jaya Utama di Brebes terjadi pada 18 September 2026 dan menghanguskan ratusan ton bahan baku.",
  "Dugaan awal penyebab adalah korsleting listrik, namun investigasi Labfor Polda Jateng masih berjalan.",
  "Ratusan karyawan terancam PHK akibat kerugian produksi yang sangat besar.",
  "Pemerintah Kabupaten Brebes cepat membentuk tim khusus penanganan dampak sosial-ekonomi pascakebakaran.",
  "Bantuan dari pemerintah dan pihak swasta mulai diterima para korban terdampak pada 20–21 September 2026.",
];

export default function Perangkuman() {
  const navigate = useNavigate();

  const [relevantNews, setRelevantNews] = useState<typeof newsData>([]);

  useEffect(() => {
    const savedResult = sessionStorage.getItem("dinhas_search_result");

    if (savedResult) {
      try {
        const data = JSON.parse(savedResult);

        const results = data.results || [];

        setRelevantNews(
          results.filter((n: typeof newsData[number]) => n.relevansi === "Relevan")
        );
      } catch (error) {
        console.error("Gagal membaca data perangkuman:", error);
      }
    }
  }, []);

  const relevan = relevantNews;
  const [selected, setSelected] = useState<Set<number>>(new Set(relevan.map(n => n.id)));
  const [processing, setProcessing] = useState(false);
  const [summaryDone, setSummaryDone] = useState(true);
  const [summary, setSummary] = useState(summaryText);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showNewsList, setShowNewsList] = useState(false);

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const regenerate = () => {
    setSummaryDone(false);
    setProcessing(true);
    setSaved(false);
    setTimeout(() => { setProcessing(false); setSummaryDone(true); }, 2500);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout title="Perangkuman Informasi" subtitle="Perangkuman otomatis berbasis AI dari berita relevan terpilih">
      {/* Header info — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-5">
        {[
          { label: "Isu Aktif", value: "Kebakaran PT Anisa Jaya Utama Brebes" },
          { label: "Artikel Dipilih", value: `${selected.size} dari ${relevan.length}` },
          { label: "Sumber Digunakan", value: `${[...new Set(relevan.filter(n => selected.has(n.id)).map(n => n.sumber))].length} media` },
          { label: "Periode Analisis", value: "13–21 Sep 2026" },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl p-3 md:p-4 border" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{item.label}</p>
            <p className="text-xs md:text-sm font-semibold leading-tight" style={{ color: NAVY }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Mobile: collapsible news list */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowNewsList(!showNewsList)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border text-sm font-medium"
          style={{ borderColor: "#E2E8F0", color: NAVY }}
        >
          <span>Berita yang Dirangkum ({selected.size} dipilih)</span>
          <span style={{ transform: showNewsList ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
        </button>
        {showNewsList && (
          <div className="bg-white rounded-xl border mt-2 divide-y overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
            {relevan.map(n => (
              <div key={n.id} className="px-4 py-3 flex items-start gap-3 cursor-pointer" onClick={() => toggleSelect(n.id)}>
                <div
                  className="w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                  style={{ borderColor: selected.has(n.id) ? GOLD : "#CBD5E0", backgroundColor: selected.has(n.id) ? GOLD : "transparent" }}
                >
                  {selected.has(n.id) && <CheckCircle size={10} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-snug" style={{ color: NAVY }}>{n.judul}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs" style={{ color: "#94A3B8" }}>{n.sumber}</span>
                    <SentimentBadge value={n.sentimen} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
        {/* Left: news list — desktop only */}
        <div className="hidden md:block md:col-span-2 bg-white rounded-xl border" style={{ borderColor: "#E2E8F0" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
            <h3 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>Berita yang Dirangkum</h3>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Pilih berita yang akan disertakan</p>
          </div>
          <div className="divide-y overflow-y-auto" style={{ maxHeight: "560px", borderColor: "#F1F5F9" }}>
            {relevan.map(n => (
              <div key={n.id} className="px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleSelect(n.id)}>
                <div className="flex items-start gap-3">
                  <div
                    className="w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                    style={{ borderColor: selected.has(n.id) ? GOLD : "#CBD5E0", backgroundColor: selected.has(n.id) ? GOLD : "transparent" }}
                  >
                    {selected.has(n.id) && <CheckCircle size={10} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-snug line-clamp-2 mb-1.5" style={{ color: NAVY }}>{n.judul}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: "#94A3B8" }}>{n.sumber}</span>
                      <span className="text-xs" style={{ color: "#CBD5E0" }}>·</span>
                      <span className="text-xs" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{n.tanggal}</span>
                    </div>
                    <div className="flex gap-1.5 mt-1.5">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>{n.topik}</span>
                      <SentimentBadge value={n.sentimen} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: summary */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="bg-white rounded-xl border flex-1" style={{ borderColor: "#E2E8F0" }}>
            <div className="px-4 md:px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "#F1F5F9" }}>
              <Sparkles size={16} style={{ color: GOLD }} />
              <h3 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
                Automatic Text Summarization
              </h3>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(201,165,62,0.1)", color: GOLD }}>AI Generated</span>
            </div>

            {processing ? (
              <div className="p-8 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${GOLD}40`, borderTopColor: GOLD }} />
                <p className="text-sm font-medium" style={{ color: "#64748B" }}>AI sedang merangkum informasi…</p>
                <p className="text-xs text-center" style={{ color: "#94A3B8" }}>Memproses {selected.size} artikel dari berbagai sumber</p>
              </div>
            ) : summaryDone ? (
              <div className="p-4 md:p-5">
                <h4 className="font-semibold text-sm mb-3" style={{ color: NAVY }}>Ringkasan Informasi</h4>
                {editing ? (
                  <textarea
                    className="w-full text-sm leading-relaxed border rounded-lg p-3 outline-none resize-none"
                    style={{ color: "#475569", borderColor: "#E2E8F0", minHeight: "140px" }}
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                  />
                ) : (
                  <div className="space-y-3">
                    {summary.split("\n\n").map((para, i) => (
                      <p key={i} className="text-sm leading-relaxed" style={{ color: "#475569" }}>{para}</p>
                    ))}
                  </div>
                )}

                <div className="mt-5 pt-4 border-t" style={{ borderColor: "#F1F5F9" }}>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: NAVY }}>Informasi Utama</h4>
                  <ul className="space-y-2">
                    {keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold mt-0.5" style={{ backgroundColor: GOLD, fontSize: "10px" }}>
                          {i + 1}
                        </span>
                        <p className="text-sm leading-snug" style={{ color: "#475569" }}>{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
                <Sparkles size={32} style={{ color: "#CBD5E0" }} />
                <p className="text-sm font-medium" style={{ color: "#94A3B8" }}>Pilih berita dan klik Regenerate Summary</p>
              </div>
            )}
          </div>

          {/* Action buttons — wrap on mobile */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={regenerate}
              className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-lg border text-sm font-medium hover:bg-slate-50"
              style={{ borderColor: "#E2E8F0", color: "#475569" }}
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Regenerate</span> Summary
            </button>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-lg border text-sm font-medium hover:bg-slate-50"
              style={{ borderColor: "#E2E8F0", color: "#475569" }}
            >
              <Edit size={14} />
              {editing ? "Selesai" : "Edit"}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: saved ? "#16A34A" : NAVY }}
            >
              {saved ? <CheckCircle size={14} /> : <Save size={14} />}
              {saved ? "Tersimpan!" : "Simpan"}
            </button>
            <button
              onClick={() => navigate("/insight")}
              className="ml-auto flex items-center gap-1 px-4 md:px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
              style={{ backgroundColor: GOLD }}
            >
              Lanjut ke Insight →
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
