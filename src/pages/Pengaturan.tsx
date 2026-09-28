import { useState } from "react";
import Layout from "../components/Layout";
import { User, Lock, Bell, Settings, Save, CheckCircle } from "lucide-react";

const NAVY = "#0D1B2E";
const GOLD = "#C9A53E";

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border" style={{ borderColor: "#E2E8F0" }}>
      <div className="px-4 md:px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "#F1F5F9" }}>
        {icon}
        <h3 className="font-semibold text-sm" style={{ color: NAVY, fontFamily: "DM Sans, sans-serif" }}>{title}</h3>
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "#475569" }}>{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all";
const inputStyle = { borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", color: NAVY };

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
      style={{ backgroundColor: value ? NAVY : "#E2E8F0" }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"
        style={{ transform: value ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function Pengaturan() {
  const [saved, setSaved] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSystem, setNotifSystem] = useState(true);
  const [notifReport, setNotifReport] = useState(false);
  const [theme, setTheme] = useState("Terang");
  const [language, setLanguage] = useState("Indonesia");
  const [autoSave, setAutoSave] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout title="Pengaturan" subtitle="Konfigurasi akun dan preferensi sistem">
      {/* 1-col on mobile, 2-col on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Profile */}
        <Section title="Profil" icon={<User size={15} style={{ color: NAVY }} />}>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0" style={{ backgroundColor: NAVY }}>
              A
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: NAVY }}>Admin DINHAS</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>admin@dinhas.ac.id</p>
              <button className="text-xs mt-1 font-medium" style={{ color: GOLD }}>Ganti foto profil</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <Field label="Nama Depan">
                <input defaultValue="Admin" className={inputClass} style={inputStyle} />
              </Field>
              <Field label="Nama Belakang">
                <input defaultValue="DINHAS" className={inputClass} style={inputStyle} />
              </Field>
            </div>
            <Field label="Email">
              <input defaultValue="admin@dinhas.ac.id" className={inputClass} style={inputStyle} />
            </Field>
            <Field label="Institusi">
              <input defaultValue="Universitas Diponegoro" className={inputClass} style={inputStyle} />
            </Field>
            <Field label="Jabatan">
              <input defaultValue="Administrator Sistem" className={inputClass} style={inputStyle} />
            </Field>
          </div>
        </Section>

        {/* Account */}
        <Section title="Akun & Keamanan" icon={<Lock size={15} style={{ color: NAVY }} />}>
          <div className="space-y-4">
            <Field label="Username">
              <input defaultValue="admin_dinhas" className={inputClass} style={inputStyle} />
            </Field>
            <Field label="Password Saat Ini">
              <input type="password" placeholder="••••••••" className={inputClass} style={inputStyle} />
            </Field>
            <Field label="Password Baru">
              <input type="password" placeholder="Masukkan password baru" className={inputClass} style={inputStyle} />
            </Field>
            <Field label="Konfirmasi Password Baru">
              <input type="password" placeholder="Ulangi password baru" className={inputClass} style={inputStyle} />
            </Field>
            <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: "#FEF3C7", color: "#B45309" }}>
              Pastikan password minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifikasi" icon={<Bell size={15} style={{ color: NAVY }} />}>
          <div className="space-y-4">
            {[
              { label: "Notifikasi Email", sub: "Terima update via email", value: notifEmail, set: setNotifEmail },
              { label: "Notifikasi Sistem", sub: "Alert di dalam aplikasi", value: notifSystem, set: setNotifSystem },
              { label: "Laporan Otomatis", sub: "Kirim laporan berkala via email", value: notifReport, set: setNotifReport },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "#F1F5F9" }}>
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium" style={{ color: NAVY }}>{item.label}</p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>{item.sub}</p>
                </div>
                <Toggle value={item.value} onChange={item.set} />
              </div>
            ))}
          </div>
        </Section>

        {/* System */}
        <Section title="Preferensi Sistem" icon={<Settings size={15} style={{ color: NAVY }} />}>
          <div className="space-y-4">
            <Field label="Tema Tampilan">
              <select value={theme} onChange={e => setTheme(e.target.value)} className={inputClass} style={inputStyle}>
                {["Terang", "Gelap", "Otomatis"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Bahasa">
              <select value={language} onChange={e => setLanguage(e.target.value)} className={inputClass} style={inputStyle}>
                {["Indonesia", "English"].map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Default Platform">
              <select className={inputClass} style={inputStyle}>
                {["Semua Platform", "Online", "Twitter/X"].map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-4">
                <p className="text-sm font-medium" style={{ color: NAVY }}>Simpan Otomatis</p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>Simpan progres secara otomatis</p>
              </div>
              <Toggle value={autoSave} onChange={setAutoSave} />
            </div>
          </div>
        </Section>
      </div>

      {/* Save button */}
      <div className="mt-4 md:mt-5 flex justify-end">
        <button
          onClick={handleSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all"
          style={{ backgroundColor: saved ? "#16A34A" : NAVY }}
        >
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? "Perubahan Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>
    </Layout>
  );
}
