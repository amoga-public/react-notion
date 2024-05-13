const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const baseURL = process.env.NOTION_PAGE_URL;
const visited = new Set();
const buildDirectory = "build";

if (!fs.existsSync(buildDirectory)) {
  fs.mkdirSync(buildDirectory);
}

async function scrapePage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(url, { waitUntil: "networkidle2" });

  const pageContent = await page.content();
  const filename = url.split("/").pop() + ".html";
  const filePath = path.join(buildDirectory, filename);
  fs.writeFileSync(filePath, pageContent);

  // Extract links on the page
  const links = await page.$$eval("a", (anchors) =>
    anchors.map((anchor) => anchor.href)
  );

  await browser.close();

  return links;
}

async function crawl(url) {
  if (visited.has(url) || !url.startsWith(baseURL)) {
    return;
  }

  visited.add(url);
  const links = await scrapePage(url);

  for (let link of links) {
    await crawl(link);
  }
}

crawl(baseURL)
  .then(() => {
    console.log("Crawling complete.");
  })
  .catch((err) => {
    console.error("Crawling failed:", err);
  });
