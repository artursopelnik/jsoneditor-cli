#!/usr/bin/env node

import { program } from "commander";
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
    .name("jsoneditor-cli")
    .description("The JSONEditor CLI is a common place for utilities.")
    .version("0.0.1")
    .option("-p, --port <port>", "port", "5053")
    .option("-m, --mode <mode>", "mode", "tree");

program
    .command("load")
    .description("Load JSON into JSONEditor")
    .argument("<json>", "path to JSON file")
    .action((json) => {
      if (!json.endsWith(".json")) {
        console.error("Fehler: Die Datei muss eine JSON-Datei sein.");
        process.exit(1);
      }
      const { port, mode } = program.opts();
      loadJson(port, mode, json);
    });

program.parse();

function loadJson(port, mode, json) {
  const jsonPath = path.resolve(__dirname, json);

  if (!fs.existsSync(jsonPath)) {
    console.error(`Fehler: Datei ${jsonPath} existiert nicht.`);
    process.exit(1);
  }

  const app = express();
  app.use(express.json());

  // Statische Dateien für Frontend
  app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

  app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

  app.get("/getMode", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send(mode);
  });

  app.get("/getJSON", (req, res) => {
    fs.readFile(jsonPath, "utf8", (err, data) => {
      if (err) {
        console.error("Fehler beim Lesen der JSON-Datei:", err);
        return res.status(500).json({ error: "Fehler beim Laden der Datei" });
      }
      res.set("Content-Type", "application/json");
      res.send(data);
    });
  });

  app.put("/saveJSON", (req, res) => {
    const updatedJson = req.body;

    fs.writeFile(
        jsonPath,
        JSON.stringify(updatedJson, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Fehler beim Schreiben der Datei:", err);
            return res.status(500).json({ error: "Fehler beim Speichern der Datei" });
          }
          res.json({
            message: "Datei erfolgreich aktualisiert",
            data: updatedJson,
          });
        }
    );
  });

  app.listen(port, () => {
    console.log(`JSONEditor läuft auf: http://localhost:${port}/`);
  });
}
