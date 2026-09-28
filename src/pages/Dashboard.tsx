import Layout from "../components/Layout";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { newsData, timelineData, sentimentData, platformData, topicData } from "../data/mockData";
import { Eye, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAVY = "#0D1B2E";
const GOLD = "#C9A53E";

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl p-4 md:p-5 border flex flex-col gap-1" style={{ borderColor: "#E2E8F0" }}>
      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>{label}</p>
      <p className="text-2xl md:text-3xl font-bold" style={{ color: color || NAVY, fontFamily: "DM Sans, sans-serif" }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: "#94A3B8" }}>{sub}</p>}
    </div>
  );
}

function SentimentBadge({ value }: { value: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    Positif: { bg: "#DCFCE7", text: "#16A34A" },
    Netral: { bg: "#F1F5F9", text: "#475569" },
    Negatif: { bg: "#FEE2E2", text: "#DC2626" },
  };
  const s = map[value] || { bg: "#F1F5F9", text: "#475569" };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: s.bg, color: s.text }}>
      {value}
    </span>
  );
}

function RelevansiBadge({ value }: { value: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={value === "Relevan"
        ? { backgroundColor: "#DBEAFE", color: "#1D4ED8" }
        : { backgroundColor: "#FEF3C7", color: "#B45309" }
      }
    >
      {value}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg p-3 shadow-lg text-xs" style={{ borderColor: "#E2E8F0" }}>
        <p className="font-semibold mb-1" style={{ color: NAVY }}>{label}</p>
        <p style={{ color: GOLD }}>{payload[0].value} berita</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const totalBerita = newsData.length;
  const relevan = newsData.filter(n => n.relevansi === "Relevan").length;
  const positif = newsData.filter(n => n.sentimen === "Positif").length;
  const netral = newsData.filter(n => n.sentimen === "Netral").length;
  const negatif = newsData.filter(n => n.sentimen === "Negatif").length;

  return (
    <Layout title="Dashboard Monitoring" subtitle="Ikhtisar monitoring isu aktual secara real-time">
      {/* Summary stats — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <StatCard label="Total Berita" value={totalBerita} sub="Semua sumber" color={NAVY} />
        <StatCard label="Berita Relevan" value={relevan} sub={`${Math.round(relevan/totalBerita*100)}% dari total`} color="#1D4ED8" />
        <StatCard label="Sumber Media" value={6} sub="Platform aktif" color="#7C3AED" />
        <StatCard label="Topik / Isu" value={5} sub="Terdeteksi otomatis" color={GOLD} />
      </div>

      {/* Sentiment breakdown — 1 col on mobile, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        {[
          { icon: <TrendingUp size={18} style={{ color: "#16A34A" }} />, bg: "#DCFCE7", label: "Positif", value: positif, color: "#16A34A" },
          { icon: <Minus size={18} style={{ color: "#475569" }} />, bg: "#F1F5F9", label: "Netral", value: netral, color: "#475569" },
          { icon: <TrendingDown size={18} style={{ color: "#DC2626" }} />, bg: "#FEE2E2", label: "Negatif", value: negatif, color: "#DC2626" },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl p-4 border flex items-center gap-4" style={{ borderColor: "#E2E8F0" }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-medium" style={{ color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>{item.label}</p>
              <p className="text-2xl font-bold" style={{ color: item.color, fontFamily: "DM Sans, sans-serif" }}>
                {item.value} <span className="text-sm font-normal text-slate-400">berita</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row — stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        {/* Line chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-5 border" style={{ borderColor: "#E2E8F0" }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
            Grafik Perkembangan Isu
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="berita" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 3 }} activeDot={{ r: 5, fill: GOLD }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl p-4 md:p-5 border" style={{ borderColor: "#E2E8F0" }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
            Distribusi Sentimen
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {sentimentData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {sentimentData.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs" style={{ color: "#64748B" }}>{s.name}</span>
                </div>
                <span className="text-xs font-semibold" style={{ color: NAVY }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart + Topics — stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-5 border" style={{ borderColor: "#E2E8F0" }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
            Distribusi Platform / Sumber
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={platformData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="platform" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" name="Berita" fill={NAVY} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-5 border" style={{ borderColor: "#E2E8F0" }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
            Topik / Isu Terdeteksi
          </h3>
          <div className="space-y-3">
            {topicData.map(t => (
              <div key={t.topik}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: "#475569" }}>{t.topik}</span>
                  <span className="text-xs font-semibold" style={{ color: NAVY }}>{t.jumlah}</span>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ backgroundColor: "#F1F5F9" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${(t.jumlah / 24) * 100}%`, backgroundColor: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest news table — scrollable on mobile */}
      <div className="bg-white rounded-xl border" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-4 md:px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#F1F5F9" }}>
          <h3 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>
            Berita Terbaru
          </h3>
          <button
            onClick={() => navigate("/monitoring")}
            className="text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ color: GOLD, backgroundColor: "rgba(201, 165, 62, 0.1)" }}
          >
            Lihat Semua
          </button>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden divide-y" style={{ borderColor: "#F1F5F9" }}>
          {newsData.slice(0, 6).map(n => (
            <div key={n.id} className="px-4 py-3 space-y-2">
              <p className="text-sm font-medium leading-snug" style={{ color: NAVY }}>{n.judul}</p>
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs" style={{ color: "#64748B" }}>{n.sumber}</span>
                <span style={{ color: "#CBD5E0" }}>·</span>
                <span className="text-xs" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>{n.tanggal}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <SentimentBadge value={n.sentimen} />
                <RelevansiBadge value={n.relevansi} />
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}>{n.platform}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC" }}>
                {["Judul Berita", "Sumber", "Tanggal", "Platform", "Sentimen", "Topik", "Relevansi", "Aksi"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace", fontSize: "10px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {newsData.slice(0, 6).map(n => (
                <tr key={n.id} className="border-t hover:bg-slate-50 transition-colors" style={{ borderColor: "#F1F5F9" }}>
                  <td className="px-4 py-3 font-medium max-w-xs" style={{ color: NAVY }}>
                    <span className="line-clamp-2 leading-snug">{n.judul}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#475569" }}>{n.sumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>{n.tanggal}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}>{n.platform}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><SentimentBadge value={n.sentimen} /></td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#64748B" }}>{n.topik}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><RelevansiBadge value={n.relevansi} /></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate("/monitoring")}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:opacity-80"
                      style={{ color: NAVY, backgroundColor: "#F1F5F9" }}
                    >
                      <Eye size={12} />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
