import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, Activity } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email atau password salah.");
        return;
      }

      // Simpan data admin yang berhasil login
      localStorage.setItem("dinhas_user", JSON.stringify(data.user));

      // Jika "Ingat saya" dicentang
      if (remember) {
        localStorage.setItem("dinhas_remember", "true");
      } else {
        localStorage.removeItem("dinhas_remember");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{ backgroundColor: "#0D1B2E" }}
    >
      {/* Left panel — hidden on mobile, shown on lg+ */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Abstract background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full opacity-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#C9A53E"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-5"
            style={{ backgroundColor: "#C9A53E" }}
          />

          <div
            className="absolute bottom-20 -left-20 w-64 h-64 rounded-full opacity-5"
            style={{ backgroundColor: "#26456C" }}
          />

          <svg
            className="absolute right-0 top-1/4 opacity-10"
            width="200"
            height="120"
            viewBox="0 0 200 120"
          >
            <polyline
              points="0,60 20,60 30,20 45,100 60,60 75,60 85,35 100,85 115,60 135,60 145,40 160,80 175,60 200,60"
              fill="none"
              stroke="#C9A53E"
              strokeWidth="1.5"
            />
          </svg>

          <svg
            className="absolute left-0 bottom-1/4 opacity-10"
            width="150"
            height="80"
            viewBox="0 0 150 80"
          >
            <polyline
              points="0,40 15,40 25,15 38,65 52,40 65,40 75,25 90,55 105,40 120,40 135,20 150,50"
              fill="none"
              stroke="#C9A53E"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#C9A53E" }}
            >
              <Activity size={22} className="text-white" />
            </div>

            <span
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              DINHAS
            </span>
          </div>

          <h2
            className="text-3xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Digital Intelligence
            <br />
            News & Analysis System
          </h2>

          <div
            className="w-12 h-0.5 mb-5"
            style={{ backgroundColor: "#C9A53E" }}
          />

          <p
            className="text-base leading-relaxed"
            style={{ color: "#94A3B8", maxWidth: "360px" }}
          >
            Sistem Monitoring Berita Multi-Platform untuk Analisis dan
            Perangkuman Informasi Isu Aktual berbasis Kecerdasan Buatan.
          </p>
        </div>

        <div className="relative space-y-4">
          {[
            {
              label: "Monitoring Multi-Platform",
              desc: "Pantau berita dari berbagai sumber sekaligus",
            },
            {
              label: "Analisis Sentimen Otomatis",
              desc: "Deteksi sentimen positif, netral, dan negatif",
            },
            {
              label: "Generate Laporan PowerPoint",
              desc: "Buat laporan profesional secara otomatis",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div
                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: "#C9A53E" }}
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  {item.label}
                </p>

                <p className="text-xs" style={{ color: "#64748B" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

          <p className="text-xs pt-4" style={{ color: "#334155" }}>
            © 2026 DINHAS System · Universitas Diponegoro
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div
        className="flex-1 flex items-center justify-center p-5 md:p-8"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#C9A53E" }}
            >
              <Activity size={18} className="text-white" />
            </div>

            <div>
              <span
                className="font-bold text-lg block"
                style={{
                  color: "#0D1B2E",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                DINHAS
              </span>

              <span className="text-xs" style={{ color: "#64748B" }}>
                Digital Intelligence News & Analysis System
              </span>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border"
            style={{ borderColor: "#E2E8F0" }}
          >
            <div className="mb-6 md:mb-8">
              <h3
                className="text-xl md:text-2xl font-bold mb-1"
                style={{
                  color: "#0D1B2E",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Masuk ke Sistem
              </h3>

              <p className="text-sm" style={{ color: "#64748B" }}>
                Silakan masukkan kredensial Anda untuk melanjutkan
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-4 md:space-y-5"
            >
              {/* EMAIL */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "#1A2340" }}
                >
                  Email
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#94A3B8" }}
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border outline-none transition-all"
                    style={{
                      borderColor: "#E2E8F0",
                      backgroundColor: "#F8FAFC",
                      color: "#1A2340",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#C9A53E")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "#E2E8F0")
                    }
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "#1A2340" }}
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#94A3B8" }}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border outline-none transition-all"
                    style={{
                      borderColor: "#E2E8F0",
                      backgroundColor: "#F8FAFC",
                      color: "#1A2340",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#C9A53E")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "#E2E8F0")
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff size={16} style={{ color: "#94A3B8" }} />
                    ) : (
                      <Eye size={16} style={{ color: "#94A3B8" }} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* REMEMBER */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "#C9A53E" }}
                  />

                  <span
                    className="text-sm"
                    style={{ color: "#64748B" }}
                  >
                    Ingat saya
                  </span>
                </label>

                <button
                  type="button"
                  className="text-sm font-medium"
                  style={{ color: "#C9A53E" }}
                >
                  Lupa password?
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                style={{
                  backgroundColor: "#0D1B2E",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memverifikasi…
                  </span>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            <div
              className="mt-5 pt-5 border-t text-center"
              style={{ borderColor: "#F1F5F9" }}
            >
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                Akses sistem hanya untuk Admin DINHAS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}