import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PencarianKeyword from "./pages/PencarianKeyword";
import MonitoringBerita from "./pages/MonitoringBerita";
import AnalisisInformasi from "./pages/AnalisisInformasi";
import Perangkuman from "./pages/Perangkuman";
import Insight from "./pages/Insight";
import Laporan from "./pages/Laporan";
import LaporanPreview from "./pages/LaporanPreview";
import LaporanHistory from "./pages/LaporanHistory";
import Pengaturan from "./pages/Pengaturan";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pencarian" element={<PencarianKeyword />} />
        <Route path="/monitoring" element={<MonitoringBerita />} />
        <Route path="/analisis" element={<AnalisisInformasi />} />
        <Route path="/perangkuman" element={<Perangkuman />} />
        <Route path="/insight" element={<Insight />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/laporan/preview" element={<LaporanPreview />} />
        <Route path="/laporan/history" element={<LaporanHistory />} />
        <Route path="/pengaturan" element={<Pengaturan />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
