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
  .version("1.0.4")
  .option("-p, --port <port>", "port", "5053")
  .option("-m, --mode <mode>", "mode (tree | text | code)", "tree")
  .option(
    "-e, --engine <engine>",
    "engine (jsoneditor | svelte-jsoneditor)",
    "jsoneditor"
  )
    .option("-i, --initialExpand <expandAll>", "expandAll (true | false)", true)

program
  .command("load")
  .description("Load JSON into JSONEditor")
  .argument("<json>", "path to JSON file")
  .action((json) => {
    if (!json.includes(".json")) {
      console.error("Error: The file must be a JSON file.")
      process.exit(1)
    }
    const { port, mode, engine, expand } = program.opts()
    loadJson(port, mode, engine, expand, json)
  })

program.parse()

/**
 * Checks if a dependency is available locally, otherwise returns the global path.
 * @param {string} dep - The dependency name or relative path.
 * @returns {string} - The resolved local or global path.
 */
function getDep(dep) {
  const localPath = path.join(dep)
  return fs.existsSync(localPath) ? path.join(dep) : path.join(__dirname, dep)
}

/**
 * Starts an Express server to serve a JSON editor UI and handle JSON file operations.
 *
 * @param {number} port - The port number on which the server should run.
 * @param {string} mode - The editor mode (e.g., "tree", "text", "code").
 * @param {string} engine - The editor engine ("svelte-jsoneditor" or "jsoneditor").
 * @param {boolean} expand - The editor initial expand (e.g., true or false).
 * @param {string} json - The path to the JSON file to be loaded and modified.
 */
function loadJson(port, mode, engine, expand, json) {
  const jsonPath = path.resolve(json)

  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: File ${jsonPath} does not exist.`)
    process.exit(1)
  }

  const app = express()

  // save static files
  app.use("/jsoneditor", express.static(getDep("node_modules/jsoneditor/dist")))
  app.use(
    "/vanilla-jsoneditor",
    express.static(getDep("node_modules/vanilla-jsoneditor"))
  )

  app.use(express.json())

  app.get("/", (req, res) =>
    res.sendFile(
      path.join(
        __dirname,
        engine === "svelte-jsoneditor"
          ? "svelte-jsoneditor.html"
          : "jsoneditor.html"
      )
    )
  )

  app.get("/getMode", (req, res) => {
    res.set("Content-Type", "text/plain")
    res.send(mode)
  })

  app.get("/getExpand", (req, res) => {
    res.set("Content-Type", "text/plain")
    res.send(expand)
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
