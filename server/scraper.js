require("dotenv").config();

const Parser = require("rss-parser");
const { GoogleDecoder } = require("google-news-url-decoder");
const pool = require("./db");

const parser = new Parser({
  customFields: {
    item: ["source"]
  }
});

const decoder = new GoogleDecoder();

async function scrapeNews(keyword) {
  try {
    console.log("\n================================");
    console.log("Mencari:", keyword);
    console.log("================================");

    // Cari berita dengan keyword dan maksimal 2 hari terakhir
    const searchQuery = `${keyword} when:2d`;

    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
      searchQuery
    )}&hl=id&gl=ID&ceid=ID:id`;

    const feed = await parser.parseURL(rssUrl);

    console.log("Berita ditemukan:", feed.items.length);

    // Batas 48 jam terakhir
    const batasWaktu = new Date(
      Date.now() - 48 * 60 * 60 * 1000
    );

    let berhasil = 0;
    let terlaluLama = 0;
    let duplikat = 0;
    let gagalDecode = 0;

    for (const item of feed.items) {
      const title = item.title;

      const published_at = item.pubDate
        ? new Date(item.pubDate)
        : null;

      // Tidak ada tanggal
      if (!published_at) {
        terlaluLama++;
        continue;
      }

      // Lebih dari 48 jam
      if (published_at < batasWaktu) {
        terlaluLama++;
        continue;
      }

      const content =
        item.contentSnippet ||
        item.content ||
        item.title;

      const source =
        item.source ||
        "Tidak diketahui";

      // Decode URL Google News
      const result = await decoder.decode(item.link);

      if (!result.status) {
        console.log("Gagal decode:", title);
        gagalDecode++;
        continue;
      }

      const url = result.decoded_url;

      // Cek URL sudah ada
      const cek = await pool.query(
        "SELECT url FROM news WHERE url = $1",
        [url]
      );

      if (cek.rows.length > 0) {
        duplikat++;
        continue;
      }

      // Simpan berita
      await pool.query(
        `INSERT INTO news
        (title, content, source, url, published_at, keyword)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          title,
          content,
          source,
          url,
          published_at,
          keyword
        ]
      );

      console.log("✓ Disimpan:", title);
      berhasil++;
    }

    console.log("\n================================");
    console.log("HASIL SCRAPING");
    console.log("================================");
    console.log("Keyword           :", keyword);
    console.log("Ditemukan         :", feed.items.length);
    console.log("Berita baru       :", berhasil);
    console.log("Sudah ada         :", duplikat);
    console.log("Lebih dari 48 jam :", terlaluLama);
    console.log("Gagal decode      :", gagalDecode);
    console.log("================================");

    return {
      success: true,
      keyword,
      ditemukan: feed.items.length,
      beritaBaru: berhasil,
      duplikat,
      terlaluLama,
      gagalDecode
    };

  } catch (error) {
    console.error("Gagal scraping:", error.message);

    return {
      success: false,
      message: error.message
    };
  }
}

module.exports = scrapeNews;