const Parser = require("rss-parser");
const { GoogleDecoder } = require("google-news-url-decoder");

const parser = new Parser({
  customFields: {
    item: ["source"]
  }
});

async function test() {
  const keyword = "banjir Semarang";

  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
    keyword
  )}&hl=id&gl=ID&ceid=ID:id`;

  const feed = await parser.parseURL(rssUrl);

  const item = feed.items[0];

  console.log("Judul:");
  console.log(item.title);

  console.log("\nPublisher:");
  console.log(item.source);

  console.log("\nURL Google News:");
  console.log(item.link);

  console.log("\nMencoba decode URL asli...");

  const decoder = new GoogleDecoder();

  const result = await decoder.decode(item.link);

  console.log("\nHasil decoder:");
  console.log(result);

  if (result.status) {
    console.log("\nURL PUBLISHER ASLI:");
    console.log(result.decoded_url);
  }
}

test();