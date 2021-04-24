import * as dotenv from "dotenv";
import fse from "fs-extra";
import path from "path";
import prerenderObjs from "./prerenderContent/prerenderObjs";
import prerenderSitemap from "./prerenderContent/prerenderSitemap";
import "./Objs";
import "./Widgets";
import { storeResult } from "../prerender/storeResult";
import { extendRedirects } from "../prerender/extendRedirects";
import { configure } from "./config";

dotenv.config();
configure({ priority: "background", adoptUi: false });

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

const SOURCE_DIR = "build";
const TARGET_DIR = "buildNodePrerendered";

prerenderContent();

async function prerenderContent() {
  console.log(`Removing ${TARGET_DIR}/`);
  await fse.remove(TARGET_DIR);

  console.log(`Copying ${SOURCE_DIR}/ to ${TARGET_DIR}/`);
  await fse.copy(SOURCE_DIR, TARGET_DIR);

  const assetManifest = await fse.readJson(
    path.join(SOURCE_DIR, "asset-manifest.json")
  );
  const filesToBeRemoved = [
    "asset-manifest.json",
    "_prerender_content.html",
    "_page_template.html",
  ];
  filesToBeRemoved.push(assetManifest["prerender_content.css"]);
  const prerenderContentJsPath = assetManifest["prerender_content.js"];
  filesToBeRemoved.push(
    prerenderContentJsPath,
    `${prerenderContentJsPath}.LICENSE.txt`
  );

  await Promise.all(
    filesToBeRemoved.map(async (filename) => {
      console.log(`✨ Removing now obsolete file ${filename}...`);
      await fse.remove(path.join(TARGET_DIR, filename));
    })
  );

  const pageTemplate = (
    await fse.readFile(path.join(SOURCE_DIR, "_page_template.html"))
  ).toString();

  const storedFiles = [];
  const storeFile = (file) => storeResult(TARGET_DIR, storedFiles, file);

  await prerenderSitemap(SITEMAP_OBJ_CLASSES_WHITELIST, storeFile);
  // const assetManifest = await fse.readJson(
  //   path.join(SOURCE_DIR, "asset-manifest.json")
  // );
  await prerenderObjs(
    pageTemplate,
    PRERENDER_OBJ_CLASSES_BLACKLIST,
    storeFile,
    (...args) => console.log(`[Error]`, ...args)
  );
  await extendRedirects(TARGET_DIR, storedFiles, SOURCE_DIR);

  console.log(`📦 Added ${storedFiles.length} files to folder ${TARGET_DIR}!`);
}
