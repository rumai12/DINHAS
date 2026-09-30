const express = require("express");
const cors = require("cors");
require("dotenv").config();

// CEK .ENV
console.log("USER:", process.env.DB_USER);
console.log("HOST:", process.env.DB_HOST);
console.log("NAME:", process.env.DB_NAME);
console.log("PORT:", process.env.DB_PORT);
console.log("PASSWORD ADA:", typeof process.env.DB_PASSWORD);

const pool = require("./db");
const bcrypt = require("bcryptjs");
const scrapeNews = require("./scraper");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// ========================================
// HALAMAN UTAMA
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "Backend DINHAS berhasil berjalan!"
  });
});


// ========================================
// TEST DATABASE
// ========================================

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


// ========================================
// LOGIN DINHAS
// ========================================

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

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

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


// ========================================
// TEST SIMPAN NEWS
// ========================================

app.post("/api/news", async (req, res) => {

  const {
    title,
    content,
    source,
    url,
    published_at,
    keyword
  } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO news
      (title, content, source, url, published_at, keyword)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        title,
        content,
        source,
        url,
        published_at,
        keyword
      ]
    );

    res.json({

      success: true,

      message: "Data news berhasil disimpan!",

      data: result.rows[0]

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Gagal menyimpan news",

      error: error.message

    });

  }

});


// ========================================
// SEARCH + SCRAPING BERITA
// ========================================

app.post("/api/search", async (req, res) => {

  const { keyword } = req.body;

  // Cek keyword
  if (!keyword || keyword.trim() === "") {

    return res.status(400).json({

      success: false,

      message: "Keyword wajib diisi"

    });

  }

  try {

    const searchKeyword = keyword.trim();

    console.log("\n================================");
    console.log("PENCARIAN USER");
    console.log("Keyword:", searchKeyword);
    console.log("================================");


    // ====================================
    // 1. SCRAPING BERITA TERBARU
    // ====================================

    const scraping = await scrapeNews(searchKeyword);


    // Kalau scraping gagal
    if (!scraping.success) {

      return res.status(500).json({

        success: false,

        message: "Gagal mengambil berita",

        error: scraping.message

      });

    }


    // ====================================
    // 2. AMBIL BERITA DARI DATABASE
    // ====================================

    const result = await pool.query(

      `SELECT
        title,
        content,
        source,
        url,
        published_at,
        keyword
      FROM news
      WHERE keyword = $1
      AND published_at >= NOW() - INTERVAL '48 hours'
      ORDER BY published_at DESC`,

      [searchKeyword]

    );


    // ====================================
    // 3. KIRIM HASIL KE FRONTEND
    // ====================================

    res.json({

      success: true,

      keyword: searchKeyword,

      total: result.rows.length,

      results: result.rows

    });


  } catch (error) {

    console.error("Error search:", error);

    res.status(500).json({

      success: false,

      message: "Terjadi kesalahan saat mencari berita",

      error: error.message

    });

  }

});


// ========================================
// JALANKAN SERVER
// ========================================

app.listen(PORT, () => {

  console.log(
    `DINHAS Backend berjalan di http://localhost:${PORT}`
  );

});