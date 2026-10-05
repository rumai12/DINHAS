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


// ==================================================
// NORMALISASI TEKS
// ==================================================

function normalisasi(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


// ==================================================
// CEK RELEVANSI
// ==================================================

function cekRelevansi(title, content, keyword) {

  const judul = normalisasi(title);
  const isi = normalisasi(content);

  const teks = `${judul} ${isi}`;

  const keywordNormal = normalisasi(keyword);

  const kataKeyword = keywordNormal
    .split(" ")
    .filter((kata) => kata.length > 2);


  // keyword kosong
  if (kataKeyword.length === 0) {
    return false;
  }


  // ==================================================
  // 1. FRASA UTUH DI JUDUL
  // ==================================================

  if (judul.includes(keywordNormal)) {
    return true;
  }


  // ==================================================
  // 2. HITUNG KECocokan KATA
  // ==================================================

  let cocok = 0;

  for (const kata of kataKeyword) {

    if (teks.includes(kata)) {
      cocok++;
    }

  }


  // ==================================================
  // 3. HITUNG SKOR
  // ==================================================

  const skor =
    cocok / kataKeyword.length;


  // 60% atau lebih dianggap relevan
  return skor >= 0.6;
}


// ==================================================
// AMBIL BERITA DARI GOOGLE NEWS
// ==================================================

async function ambilBerita(keyword, jam) {

  const searchQuery =
    `${keyword} when:${jam}h`;

  const rssUrl =
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      searchQuery
    )}&hl=id&gl=ID&ceid=ID:id`;


  console.log(
    `\nMencari berita ${jam} jam terakhir...`
  );


  const feed =
    await parser.parseURL(rssUrl);


  return feed.items || [];
}


// ==================================================
// SCRAPING BERITA
// ==================================================

async function scrapeNews(keyword) {

  try {

    console.log("\n================================");
    console.log("MENCARI BERITA");
    console.log("================================");

    console.log(
      "Keyword:",
      keyword
    );

    console.log(
      "Waktu pencarian:",
      new Date().toLocaleString("id-ID")
    );


    // ==================================================
    // 1. CARI 24 JAM
    // ==================================================

    let items =
      await ambilBerita(
        keyword,
        24
      );


    console.log(
      "Hasil 24 jam:",
      items.length
    );


    // ==================================================
    // 2. KALAU KURANG DARI 5
    //    PERLUAS KE 48 JAM
    // ==================================================

    if (items.length < 5) {

      console.log(
        "Berita kurang dari 5."
      );

      console.log(
        "Memperluas pencarian menjadi 48 jam..."
      );


      items =
        await ambilBerita(
          keyword,
          48
        );


      console.log(
        "Hasil 48 jam:",
        items.length
      );

    }


    // ==================================================
    // 3. BATAS 48 JAM
    // ==================================================

    const batasWaktu =
      new Date(
        Date.now() -
        48 * 60 * 60 * 1000
      );


    // ==================================================
    // COUNTER
    // ==================================================

    let berhasil = 0;

    let relevanCount = 0;

    let kurangRelevanCount = 0;

    let terlaluLama = 0;

    let duplikat = 0;

    let gagalDecode = 0;

    let tanpaUrl = 0;


    const hasilBerita = [];


    // ==================================================
    // 4. PROSES SEMUA BERITA
    // ==================================================

    for (const item of items) {

      const title =
        item.title || "";


      // ==================================================
      // TANGGAL
      // ==================================================

      const published_at =
        item.pubDate
          ? new Date(item.pubDate)
          : null;


      if (
        !published_at ||
        isNaN(published_at.getTime())
      ) {

        terlaluLama++;

        continue;

      }


      // ==================================================
      // BATAS 48 JAM
      // ==================================================

      if (
        published_at < batasWaktu
      ) {

        terlaluLama++;

        continue;

      }


      // ==================================================
      // ISI
      // ==================================================

      const content =
        item.contentSnippet ||
        item.content ||
        item.title ||
        "";


      // ==================================================
      // SUMBER
      // ==================================================

      const source =
        item.source ||
        "Tidak diketahui";


      // ==================================================
      // KLASIFIKASI RELEVANSI
      // ==================================================

      const relevan =
        cekRelevansi(
          title,
          content,
          keyword
        );


      const relevance =
        relevan
          ? "Relevan"
          : "Kurang Relevan";


      if (relevan) {

        relevanCount++;

        console.log(
          "✓ Relevan:",
          title
        );

      } else {

        kurangRelevanCount++;

        console.log(
          "• Kurang relevan:",
          title
        );

      }


      // ==================================================
      // CEK URL
      // ==================================================

      if (!item.link) {

        console.log(
          "✗ Tidak ada URL:",
          title
        );

        tanpaUrl++;

        continue;

      }


      // ==================================================
      // DECODE URL
      // ==================================================

      let url;


      try {

        const result =
          await decoder.decode(
            item.link
          );


        if (
          !result.status ||
          !result.decoded_url
        ) {

          console.log(
            "Gagal decode:",
            title
          );

          gagalDecode++;

          continue;

        }


        url =
          result.decoded_url;


      } catch (error) {

        console.log(
          "Gagal decode URL:",
          title
        );

        gagalDecode++;

        continue;

      }


      // ==================================================
      // CEK DUPLIKAT
      // ==================================================

      const cek =
        await pool.query(
          "SELECT url FROM news WHERE url = $1",
          [url]
        );


      if (cek.rows.length > 0) {

        console.log(
          "↻ Sudah ada:",
          title
        );


        // update relevansi kalau
        // klasifikasinya berubah
        await pool.query(
          `
          UPDATE news
          SET relevance = $1
          WHERE url = $2
          `,
          [
            relevance,
            url
          ]
        );


        duplikat++;

        continue;

      }


      // ==================================================
      // SIMPAN SEMUA BERITA
      // ==================================================

      await pool.query(
        `
        INSERT INTO news
        (
          title,
          content,
          source,
          url,
          published_at,
          keyword,
          relevance
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7
        )
        `,
        [
          title,
          content,
          source,
          url,
          published_at,
          keyword,
          relevance
        ]
      );


      console.log(
        "✓ Disimpan:",
        relevance,
        "-",
        title
      );


      berhasil++;


      // ==================================================
      // SIMPAN HASIL
      // ==================================================

      hasilBerita.push({

        title,

        content,

        source,

        url,

        published_at,

        keyword,

        relevance

      });

    }


    // ==================================================
    // HASIL SCRAPING
    // ==================================================

    console.log(
      "\n================================"
    );

    console.log(
      "HASIL SCRAPING"
    );

    console.log(
      "================================"
    );

    console.log(
      "Keyword           :",
      keyword
    );

    console.log(
      "Ditemukan         :",
      items.length
    );

    console.log(
      "Berita baru       :",
      berhasil
    );

    console.log(
      "Relevan           :",
      relevanCount
    );

    console.log(
      "Kurang relevan    :",
      kurangRelevanCount
    );

    console.log(
      "Sudah ada         :",
      duplikat
    );

    console.log(
      "Lebih dari 48 jam :",
      terlaluLama
    );

    console.log(
      "Tanpa URL         :",
      tanpaUrl
    );

    console.log(
      "Gagal decode      :",
      gagalDecode
    );

    console.log(
      "================================"
    );


    // ==================================================
    // RETURN
    // ==================================================

    return {

      success: true,

      keyword,

      ditemukan:
        items.length,

      beritaBaru:
        berhasil,

      relevan:
        relevanCount,

      kurangRelevan:
        kurangRelevanCount,

      duplikat,

      terlaluLama,

      tanpaUrl,

      gagalDecode,

      results:
        hasilBerita

    };


  } catch (error) {

    console.error(
      "Gagal scraping:",
      error
    );


    return {

      success: false,

      message:
        error.message,

      results: []

    };

  }

}


// ==================================================
// EXPORT
// ==================================================

module.exports = scrapeNews;