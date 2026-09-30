import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { newsData } from "../data/mockData";
import { Search, ExternalLink, Eye, X, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

function RelevansiBadge({ value }: { value: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={value === "Relevan"
        ? { backgroundColor: "#DBEAFE", color: "#1D4ED8" }
        : { backgroundColor: "#FEF3C7", color: "#B45309" }
      }
    >{value}</span>
  );
}

export default function MonitoringBerita() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterSentimen, setFilterSentimen] = useState("Semua");
  const [filterRelevansi, setFilterRelevansi] = useState("Semua");
  const [newsResults, setNewsResults] = useState<typeof newsData>([]);
  const [activeKeyword, setActiveKeyword] = useState("");
  const [selected, setSelected] = useState<typeof newsData[0] | null>(null);

  useEffect(() => {
  const savedResult = sessionStorage.getItem("dinhas_search_result");

  if (savedResult) {
    try {
      const data = JSON.parse(savedResult);

      setNewsResults(data.results || []);
      setActiveKeyword(data.keyword || "");
    } catch (error) {
      console.error("Gagal membaca hasil pencarian:", error);
    }
  }
}, []);

  const filtered = newsResults.filter(n => {
    const matchSearch = n.judul.toLowerCase().includes(search.toLowerCase()) || n.sumber.toLowerCase().includes(search.toLowerCase());
    const matchSentimen = filterSentimen === "Semua" || n.sentimen === filterSentimen;
    const matchRelevansi = filterRelevansi === "Semua" || n.relevansi === filterRelevansi;
    return matchSearch && matchSentimen && matchRelevansi;
  });

  return (
    <Layout title="Monitoring Berita" subtitle="Pantau dan kelola berita yang dikumpulkan sistem">
      {/* Status bar — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-5">
        {[
          { label: "Keyword Aktif", value: activeKeyword || "-", small: true },
          { label: "Waktu Pencarian", value: "21 Sep 2026, 09:14" },
          { label: "Total Ditemukan", value: newsResults.length, num: true },
          { label: "Data Relevan", value: newsResults.filter(n => n.relevansi === "Relevan").length, num: true },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-3 md:p-4 border" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-1.5 mb-1">
              {i === 0 && <Activity size={12} style={{ color: GOLD }} />}
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>
                {item.label}
              </p>
            </div>
            <p className={`font-semibold truncate ${item.num ? "text-2xl" : "text-xs md:text-sm"}`}
              style={{ color: NAVY, fontFamily: item.num ? "DM Sans, sans-serif" : "inherit" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-3 md:p-4 border mb-4 space-y-3" style={{ borderColor: "#E2E8F0" }}>
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Cari judul atau sumber…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border outline-none"
            style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", color: NAVY }}
          />
        </div>

        {/* Filter pills — wrap on mobile */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs self-center" style={{ color: "#64748B" }}>Sentimen:</span>
          {["Semua", "Positif", "Netral", "Negatif"].map(s => (
            <button
              key={s}
              onClick={() => setFilterSentimen(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={filterSentimen === s ? { backgroundColor: NAVY, color: "white" } : { backgroundColor: "#F1F5F9", color: "#64748B" }}
            >{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs self-center" style={{ color: "#64748B" }}>Relevansi:</span>
          {["Semua", "Relevan", "Tidak Relevan"].map(r => (
            <button
              key={r}
              onClick={() => setFilterRelevansi(r)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={filterRelevansi === r ? { backgroundColor: NAVY, color: "white" } : { backgroundColor: "#F1F5F9", color: "#64748B" }}
            >{r}</button>
          ))}
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={() => navigate("/analisis")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: GOLD }}
          >
            Lanjut ke Analisis →
          </button>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3 mb-4">
        <p className="text-sm font-medium" style={{ color: "#64748B" }}>{filtered.length} berita ditemukan</p>
        {filtered.map((n, i) => (
          <div
            key={n.id}
            className="bg-white rounded-xl p-4 border cursor-pointer hover:shadow-sm transition-shadow"
            style={{ borderColor: "#E2E8F0" }}
            onClick={() => setSelected(n)}
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-xs font-bold flex-shrink-0 mt-0.5" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-medium leading-snug" style={{ color: NAVY }}>{n.judul}</p>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-2" style={{ color: "#64748B" }}>
              <span>{n.sumber}</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{n.tanggal}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <RelevansiBadge value={n.relevansi} />
              <SentimentBadge value={n.sentimen} />
              <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}>{n.topik}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "#F1F5F9" }}>
          <p className="text-sm font-semibold" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
            {filtered.length} berita ditemukan
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC" }}>
                {["No", "Judul Berita", "Sumber", "Platform", "Tanggal", "Relevansi", "Sentimen", "Topik", "Aksi"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace", fontSize: "10px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((n, i) => (
                <tr key={n.id} className="border-t hover:bg-slate-50 transition-colors cursor-pointer" style={{ borderColor: "#F1F5F9" }} onClick={() => setSelected(n)}>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium line-clamp-2 leading-snug" style={{ color: NAVY }}>{n.judul}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#475569" }}>{n.sumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}>{n.platform}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>{n.tanggal}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><RelevansiBadge value={n.relevansi} /></td>
                  <td className="px-4 py-3 whitespace-nowrap"><SentimentBadge value={n.sentimen} /></td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#64748B" }}>{n.topik}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setSelected(n)} className="p-1.5 rounded hover:bg-slate-100" title="Lihat detail">
                        <Eye size={13} style={{ color: NAVY }} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-slate-100" title="Buka sumber">
                        <ExternalLink size={13} style={{ color: "#64748B" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setSelected(null)} />
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white px-5 md:px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#E2E8F0" }}>
              <h3 className="font-bold text-base" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>Detail Berita</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X size={16} style={{ color: "#64748B" }} />
              </button>
            </div>
            <div className="p-5 md:p-6 space-y-5">
              <h2 className="font-bold text-sm md:text-base leading-snug" style={{ color: NAVY }}>{selected.judul}</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Sumber", value: selected.sumber },
                  { label: "Platform", value: selected.platform },
                  { label: "Tanggal Publikasi", value: selected.tanggal },
                  { label: "Status", value: selected.status },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-xs uppercase tracking-wider font-medium mb-1" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{item.label}</p>
                    <p className="text-sm font-medium" style={{ color: NAVY }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>Relevansi</p>
                  <RelevansiBadge value={selected.relevansi} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>Sentimen</p>
                  <SentimentBadge value={selected.sentimen} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>Topik</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(201, 165, 62, 0.1)", color: GOLD }}>{selected.topik}</span>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>Konten Berita</p>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{selected.konten}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>URL Sumber</p>
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                  <p className="text-xs truncate flex-1" style={{ color: "#64748B" }}>{selected.url}</p>
                  <ExternalLink size={12} style={{ color: "#64748B" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
