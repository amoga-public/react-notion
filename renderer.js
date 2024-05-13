require("dotenv").config(); // This loads the environment variables from the .env file
const puppeteer = require("puppeteer");

async function renderNotionToHTML() {
  const url = process.env.NOTION_PAGE_URL; // Access the URL from the environment variable
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const content = await page.content();
  await browser.close();

  return content;
}

renderNotionToHTML()
  .then((html) => {
    console.log(html); // Outputs the HTML content in the console
    // Optionally, save this HTML to a file
    const fs = require("fs");
    fs.writeFileSync("index.html", html);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
