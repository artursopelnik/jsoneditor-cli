#!/usr/bin/env node

import { program } from "commander"
import express from "express"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

program
  .name("jsoneditor-cli")
  .description("The JSONEditor CLI is a common place for utilities.")
  .version("1.0.0")
  .option("-p, --port <port>", "port", "5053")
  .option("-m, --mode <mode>", "mode", "tree")

program
  .command("load")
  .description("Load JSON into JSONEditor")
  .argument("<json>", "path to JSON file")
  .action((json) => {
    if (!json.endsWith(".json")) {
      console.error("Error: The file must be a JSON file.")
      process.exit(1)
    }
    const { port, mode } = program.opts()
    loadJson(port, mode, json)
  })

program.parse()

function loadJson(port, mode, json) {
  const jsonPath = path.resolve(json)

  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: File ${jsonPath} does not exist.`)
    process.exit(1)
  }

  const app = express()
  app.use(express.json())

  // Static files for frontend
  app.use("/node_modules", express.static(path.join("node_modules")))

  app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")))

  app.get("/getMode", (req, res) => {
    res.set("Content-Type", "text/plain")
    res.send(mode)
  })

  app.get("/getJSON", (req, res) => {
    fs.readFile(jsonPath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading the JSON file:", err)
        return res.status(500).json({ error: "Error loading the file" })
      }
      res.set("Content-Type", "application/json")
      res.send(data)
    })
  })

  app.put("/saveJSON", (req, res) => {
    const updatedJson = req.body

    fs.writeFile(
      jsonPath,
      JSON.stringify(updatedJson, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing the file:", err)
          return res.status(500).json({ error: "Error saving the file" })
        }
        res.json({
          message: "File successfully updated",
          data: updatedJson
        })
      }
    )
  })

  app.listen(port, () => {
    console.log(`JSONEditor is running at: http://localhost:${port}/`)
  })
}
