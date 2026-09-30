import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Search, Calendar, Globe, Clock, CheckCircle, Loader, ChevronRight } from "lucide-react";
import { searchHistory } from "../data/mockData";

const NAVY = "#0D1B2E";
const GOLD = "#C9A53E";

const platforms = ["Semua Platform", "Online", "Twitter/X", "Instagram", "Facebook", "YouTube", "TikTok"];

type ProcessStep = { label: string; done: boolean; active: boolean };

export default function PencarianKeyword() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-09-13");
  const [dateTo, setDateTo] = useState("2026-09-21");
  const [platform, setPlatform] = useState("Semua Platform");
  const [processing, setProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [done, setDone] = useState(false);

  const processSteps = [
    "Mengambil data dari platform",
    "Mengumpulkan berita relevan",
    "Menyaring relevansi konten",
    "Menganalisis informasi",
  ];

  const handleSearch = async () => {
  if (!keyword.trim()) return;

  setDone(false);
  setProcessing(true);
  setSteps(
    processSteps.map((label, i) => ({
      label,
      done: false,
      active: i === 0,
    }))
  );

  try {
    const response = await fetch("http://localhost:5000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyword: keyword.trim(),
        dateFrom,
        dateTo,
        platform,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Pencarian gagal");
    }

    sessionStorage.setItem(
      "dinhas_search_result",
      JSON.stringify(data)
    );

    setSteps(
      processSteps.map(label => ({
        label,
        done: true,
        active: false,
      }))
    );

    setDone(true);
    setProcessing(false);

    navigate("/monitoring");
  } catch (error) {
    console.error("Search error:", error);
    setProcessing(false);
    setSteps([]);
    alert("Gagal menghubungi backend. Pastikan server DINHAS berjalan.");
  }
};

  return (
    <Layout title="Pencarian Keyword" subtitle="Tentukan keyword atau isu yang ingin dipantau">
      {/* Search box */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border mb-4 md:mb-5" style={{ borderColor: "#E2E8F0" }}>
        <h2 className="font-bold text-base md:text-lg mb-4" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
          Pencarian Berita
        </h2>
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Masukkan keyword atau isu yang ingin dipantau…"
            className="w-full pl-11 pr-4 py-3 md:py-4 text-sm md:text-base rounded-xl border outline-none transition-all"
            style={{
              borderColor: keyword ? GOLD : "#E2E8F0",
              backgroundColor: "#F8FAFC",
              color: NAVY,
              boxShadow: keyword ? `0 0 0 3px rgba(201, 165, 62, 0.1)` : "none",
            }}
          />
        </div>

        {/* Filters — 1 col on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-5">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#475569" }}>Tanggal Mulai</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border outline-none"
                style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", color: NAVY }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#475569" }}>Tanggal Akhir</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border outline-none"
                style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", color: NAVY }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#475569" }}>Platform</label>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border outline-none appearance-none"
                style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", color: NAVY }}
              >
                {platforms.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={!keyword.trim() || processing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: NAVY, fontFamily: "DM Sans, sans-serif" }}
        >
          <Search size={16} />
          Mulai Monitoring
        </button>
      </div>

      {/* Processing state */}
      {(processing || done) && (
        <div className="bg-white rounded-xl p-4 md:p-6 border mb-4 md:mb-5" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center gap-2 mb-4">
            {processing && <Loader size={16} className="animate-spin" style={{ color: GOLD }} />}
            {done && <CheckCircle size={16} style={{ color: "#16A34A" }} />}
            <h3 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
              {processing ? "Proses Monitoring Berjalan…" : "Monitoring Selesai"}
            </h3>
          </div>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.done ? "bg-green-100" : step.active ? "bg-amber-100" : "bg-slate-100"
                }`}>
                  {step.done
                    ? <CheckCircle size={12} style={{ color: "#16A34A" }} />
                    : step.active
                      ? <Loader size={12} className="animate-spin" style={{ color: GOLD }} />
                      : <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#CBD5E0" }} />
                  }
                </div>
                <span className="text-sm" style={{ color: step.done ? "#16A34A" : step.active ? GOLD : "#94A3B8" }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          {done && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F1F5F9" }}>
              <p className="text-sm" style={{ color: "#16A34A" }}>
                ✓ Ditemukan 12 berita relevan dari 412 sumber yang dipindai
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search history */}
      <div className="bg-white rounded-xl border" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-4 md:px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "#F1F5F9" }}>
          <Clock size={16} style={{ color: "#94A3B8" }} />
          <h3 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
            Riwayat Pencarian
          </h3>
        </div>
        <div className="divide-y" style={{ borderColor: "#F1F5F9" }}>
          {searchHistory.map(item => (
            <div key={item.id} className="px-4 md:px-5 py-3 md:py-4 flex items-start md:items-center gap-3 hover:bg-slate-50 transition-colors group">
              <Search size={14} style={{ color: "#94A3B8" }} className="flex-shrink-0 mt-0.5 md:mt-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: NAVY }}>{item.keyword}</p>
                <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                  {item.tanggal} · {item.jumlah} berita ditemukan
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs px-2 py-0.5 rounded-full hidden sm:inline" style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}>
                  {item.status}
                </span>
                <button
                  onClick={() => setKeyword(item.keyword)}
                  className="flex items-center gap-1 text-xs px-2 md:px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: "rgba(201, 165, 62, 0.1)", color: GOLD }}
                >
                  <span className="hidden sm:inline">Gunakan</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
