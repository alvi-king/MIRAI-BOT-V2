// ================== REQUIRE MODULES ==================
let fsExtra, axios, extract, exec;

try {
  fsExtra = require("fs-extra");
  axios = require("axios");
  extract = require("extract-zip");
  exec = require("child_process").exec;
} catch (err) {
  console.error(
    "[ERROR] Required packages are missing.\n" +
    "Run this command:\n" +
    "npm install fs-extra axios extract-zip"
  );
  process.exit(1);
}

const {
  existsSync,
  writeFileSync,
  removeSync,
  mkdirSync,
  copySync,
  readdirSync,
  createWriteStream
} = fsExtra;

// ================== LOAD CONFIG ==================
let config;

try {
  config = require("./config.json");
  console.log("[✓] Config file loaded successfully.");
} catch (err) {
  console.error("[ERROR] Config file not found!");
  process.exit(1);
}

// ================== MAIN PROCESS ==================
(async () => {
  try {
    console.log("\n===== DO NOT CLOSE THIS TERMINAL UNTIL UPDATE COMPLETES =====\n");

    await backup(config);
    await downloadUpdate();
    await cleanOldFiles();
    await extractUpdate();
    await installUpdate();
    await installModules();
    await finalize(config);

  } catch (err) {
    console.error("[FATAL ERROR]", err);
  }
})();

// ================== FUNCTIONS ==================

async function backup(config) {
  console.log("[1/7] Removing old backup...");
  removeSync("./tmp");

  console.log("[2/7] Creating backup...");
  mkdirSync("./tmp");
  mkdirSync("./tmp/main");

  if (existsSync("./modules")) copySync("./modules", "./tmp/modules");

  if (existsSync(`./${config.APPSTATEPATH}`)) {
    copySync(`./${config.APPSTATEPATH}`, `./tmp/${config.APPSTATEPATH}`);
  }

  if (existsSync("./config.json")) {
    copySync("./config.json", "./tmp/config.json");
  }

  if (existsSync(`./includes/${config.DATABASE.sqlite.storage}`)) {
    copySync(
      `./includes/${config.DATABASE.sqlite.storage}`,
      `./tmp/${config.DATABASE.sqlite.storage}`
    );
  }
}

// ------------------

async function downloadUpdate() {
  console.log("[3/7] Downloading latest update...");

  const response = await axios({
    method: "GET",
    url: "https://github.com/miraiPr0ject/miraiv2/archive/refs/heads/main.zip",
    responseType: "stream"
  });

  const writer = createWriteStream("./tmp/main.zip");
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", (err) => reject("[ERROR] Download failed: " + err));
  });
}

// ------------------

async function cleanOldFiles() {
  console.log("[4/7] Cleaning old files...");

  readdirSync(".").forEach(file => {
    if (file !== "tmp") removeSync(file);
  });
}

// ------------------

async function extractUpdate() {
  console.log("[5/7] Extracting update...");

  try {
    await extract("./tmp/main.zip", {
      dir: process.cwd() + "/tmp/main"
    });
  } catch (err) {
    throw new Error("Extraction failed: " + err);
  }
}

// ------------------

async function installUpdate() {
  console.log("[6/7] Installing update...");

  copySync("./tmp/main/miraiv2-main/", "./");
}

// ------------------

function installModules() {
  console.log("[7/7] Installing dependencies...");

  return new Promise((resolve) => {
    const child = exec("npm install");

    child.stdout.on("data", data => console.log(data));

    child.stderr.on("data", data => {
      if (data.toLowerCase().includes("error")) {
        console.error("[ERROR] Module installation failed.");
        writeFileSync("updateError.log", data);
        console.log("[!] Error saved to updateError.log");
        resolve();
      }
    });

    child.on("close", resolve);
  });
}

// ------------------

async function finalize(config) {
  console.log("[FINAL] Restoring important data...");

  if (existsSync(`./tmp/${config.APPSTATEPATH}`)) {
    copySync(`./tmp/${config.APPSTATEPATH}`, `./${config.APPSTATEPATH}`);
  }

  if (existsSync(`./tmp/${config.DATABASE.sqlite.storage}`)) {
    copySync(
      `./tmp/${config.DATABASE.sqlite.storage}`,
      `./includes/${config.DATABASE.sqlite.storage}`
    );
  }

  console.log("\n===== UPDATE COMPLETED SUCCESSFULLY =====");
  console.log('All important data has been backed up in the "tmp" folder.');

  process.exit(0);
}
