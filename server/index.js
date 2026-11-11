
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const bcrypt = require("bcryptjs");
const scrapeNews = require("./scraper");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ========================================
// KONFIGURASI GEMINI AI
// ========================================

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

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

// ========================================
// DASHBOARD STATISTIK
// ========================================

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
      await bcrypt.compare(password, user.password);

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
    console.error("LOGIN ERROR:", error);

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
    console.error("NEWS INSERT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Gagal menyimpan news",
      error: error.message
    });
  }
});

// ========================================
// SEARCH + SCRAPING BERITA REAL-TIME
// ========================================

app.post("/api/search", async (req, res) => {
  const { keyword } = req.body;

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
    console.log("Waktu:", new Date().toLocaleString("id-ID"));
    console.log("================================");

    console.log("\nMulai scraping berita...");

    const scraping = await scrapeNews(searchKeyword);

    if (!scraping || !scraping.success) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil berita",
        error: scraping
          ? scraping.message
          : "Scraper tidak mengembalikan hasil"
      });
    }

    console.log("\nMengambil berita dari database...");

    const result = await pool.query(
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

    const results = result.rows.map((news, index) => ({
      id: index + 1,
      judul: news.title,
      sumber: news.source,
      platform: "Google News",
      tanggal: news.published_at,
      relevansi: news.relevance || "Kurang Relevan",
      sentimen: "Belum dianalisis",
      topik: searchKeyword,
      status: "Baru",
      konten: news.content,
      url: news.url
    }));

    const totalRelevan = results.filter(
      news => news.relevansi === "Relevan"
    ).length;

    const totalKurangRelevan = results.filter(
      news => news.relevansi === "Kurang Relevan"
    ).length;

    console.log("\n================================");
    console.log("HASIL PENCARIAN");
    console.log("Keyword:", searchKeyword);
    console.log("Total berita:", results.length);
    console.log("Relevan:", totalRelevan);
    console.log("Kurang relevan:", totalKurangRelevan);
    console.log("================================");

    return res.json({
      success: true,
      keyword: searchKeyword,
      total: results.length,
      totalRelevan,
      totalKurangRelevan,
      waktuPencarian: new Date(),
      results
    });

  } catch (error) {
    console.error("ERROR SEARCH:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mencari berita",
      error: error.message
    });
  }
});

// ========================================
// PERANGKUMAN BERITA MENGGUNAKAN GEMINI AI
// ========================================

app.post("/api/summarize", async (req, res) => {
  try {
    const { articles } = req.body;

    if (!Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Pilih minimal satu berita untuk dirangkum."
      });
    }

    const articleText = articles.map((article, index) => `
Artikel ${index + 1}
Judul: ${article.judul || article.title || ""}
Sumber: ${article.sumber || article.source || ""}
Tanggal: ${article.tanggal || article.published_at || ""}
Isi berita:
${article.konten || article.content || ""}
`).join("\n\n");

    const hasContent = articles.some(article =>
      (article.konten || article.content || "").trim().length > 0
    );

    if (!hasContent) {
      return res.status(400).json({
        success: false,
        message: "Isi artikel tidak tersedia untuk dirangkum."
      });
    }

    const prompt = `
Kamu adalah asisten analisis berita pada sistem DINHAS
(Digital Intelligence News & Analysis System).

Tugasmu adalah merangkum beberapa artikel berita berikut
menjadi satu ringkasan informasi yang objektif dan faktual.

ATURAN:
1. Gunakan hanya informasi dari artikel yang diberikan.
2. Jangan menambahkan fakta atau asumsi sendiri.
3. Gabungkan informasi yang membahas kejadian yang sama.
4. Hindari pengulangan informasi.
5. Gunakan bahasa Indonesia formal dan mudah dipahami.
6. Jika informasi antarartikel berbeda, jangan menyatukannya
   sebagai fakta yang sudah pasti.
7. Buat 2-4 paragraf ringkasan.
8. Buat 3-7 poin informasi utama.
9. Jika isi berita tidak cukup, sampaikan keterbatasannya.

FORMAT OUTPUT WAJIB JSON:
{
  "summary": "Ringkasan informasi dalam beberapa paragraf.",
  "keyPoints": [
    "Informasi utama pertama",
    "Informasi utama kedua",
    "Informasi utama ketiga"
  ]
}

DATA ARTIKEL:
${articleText}
`;

    const startTime = Date.now();

    console.log("=== PROSES PERANGKUMAN DIMULAI ===");
    console.log("Panjang prompt:", prompt.length, "karakter");

    const response = await genAI.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    console.log(
      "Waktu respons Gemini:",
      ((Date.now() - startTime) / 1000).toFixed(2),
      "detik"
    );

    const result = JSON.parse(response.text);

    if (
      typeof result.summary !== "string" ||
      !Array.isArray(result.keyPoints)
    ) {
      throw new Error("Format hasil AI tidak sesuai.");
    }

    console.log(
      "Total waktu perangkuman:",
      ((Date.now() - startTime) / 1000).toFixed(2),
      "detik"
    );

    return res.json({
      success: true,
      message: "Berita berhasil dirangkum menggunakan Gemini AI.",
      data: {
        summary: result.summary,
        keyPoints: result.keyPoints
      }
    });

  } catch (error) {
    console.error("SUMMARIZE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal melakukan perangkuman berita.",
      error: error.message
    });
  }
});

// ========================================
// PEMBENTUKAN INSIGHT MENGGUNAKAN GEMINI AI
// ========================================

app.post("/api/insight", async (req, res) => {
  try {
    const { articles, summary, keyPoints } = req.body;

    if (!Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada berita terpilih untuk dianalisis."
      });
    }

    if (
      !summary ||
      !Array.isArray(keyPoints) ||
      keyPoints.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Data perangkuman belum tersedia."
      });
    }

    const articleText = articles.map((article, index) => `
Artikel ${index + 1}
Judul: ${article.judul || article.title || ""}
Sumber: ${article.sumber || article.source || ""}
Tanggal: ${article.tanggal || article.published_at || ""}
Topik: ${article.topik || ""}
Sentimen: ${article.sentimen || "Belum dianalisis"}
Isi:
${article.konten || article.content || ""}
`).join("\n\n");

    const prompt = `
Kamu adalah asisten analisis berita pada sistem DINHAS
(Digital Intelligence News & Analysis System).

Tugasmu membentuk insight berdasarkan berita
dan hasil perangkuman yang diberikan.

ATURAN:
1. Gunakan hanya informasi dari data yang diberikan.
2. Jangan membuat fakta, angka, tanggal, atau kejadian baru.
3. Jangan membuat kesimpulan yang tidak didukung berita.
4. Gunakan bahasa Indonesia formal dan objektif.
5. Bedakan fakta, indikasi, dan hal yang belum diketahui.
6. Jika informasi tidak cukup, nyatakan keterbatasannya.
7. Jangan menganggap sentimen yang belum dianalisis sebagai sentimen positif, netral, atau negatif.
8. Perkembangan isu harus berdasarkan tanggal dan informasi artikel.
9. Jangan membuat kronologi jika urutan waktunya tidak dapat dipastikan.

HASIL PERANGKUMAN:
${summary}

INFORMASI UTAMA:
${keyPoints.map((point, i) => `${i + 1}. ${point}`).join("\n")}

DATA ARTIKEL:
${articleText}

FORMAT OUTPUT WAJIB JSON:
{
  "keyInsight": "Kesimpulan utama berdasarkan berita.",
  "insights": [
    {
      "judul": "Judul insight",
      "isi": "Penjelasan insight."
    }
  ],
  "developments": [
    {
      "date": "Tanggal",
      "event": "Perkembangan isu."
    }
  ],
  "mainFindings": [
    "Temuan utama."
  ],
  "attentionPoints": [
    "Hal yang perlu diperhatikan."
  ]
}
`;

    const startTime = Date.now();

    console.log("=== PROSES PEMBENTUKAN INSIGHT DIMULAI ===");
    console.log("Jumlah artikel:", articles.length);

    const response = await genAI.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text);

    if (
      typeof result.keyInsight !== "string" ||
      !Array.isArray(result.insights) ||
      !Array.isArray(result.developments) ||
      !Array.isArray(result.mainFindings) ||
      !Array.isArray(result.attentionPoints)
    ) {
      throw new Error("Format hasil Insight AI tidak sesuai.");
    }

    console.log(
      "Waktu pembentukan Insight:",
      ((Date.now() - startTime) / 1000).toFixed(2),
      "detik"
    );

    return res.json({
      success: true,
      message: "Insight berhasil dibentuk menggunakan Gemini AI.",
      data: result
    });

  } catch (error) {
    console.error("INSIGHT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal membentuk Insight.",
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
