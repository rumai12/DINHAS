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

    const result = await pool.query(
      "SELECT NOW() AS waktu"
    );

    res.json({
      success: true,
      message: "Database DINHAS berhasil terhubung!",
      waktu: result.rows[0].waktu
    });

  } catch (error) {

    console.error("DB TEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database gagal terhubung!",
      error: error.message
    });

  }

});

/* ========================================
   DASHBOARD STATISTIK
======================================== */

app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const query = `
      SELECT
        COUNT(*)::int AS total_berita,

        COUNT(*) FILTER (
          WHERE LOWER(TRIM(COALESCE(relevance, ''))) = 'relevan'
        )::int AS berita_relevan,

        COUNT(DISTINCT NULLIF(TRIM(source), ''))::int
          AS total_sumber,

        COUNT(*) FILTER (
          WHERE published_at >= CURRENT_DATE
            AND published_at < CURRENT_DATE + INTERVAL '1 day'
        )::int AS berita_hari_ini

      FROM news;
    `;

    const result = await pool.query(query);

    return res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil statistik dashboard"
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
      `SELECT user_id, name, email, password
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: "Email atau password salah"
      });

    }

    const user = result.rows[0];

    const passwordMatch =
      await bcrypt.compare(
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

    console.error(
      "LOGIN ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message
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
      (
        title,
        content,
        source,
        url,
        published_at,
        keyword
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
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

      message:
        "Data news berhasil disimpan!",

      data:
        result.rows[0]

    });

  } catch (error) {

    console.error(
      "NEWS INSERT ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Gagal menyimpan news",

      error:
        error.message

    });

  }

});


// ========================================
// SEARCH + SCRAPING BERITA REAL-TIME
// ========================================

app.post("/api/search", async (req, res) => {

  const { keyword } = req.body;


  // ====================================
  // CEK KEYWORD
  // ====================================

  if (
    !keyword ||
    keyword.trim() === ""
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Keyword wajib diisi"

    });

  }


  try {

    const searchKeyword =
      keyword.trim();


    // ====================================
    // LOG PENCARIAN
    // ====================================

    console.log(
      "\n================================"
    );

    console.log(
      "PENCARIAN USER"
    );

    console.log(
      "================================"
    );

    console.log(
      "Keyword:",
      searchKeyword
    );

    console.log(
      "Waktu:",
      new Date().toLocaleString("id-ID")
    );

    console.log(
      "================================"
    );


    // ====================================
    // 1. SCRAPING BERITA TERBARU
    // ====================================

    console.log(
      "\nMulai scraping berita..."
    );


    const scraping =
      await scrapeNews(
        searchKeyword
      );


    // ====================================
    // 2. CEK SCRAPING
    // ====================================

    if (
      !scraping ||
      !scraping.success
    ) {

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengambil berita",

        error:
          scraping
            ? scraping.message
            : "Scraper tidak mengembalikan hasil"

      });

    }


    // ====================================
    // 3. AMBIL BERITA DARI DATABASE
    // ====================================

    console.log(
      "\nMengambil berita dari database..."
    );


    const result =
      await pool.query(

        `SELECT
          title,
          content,
          source,
          url,
          published_at,
          keyword,
          relevance
        FROM news
        WHERE keyword = $1
        AND published_at >= NOW() - INTERVAL '48 hours'
        ORDER BY published_at DESC`,

        [searchKeyword]

      );


    // ====================================
    // 4. FORMAT DATA UNTUK FRONTEND
    // ====================================

    const results =
      result.rows.map(
        (news, index) => {

          return {

            // ID untuk kebutuhan frontend.
            // Bukan ID database.
            id:
              index + 1,

            judul:
              news.title,

            sumber:
              news.source,

            platform:
              "Google News",

            tanggal:
              news.published_at,

            // AMBIL DARI DATABASE
            relevansi:
              news.relevance || "Kurang Relevan",

            sentimen:
              "Belum dianalisis",

            topik:
              searchKeyword,

            status:
              "Baru",

            konten:
              news.content,

            url:
              news.url

          };

        }
      );


    // ====================================
    // 5. HITUNG JUMLAH RELEVANSI
    // ====================================

    const totalRelevan =
      results.filter(
        (news) =>
          news.relevansi === "Relevan"
      ).length;


    const totalKurangRelevan =
      results.filter(
        (news) =>
          news.relevansi === "Kurang Relevan"
      ).length;


    // ====================================
    // 6. LOG HASIL
    // ====================================

    console.log(
      "\n================================"
    );

    console.log(
      "HASIL PENCARIAN"
    );

    console.log(
      "================================"
    );

    console.log(
      "Keyword:",
      searchKeyword
    );

    console.log(
      "Total berita:",
      results.length
    );

    console.log(
      "Relevan:",
      totalRelevan
    );

    console.log(
      "Kurang relevan:",
      totalKurangRelevan
    );

    console.log(
      "================================"
    );


    // ====================================
    // 7. KIRIM KE FRONTEND
    // ====================================

    return res.json({

      success:
        true,

      keyword:
        searchKeyword,

      total:
        results.length,

      totalRelevan,

      totalKurangRelevan,

      waktuPencarian:
        new Date(),

      results

    });


  } catch (error) {

    console.error(
      "\n================================"
    );

    console.error(
      "ERROR SEARCH"
    );

    console.error(
      "================================"
    );

    console.error(error);

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "================================"
    );


    return res.status(500).json({

      success:
        false,

      message:
        "Terjadi kesalahan saat mencari berita",

      error:
        error.message

    });

  }

});


// ========================================
// JALANKAN SERVER
// ========================================

app.listen(
  PORT,
  () => {

    console.log(
      `DINHAS Backend berjalan di http://localhost:${PORT}`
    );

  }
);