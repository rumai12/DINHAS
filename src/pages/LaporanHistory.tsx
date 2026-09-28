import { useState } from "react";
import Layout from "../components/Layout";
import { reportHistory } from "../data/mockData";
import { Eye, Download, Trash2, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAVY = "#0D1B2E";
const GOLD = "#C9A53E";

export default function LaporanHistory() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(reportHistory);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = reports.filter(r =>
    r.nama.toLowerCase().includes(search.toLowerCase()) ||
    r.keyword.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setReports(prev => prev.filter(r => r.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <Layout title="Riwayat Laporan" subtitle="Kelola laporan yang telah dibuat sebelumnya">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-5">
        {[
          { label: "Total Laporan", value: reports.length },
          { label: "Laporan Selesai", value: reports.filter(r => r.status === "Selesai").length },
          { label: "Total Berita", value: reports.reduce((a, r) => a + r.jumlah, 0) },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl p-3 md:p-4 border" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{item.label}</p>
            <p className="text-xl md:text-2xl font-bold" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Search and actions */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Cari laporan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border outline-none bg-white"
            style={{ borderColor: "#E2E8F0", color: NAVY }}
          />
        </div>
        <button
          onClick={() => navigate("/laporan")}
          className="flex-shrink-0 px-3 md:px-4 py-2.5 rounded-xl text-white text-sm font-medium whitespace-nowrap"
          style={{ backgroundColor: NAVY }}
        >
          <span className="hidden sm:inline">+ Buat </span>Laporan Baru
        </button>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {filtered.map((r, i) => (
          <div key={r.id} className="bg-white rounded-xl p-4 border" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-semibold leading-snug" style={{ color: NAVY }}>{r.nama}</p>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                style={{ backgroundColor: r.status === "Selesai" ? "#DCFCE7" : "#FEF3C7", color: r.status === "Selesai" ? "#16A34A" : "#B45309" }}
              >{r.status}</span>
            </div>
            <p className="text-xs mb-2" style={{ color: "#64748B" }}>{r.keyword}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-3" style={{ color: "#94A3B8" }}>
              <span>{r.tanggal}</span>
              <span>·</span>
              <span>{r.jumlah} berita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <FileText size={11} style={{ color: GOLD }} />
                <span className="text-xs truncate" style={{ color: "#64748B" }}>{r.file}</span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => navigate("/laporan/preview")} className="p-2 rounded-lg bg-slate-100" title="Preview">
                  <Eye size={13} style={{ color: NAVY }} />
                </button>
                <button className="p-2 rounded-lg bg-slate-100" title="Download">
                  <Download size={13} style={{ color: "#64748B" }} />
                </button>
                {deleteConfirm === r.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => handleDelete(r.id)} className="px-2 py-1 rounded text-xs text-white" style={{ backgroundColor: "#DC2626" }}>Hapus</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded text-xs" style={{ color: "#64748B", backgroundColor: "#F1F5F9" }}>Batal</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(r.id)} className="p-2 rounded-lg hover:bg-red-50" title="Hapus">
                    <Trash2 size={13} style={{ color: "#DC2626" }} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: "#94A3B8" }}>Tidak ada laporan yang ditemukan</div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC" }}>
                {["No", "Nama Laporan", "Keyword/Isu", "Tanggal", "Jumlah Berita", "Status", "File", "Aksi"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace", fontSize: "10px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className="border-t hover:bg-slate-50 transition-colors" style={{ borderColor: "#F1F5F9" }}>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium line-clamp-2 leading-snug" style={{ color: NAVY }}>{r.nama}</p>
                  </td>
                  <td className="px-4 py-3 max-w-48">
                    <p className="text-xs line-clamp-1" style={{ color: "#64748B" }}>{r.keyword}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>{r.tanggal}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold" style={{ color: NAVY }}>{r.jumlah}</span>
                    <span style={{ color: "#94A3B8" }}> berita</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: r.status === "Selesai" ? "#DCFCE7" : "#FEF3C7", color: r.status === "Selesai" ? "#16A34A" : "#B45309" }}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-48">
                    <div className="flex items-center gap-1.5">
                      <FileText size={11} style={{ color: GOLD }} />
                      <span className="truncate" style={{ color: "#64748B" }}>{r.file}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => navigate("/laporan/preview")} className="p-1.5 rounded hover:bg-slate-100" title="Preview">
                        <Eye size={13} style={{ color: NAVY }} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-slate-100" title="Download">
                        <Download size={13} style={{ color: "#64748B" }} />
                      </button>
                      {deleteConfirm === r.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(r.id)} className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: "#DC2626" }}>Hapus</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 rounded text-xs" style={{ color: "#64748B", backgroundColor: "#F1F5F9" }}>Batal</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(r.id)} className="p-1.5 rounded hover:bg-red-50" title="Hapus">
                          <Trash2 size={13} style={{ color: "#DC2626" }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: "#94A3B8" }}>Tidak ada laporan yang ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
