const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend DINHAS berhasil berjalan!"
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS waktu");

    res.json({
      success: true,
      message: "Database DINHAS berhasil terhubung!",
      waktu: result.rows[0].waktu
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database gagal terhubung!"
    });
  }
});

// LOGIN DINHAS
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT user_id, name, email, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah"
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
    return res.status(401).json({
        success: false,
        message: "Email atau password salah"
    });
    }
    
    res.json({
      success: true,
      message: "Login berhasil",
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server"
    });
  }
});

app.post("/api/search", async (req, res) => {
  const { keyword, dateFrom, dateTo, platform } = req.body;

  console.log("Keyword diterima:", keyword);
  console.log("Tanggal:", dateFrom, "sampai", dateTo);
  console.log("Platform:", platform);

  const results = [
    {
      id: 1,
      judul: `Hasil berita untuk "${keyword}"`,
      sumber: "Demo Source",
      platform: platform === "Semua Platform" ? "Online" : platform,
      tanggal: dateTo,
      relevansi: "Relevan",
      sentimen: "Netral",
      topik: keyword,
      status: "Baru",
      konten: `Ini adalah data dummy hasil pencarian untuk keyword "${keyword}".`,
      url: "https://example.com",
    },
  ];

  res.json({
    success: true,
    keyword,
    dateFrom,
    dateTo,
    platform,
    results,
  });
});

app.listen(PORT, () => {
  console.log(`DINHAS Backend berjalan di http://localhost:${PORT}`);
});