import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  Search,
  ExternalLink,
  Eye,
  X,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAVY = "#0D1B2E";
const GOLD = "#C9A53E";

type NewsItem = {
  id?: number;
  judul: string;
  sumber: string;
  tanggal: string;
  relevansi: string;
  konten: string;
  url: string;
  keyword: string;
  platform?: string;
  sentimen?: string;
  topik?: string;
  status?: string;
};

type RelevanceFilter = "Semua" | "Relevan" | "Kurang Relevan";

function RelevansiBadge({ value }: { value: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={
        value === "Relevan"
          ? {
              backgroundColor: "#DBEAFE",
              color: "#1D4ED8",
            }
          : {
              backgroundColor: "#FEF3C7",
              color: "#B45309",
            }
      }
    >
      {value || "Kurang Relevan"}
    </span>
  );
}

function formatTanggal(date: string) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MonitoringBerita() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [newsResults, setNewsResults] = useState<NewsItem[]>([]);
  const [activeKeyword, setActiveKeyword] = useState("");
  const [searchTime, setSearchTime] = useState("");
  const [selected, setSelected] = useState<NewsItem | null>(null);

  const [relevanceFilter, setRelevanceFilter] =
    useState<RelevanceFilter>("Semua");

  useEffect(() => {
    const savedResult = sessionStorage.getItem(
      "dinhas_search_result"
    );

    if (!savedResult) {
      return;
    }

    try {
      const data = JSON.parse(savedResult);

      const results = Array.isArray(data.results)
        ? data.results
        : [];

      setNewsResults(results);
      setActiveKeyword(data.keyword || "");

      if (data.waktuPencarian) {
        setSearchTime(data.waktuPencarian);
      }

      console.log("DATA MONITORING:", results);
    } catch (error) {
      console.error(
        "Gagal membaca hasil pencarian:",
        error
      );
    }
  }, []);

  const totalRelevan = useMemo(() => {
    return newsResults.filter(
      (news) => news.relevansi === "Relevan"
    ).length;
  }, [newsResults]);

  const totalKurangRelevan = useMemo(() => {
    return newsResults.filter(
      (news) => news.relevansi === "Kurang Relevan"
    ).length;
  }, [newsResults]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return newsResults.filter((news) => {
      const cocokPencarian =
        !keyword ||
        (news.judul || "")
          .toLowerCase()
          .includes(keyword) ||
        (news.sumber || "")
          .toLowerCase()
          .includes(keyword) ||
        (news.konten || "")
          .toLowerCase()
          .includes(keyword);

      const cocokRelevansi =
        relevanceFilter === "Semua" ||
        news.relevansi === relevanceFilter;

      return cocokPencarian && cocokRelevansi;
    });
  }, [
    newsResults,
    search,
    relevanceFilter,
  ]);

  const openSource = (url: string) => {
    if (!url) return;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Layout
      title="Monitoring Berita"
      subtitle="Pantau dan kelola berita yang dikumpulkan sistem"
    >
      {/* STATUS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-5">
        {[
          {
            label: "Keyword Aktif",
            value: activeKeyword || "-",
            num: false,
          },
          {
            label: "Waktu Pencarian",
            value: searchTime
              ? formatTanggal(searchTime)
              : newsResults.length
              ? formatTanggal(newsResults[0]?.tanggal)
              : "-",
            num: false,
          },
          {
            label: "Total Ditemukan",
            value: newsResults.length,
            num: true,
          },
          {
            label: "Data Relevan",
            value: totalRelevan,
            num: true,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-3 md:p-4 border"
            style={{
              borderColor: "#E2E8F0",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {i === 0 && (
                <Activity
                  size={12}
                  style={{ color: GOLD }}
                />
              )}

              <p
                className="text-xs font-medium uppercase tracking-wider"
                style={{
                  color: "#94A3B8",
                  fontFamily:
                    "JetBrains Mono, monospace",
                }}
              >
                {item.label}
              </p>
            </div>

            <p
              className={`font-semibold truncate ${
                item.num
                  ? "text-2xl"
                  : "text-xs md:text-sm"
              }`}
              style={{
                color: NAVY,
                fontFamily: item.num
                  ? "DM Sans, sans-serif"
                  : "inherit",
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div
        className="bg-white rounded-xl p-3 md:p-4 border mb-4 space-y-3"
        style={{
          borderColor: "#E2E8F0",
        }}
      >
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{
              color: "#94A3B8",
            }}
          />

          <input
            type="text"
            placeholder="Cari judul atau sumber…"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border outline-none"
            style={{
              borderColor: "#E2E8F0",
              backgroundColor: "#F8FAFC",
              color: NAVY,
            }}
          />
        </div>

        {/* FILTER RELEVANSI */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: "Semua",
                count: newsResults.length,
              },
              {
                label: "Relevan",
                count: totalRelevan,
              },
              {
                label: "Kurang Relevan",
                count: totalKurangRelevan,
              },
            ].map((item) => {
              const active =
                relevanceFilter === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() =>
                    setRelevanceFilter(
                      item.label as RelevanceFilter
                    )
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: active
                      ? NAVY
                      : "#F8FAFC",
                    color: active
                      ? "#FFFFFF"
                      : "#64748B",
                    border: `1px solid ${
                      active
                        ? NAVY
                        : "#E2E8F0"
                    }`,
                  }}
                >
                  {item.label} ({item.count})
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              navigate("/analisis")
            }
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{
              backgroundColor: GOLD,
            }}
          >
            Lanjut ke Analisis →
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden space-y-3 mb-4">
        <p
          className="text-sm font-medium"
          style={{
            color: "#64748B",
          }}
        >
          {filtered.length} berita ditemukan
        </p>

        {filtered.length === 0 ? (
          <div
            className="bg-white rounded-xl border p-8 text-center"
            style={{
              borderColor: "#E2E8F0",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{
                color: NAVY,
              }}
            >
              Tidak ada berita
            </p>

            <p
              className="text-xs mt-1"
              style={{
                color: "#94A3B8",
              }}
            >
              Coba ubah kata pencarian
              atau filter relevansi.
            </p>
          </div>
        ) : (
          filtered.map((news, i) => (
            <div
              key={`${news.url}-${i}`}
              className="bg-white rounded-xl p-4 border cursor-pointer hover:shadow-sm transition-shadow"
              style={{
                borderColor: "#E2E8F0",
              }}
              onClick={() =>
                setSelected(news)
              }
            >
              <div className="flex items-start gap-2 mb-2">
                <span
                  className="text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{
                    color: "#94A3B8",
                    fontFamily:
                      "JetBrains Mono, monospace",
                  }}
                >
                  {String(i + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <p
                  className="text-sm font-medium leading-snug"
                  style={{
                    color: NAVY,
                  }}
                >
                  {news.judul || "-"}
                </p>
              </div>

              <div
                className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-2"
                style={{
                  color: "#64748B",
                }}
              >
                <span>
                  {news.sumber || "-"}
                </span>

                <span
                  style={{
                    fontFamily:
                      "JetBrains Mono, monospace",
                  }}
                >
                  {formatTanggal(
                    news.tanggal
                  )}
                </span>
              </div>

              <RelevansiBadge
                value={
                  news.relevansi ||
                  "Kurang Relevan"
                }
              />
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div
        className="hidden md:block bg-white rounded-xl border overflow-hidden"
        style={{
          borderColor: "#E2E8F0",
        }}
      >
        <div
          className="px-5 py-3 border-b flex items-center justify-between"
          style={{
            borderColor: "#F1F5F9",
          }}
        >
          <p
            className="text-sm font-semibold"
            style={{
              color: NAVY,
              fontFamily:
                "DM Sans, sans-serif",
            }}
          >
            {filtered.length} berita ditemukan
          </p>

          <p
            className="text-xs"
            style={{
              color: "#94A3B8",
            }}
          >
            {totalRelevan} relevan ·{" "}
            {totalKurangRelevan} kurang relevan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr
                style={{
                  backgroundColor: "#F8FAFC",
                }}
              >
                {[
                  "No",
                  "Judul Berita",
                  "Sumber",
                  "Tanggal",
                  "Relevansi",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{
                      color: "#94A3B8",
                      fontFamily:
                        "JetBrains Mono, monospace",
                      fontSize: "10px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((news, i) => (
                <tr
                  key={`${news.url}-${i}`}
                  className="border-t hover:bg-slate-50 transition-colors cursor-pointer"
                  style={{
                    borderColor: "#F1F5F9",
                  }}
                  onClick={() =>
                    setSelected(news)
                  }
                >
                  <td
                    className="px-4 py-3 whitespace-nowrap"
                    style={{
                      color: "#94A3B8",
                      fontFamily:
                        "JetBrains Mono, monospace",
                    }}
                  >
                    {String(i + 1).padStart(
                      2,
                      "0"
                    )}
                  </td>

                  <td className="px-4 py-3 max-w-md">
                    <p
                      className="font-medium line-clamp-2 leading-snug"
                      style={{
                        color: NAVY,
                      }}
                    >
                      {news.judul || "-"}
                    </p>
                  </td>

                  <td
                    className="px-4 py-3 whitespace-nowrap"
                    style={{
                      color: "#475569",
                    }}
                  >
                    {news.sumber || "-"}
                  </td>

                  <td
                    className="px-4 py-3 whitespace-nowrap"
                    style={{
                      color: "#64748B",
                      fontFamily:
                        "JetBrains Mono, monospace",
                    }}
                  >
                    {formatTanggal(
                      news.tanggal
                    )}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <RelevansiBadge
                      value={
                        news.relevansi ||
                        "Kurang Relevan"
                      }
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >
                      <button
                        onClick={() =>
                          setSelected(news)
                        }
                        className="p-1.5 rounded hover:bg-slate-100"
                        title="Lihat detail"
                      >
                        <Eye
                          size={13}
                          style={{
                            color: NAVY,
                          }}
                        />
                      </button>

                      <button
                        onClick={() =>
                          openSource(
                            news.url
                          )
                        }
                        className="p-1.5 rounded hover:bg-slate-100"
                        title="Buka sumber"
                      >
                        <ExternalLink
                          size={13}
                          style={{
                            color: "#64748B",
                          }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() =>
              setSelected(null)
            }
          />

          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div
              className="sticky top-0 bg-white px-5 md:px-6 py-4 border-b flex items-center justify-between"
              style={{
                borderColor: "#E2E8F0",
              }}
            >
              <h3
                className="font-bold text-base"
                style={{
                  color: NAVY,
                  fontFamily:
                    "DM Sans, sans-serif",
                }}
              >
                Detail Berita
              </h3>

              <button
                onClick={() =>
                  setSelected(null)
                }
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X
                  size={16}
                  style={{
                    color: "#64748B",
                  }}
                />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-5">
              <h2
                className="font-bold text-sm md:text-base leading-snug"
                style={{
                  color: NAVY,
                }}
              >
                {selected.judul || "-"}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Sumber",
                    value:
                      selected.sumber ||
                      "-",
                  },
                  {
                    label:
                      "Tanggal Publikasi",
                    value: formatTanggal(
                      selected.tanggal
                    ),
                  },
                  {
                    label: "Keyword",
                    value:
                      selected.keyword ||
                      "-",
                  },
                  {
                    label: "Relevansi",
                    value:
                      selected.relevansi ||
                      "Kurang Relevan",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <p
                      className="text-xs uppercase tracking-wider font-medium mb-1"
                      style={{
                        color: "#94A3B8",
                        fontFamily:
                          "JetBrains Mono, monospace",
                      }}
                    >
                      {item.label}
                    </p>

                    <p
                      className="text-sm font-medium"
                      style={{
                        color: NAVY,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <p
                  className="text-xs uppercase tracking-wider font-medium mb-2"
                  style={{
                    color: "#94A3B8",
                    fontFamily:
                      "JetBrains Mono, monospace",
                  }}
                >
                  Konten Berita
                </p>

                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "#475569",
                  }}
                >
                  {selected.konten ||
                    "Konten berita tidak tersedia."}
                </p>
              </div>

              <div>
                <p
                  className="text-xs uppercase tracking-wider font-medium mb-2"
                  style={{
                    color: "#94A3B8",
                    fontFamily:
                      "JetBrains Mono, monospace",
                  }}
                >
                  URL Sumber
                </p>

                <button
                  onClick={() =>
                    openSource(
                      selected.url
                    )
                  }
                  className="w-full flex items-center gap-2 p-3 rounded-lg text-left hover:bg-slate-100"
                  style={{
                    backgroundColor:
                      "#F8FAFC",
                  }}
                >
                  <p
                    className="text-xs truncate flex-1"
                    style={{
                      color: "#64748B",
                    }}
                  >
                    {selected.url || "-"}
                  </p>

                  <ExternalLink
                    size={12}
                    style={{
                      color: "#64748B",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}