import Layout from "../components/Layout";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { newsData, sentimentData, timelineData, topicData } from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, TrendingUp, BarChart2 } from "lucide-react";

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

function SectionLabel({ letter, title }: { letter: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-5 rounded flex-shrink-0" style={{ backgroundColor: GOLD }} />
      <h2 className="font-bold text-xs sm:text-sm uppercase tracking-wider" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
        {letter}. {title}
      </h2>
    </div>
  );
}

export default function AnalisisInformasi() {
  const navigate = useNavigate();
  const relevan = newsData.filter(n => n.relevansi === "Relevan");
  const tidakRelevan = newsData.filter(n => n.relevansi !== "Relevan");
  const positif = newsData.filter(n => n.sentimen === "Positif").length;
  const netral = newsData.filter(n => n.sentimen === "Netral").length;
  const negatif = newsData.filter(n => n.sentimen === "Negatif").length;

  return (
    <Layout title="Analisis Informasi" subtitle="Hasil analisis komprehensif berita yang terkumpul">
      {/* A. Filtering Relevansi */}
      <div className="mb-5 md:mb-6">
        <SectionLabel letter="A" title="Filtering Relevansi" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Total Berita", value: newsData.length, color: NAVY, icon: <BarChart2 size={14} style={{ color: NAVY }} /> },
            { label: "Berita Relevan", value: relevan.length, color: "#1D4ED8", icon: <CheckCircle size={14} style={{ color: "#1D4ED8" }} /> },
            { label: "Tidak Relevan", value: tidakRelevan.length, color: "#DC2626", icon: <XCircle size={14} style={{ color: "#DC2626" }} /> },
            { label: "Persentase Relevan", value: `${Math.round(relevan.length / newsData.length * 100)}%`, color: "#16A34A", icon: <TrendingUp size={14} style={{ color: "#16A34A" }} /> },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl p-3 md:p-4 border" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-center justify-between mb-2">
                {item.icon}
                <p className="text-xs uppercase tracking-wider font-medium text-right" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{item.label}</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold" style={{ color: item.color, fontFamily: "DM Sans, sans-serif" }}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 border mt-3" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-xs font-medium mb-3" style={{ color: "#64748B" }}>Visualisasi proporsi relevansi</p>
          <div className="flex h-3 rounded-full overflow-hidden">
            <div style={{ width: `${(relevan.length / newsData.length) * 100}%`, backgroundColor: "#1D4ED8" }} />
            <div style={{ flex: 1, backgroundColor: "#E2E8F0" }} />
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#1D4ED8" }} />
              <span className="text-xs" style={{ color: "#64748B" }}>Relevan ({relevan.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#E2E8F0" }} />
              <span className="text-xs" style={{ color: "#64748B" }}>Tidak Relevan ({tidakRelevan.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* B. Analisis Sentimen */}
      <div className="mb-5 md:mb-6">
        <SectionLabel letter="B" title="Analisis Sentimen" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-xl p-4 md:p-5 border" style={{ borderColor: "#E2E8F0" }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {sentimentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {sentimentData.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs" style={{ color: "#475569" }}>{s.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: NAVY }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-3 gap-3">
            {[
              { label: "Positif", value: positif, color: "#16A34A", bg: "#DCFCE7", pct: Math.round(positif/newsData.length*100) },
              { label: "Netral", value: netral, color: "#475569", bg: "#F1F5F9", pct: Math.round(netral/newsData.length*100) },
              { label: "Negatif", value: negatif, color: "#DC2626", bg: "#FEE2E2", pct: Math.round(negatif/newsData.length*100) },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-xl p-3 md:p-4 border flex flex-col items-center justify-center text-center" style={{ borderColor: "#E2E8F0" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: item.bg }}>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.pct}%</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold mb-1" style={{ color: item.color, fontFamily: "DM Sans, sans-serif" }}>{item.value}</p>
                <p className="text-xs font-medium" style={{ color: "#64748B" }}>{item.label}</p>
              </div>
            ))}
            <div className="col-span-3 bg-white rounded-xl p-4 border" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "#64748B" }}>Interpretasi</p>
              <p className="text-xs md:text-sm" style={{ color: "#475569" }}>
                Sentimen <span className="font-semibold" style={{ color: "#475569" }}>netral</span> mendominasi pemberitaan (45%), diikuti <span className="font-semibold" style={{ color: "#16A34A" }}>positif</span> (28%) dan <span className="font-semibold" style={{ color: "#DC2626" }}>negatif</span> (27%).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* C. Klasifikasi Topik */}
      <div className="mb-5 md:mb-6">
        <SectionLabel letter="C" title="Klasifikasi Topik / Isu" />
        <div className="bg-white rounded-xl p-4 md:p-5 border" style={{ borderColor: "#E2E8F0" }}>
          {/* Topic circles — scroll on mobile */}
          <div className="flex gap-3 overflow-x-auto pb-3 mb-4">
            {topicData.map(t => (
              <div key={t.topik} className="text-center p-3 rounded-xl border flex-shrink-0 w-28" style={{ borderColor: "#E2E8F0" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: t.color }}>
                  <span className="text-white font-bold text-sm">{t.jumlah}</span>
                </div>
                <p className="text-xs leading-tight" style={{ color: "#475569" }}>{t.topik}</p>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={topicData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="topik" tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="jumlah" name="Berita" fill={NAVY} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* D. Perkembangan Isu */}
      <div className="mb-5 md:mb-6">
        <SectionLabel letter="D" title="Perkembangan Isu (Timeline)" />
        <div className="bg-white rounded-xl p-4 md:p-5 border" style={{ borderColor: "#E2E8F0" }}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="berita" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 4 }} name="Jumlah Berita" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* E. Berita Relevan */}
      <div className="mb-4 md:mb-5">
        <SectionLabel letter="E" title="Berita Relevan" />

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {relevan.map((n, i) => (
            <div key={n.id} className="bg-white rounded-xl p-4 border" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex gap-2 mb-1">
                <span className="text-xs font-bold flex-shrink-0" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{i + 1}</span>
                <p className="text-sm font-medium leading-snug" style={{ color: NAVY }}>{n.judul}</p>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                <span className="text-xs" style={{ color: "#64748B" }}>{n.sumber}</span>
                <span className="text-xs" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{n.tanggal}</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                <SentimentBadge value={n.sentimen} />
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>{n.topik}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: "#F8FAFC" }}>
                  {["No", "Judul", "Sumber", "Tanggal", "Sentimen", "Topik"].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace", fontSize: "10px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {relevan.map((n, i) => (
                  <tr key={n.id} className="border-t hover:bg-slate-50" style={{ borderColor: "#F1F5F9" }}>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{i + 1}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium line-clamp-2 leading-snug" style={{ color: NAVY }}>{n.judul}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#475569" }}>{n.sumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>{n.tanggal}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><SentimentBadge value={n.sentimen} /></td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#64748B" }}>{n.topik}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate("/perangkuman")}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-semibold text-sm"
          style={{ backgroundColor: NAVY, fontFamily: "DM Sans, sans-serif" }}
        >
          Lanjut ke Perangkuman →
        </button>
      </div>
    </Layout>
  );
}
