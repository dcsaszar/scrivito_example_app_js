/* eslint no-console: "off" */
import "scrivito";
import filesize from "filesize";
import "./Objs";
import "./Widgets";
import { configure } from "./config";
import prerenderObjs from "./prerenderContent/prerenderObjs";
import prerenderSitemap from "./prerenderContent/prerenderSitemap";

configure({ priority: "background" });

const PRERENDER_OBJ_CLASSES_BLACKLIST = [
  "Download",
  "Image",
  "Redirect",
  "Video",
];

const SITEMAP_OBJ_CLASSES_WHITELIST = [
  "Author",
  "Blog",
  "BlogPost",
  "Event",
  "Homepage",
  "Job",
  "LandingPage",
  "Page",
];

async function prerenderContent() {
  await prerenderSitemap(SITEMAP_OBJ_CLASSES_WHITELIST, window.storeResult);
  const pageTemplate = await (await fetch("_page_template.html")).text();
  await prerenderObjs(
    pageTemplate,
    PRERENDER_OBJ_CLASSES_BLACKLIST,
    window.storeResult,
    window.reportError
  );
}

// The following method will be overwritten by puppeteer in storePrerenderedContent.
// It is only here, to simplify debugging in the browser
window.storeResult = async ({ filename, content }) => {
  console.log(
    `[storeResult] received "${filename}" (file size: ${filesize(
      content.length
    )})`
  );
};

// The following method will be overwritten by puppeteer in storePrerenderedContent.
// It is only here, to simplify debugging in the browser
window.reportError = (message, ...args) => {
  console.log(`[reportError] ${message}`, ...args);
};

// Usage: window.prerenderContent().then(results => ...);
window.prerenderContent = prerenderContent;
