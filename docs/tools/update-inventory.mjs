// Run from any directory with Node.js 24. Only generated docs are written.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import {
  navigation,
  sectionId,
} from "../../web/src/lib/information-architecture.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--check")) {
  throw new Error("Usage: node docs/tools/update-inventory.mjs [--check]");
}
const check = args.includes("--check");
const sourceFiles = [
  "content/pages.json",
  "content/page-intents.json",
  "content/physicians.json",
  "content/assets.json",
  "content/case-links.json",
  "content/notices.json",
  "content/official-channels.json",
  "content/reviews.json",
  "content/visuals.json",
  "content/measurement-queries.json",
  "content/measurement-conversations.json",
  "web/package.json",
  "web/src/lib/information-architecture.mjs",
  "content/encyclopedia-categories.json",
  "docs/features/catalog.json",
  "docs/tools/update-inventory.mjs",
];
const source = new Map(
  await Promise.all(
    sourceFiles.map(async (file) => [
      file,
      (await fs.readFile(path.join(root, file), "utf8")).replace(/\r\n/g, "\n"),
    ]),
  ),
);
const json = (file) => JSON.parse(source.get(file));
const pages = json("content/pages.json");
const intents = json("content/page-intents.json");
const catalog = json("docs/features/catalog.json");
const pkg = json("web/package.json");
const visuals = json("content/visuals.json");
const conversations = json("content/measurement-conversations.json");
const sections = new Map(navigation);
const features = new Map(catalog.map((feature) => [feature.id, feature]));

function unique(rows, key, label) {
  if (new Set(rows.map((row) => row[key])).size !== rows.length) {
    throw new Error(`Duplicate ${label}.${key}`);
  }
}
for (const key of ["id", "path"]) {
  unique(pages, key, "page");
  unique(intents, key, "intent");
}
unique(catalog, "id", "feature");
if (intents.length !== pages.length)
  throw new Error("Page and intent counts differ");
const intentsById = new Map(intents.map((intent) => [intent.id, intent]));
for (const feature of catalog) {
  if (!["implemented", "limited", "planned"].includes(feature.status)) {
    throw new Error(`Unknown feature status: ${feature.id}`);
  }
  await fs.access(path.join(root, "docs/features", feature.document));
}

function primaryFeature(page) {
  const explicit = {
    home: "F01",
    sitemap: "F02",
    about: "F05",
    doctors: "F05",
    visit: "F08",
    fees: "F08",
    search: "F09",
    notices: "F10",
    privacy: "F12",
    "copyright-policy": "F12",
    cases: "F12",
    "not-found": "F12",
  };
  if (explicit[page.id]) return explicit[page.id];
  if (page.template === "article-index") return "F03";
  if (page.template === "article-detail") return "F04";
  if (page.template.startsWith("physician-")) return "F05";
  if (/^(?:condition|service)-/.test(page.template)) return "F06";
  if (page.template.startsWith("checkup-")) return "F07";
  if (page.template === "notice-guide") return "F10";
  throw new Error(`Assign a primary feature for ${page.id} (${page.template})`);
}

const rows = pages.map((page) => {
  const intent = intentsById.get(page.id);
  if (!intent || intent.path !== page.path || !intent.patientNeed?.trim()) {
    throw new Error(`Missing or mismatched patient intent: ${page.id}`);
  }
  const section = sectionId(page);
  const feature = primaryFeature(page);
  if (!sections.has(section))
    throw new Error(`Unknown navigation section: ${page.id}`);
  if (!features.has(feature))
    throw new Error(`Unknown primary feature: ${page.id}`);
  return {
    page_id: page.id,
    path: page.path,
    title: page.title,
    language: page.language ?? "ko",
    template: page.template,
    section_id: section,
    section_label: sections.get(section),
    primary_feature: feature,
    indexable: page.indexable,
    patient_need: intent.patientNeed,
  };
});
const count = (values) => {
  const result = {};
  for (const value of [...values].sort())
    result[value] = (result[value] ?? 0) + 1;
  return result;
};
const sourceDigest = createHash("sha256")
  .update(JSON.stringify([...source]))
  .digest("hex");
const inventory = {
  schemaVersion: 1,
  scope:
    "Repository configuration only; not live deployment, approval, indexing or search performance evidence.",
  sourceDigest,
  sourceFiles,
  runtime: {
    node: pkg.engines.node,
    next: pkg.dependencies.next,
    react: pkg.dependencies.react,
    typescriptDeclaredRange: pkg.devDependencies.typescript,
    tailwindcss: pkg.devDependencies.tailwindcss,
  },
  routes: {
    total: pages.length,
    intendedIndexable: pages.filter((page) => page.indexable).length,
    notIndexable: pages
      .filter((page) => !page.indexable)
      .map((page) => page.path),
    patientIntents: intents.length,
    byLanguage: count(rows.map((row) => row.language)),
    byTemplate: count(rows.map((row) => row.template)),
    allRoutesByNavigationSection: count(rows.map((row) => row.section_id)),
  },
  content: {
    physicians: json("content/physicians.json").length,
    registeredAssets: json("content/assets.json").length,
    originalCaseLinks: json("content/case-links.json").length,
    patientNotices: json("content/notices.json").length,
    officialChannels: json("content/official-channels.json").length,
    namedReviewRecords: json("content/reviews.json").length,
    configuredBanners: visuals.banners.length,
    configuredDiagrams: visuals.diagrams.length,
    measurementQuestions: json("content/measurement-queries.json").queries
      .length,
    conversationScenarios: conversations.scenarios.length,
    conversationTurns: conversations.scenarios.reduce(
      (n, item) => n + item.turns.length,
      0,
    ),
  },
  features: catalog.map((feature) => ({
    ...feature,
    primaryRouteCount: rows.filter((row) => row.primary_feature === feature.id)
      .length,
  })),
};
const fields = Object.keys(rows[0]);
const csv = (value) => `"${String(value).replaceAll('"', '""')}"`;
const outputs = new Map([
  [
    "docs/architecture/inventory.json",
    JSON.stringify(inventory, null, 2) + "\n",
  ],
  [
    "docs/product/route-catalog.csv",
    [fields, ...rows.map((row) => fields.map((field) => row[field]))]
      .map((row) => row.map(csv).join(","))
      .join("\n") + "\n",
  ],
]);
let stale = false;
for (const [file, expected] of outputs) {
  const destination = path.join(root, file);
  if (check) {
    let actual;
    try {
      actual = await fs.readFile(destination, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    if (actual !== expected) {
      console.error(`Stale or missing generated document: ${file}`);
      stale = true;
    }
  } else {
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, expected);
  }
}
if (stale) process.exitCode = 1;
else
  console.log(
    `${check ? "Checked" : "Updated"} docs: ${pages.length} routes, ${catalog.length} features.`,
  );
