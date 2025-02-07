# JSONEditor-CLI

JSONEditor-CLI is a command-line tool for Node.js that provides an interactive JSON editing experience using [JSONEditor](https://github.com/josdejong/jsoneditor). Whether you need to quickly view or edit JSON files, JSONEditor-CLI makes it simple and efficient.

## Features

- **JSON Editing that runs on command line**: Edit your JSON files directly in your package.json.
- **Multiple Modes**: Supports different editing modes such as `tree`, `code`, `view`, and `text`.
- **Web Interface Option**: Launch a local web interface to edit JSON files in your browser.
- **Validation**: Automatically validates JSON as you edit.
- **Configurable**: Customize settings via command-line options or configuration files.
- **Lightweight & Fast**: Built with Node.js for a quick and responsive experience.

## Installation

Install JSONEditor-CLI globally using npm:

```bash
npm install -g jsoneditor-cli
```

Or add it as a dependency to your project:

```bash
npm install jsoneditor-cli --save-dev
```

## Usage

To use JSONEditor-CLI, run the command followed by the JSON file you wish to edit:

```bash
jsoneditor-cli [options] <file>
```

### Options

- `-m, --mode <mode>`  
  Set the editor mode. Available modes: `tree` (default), `code`, `view`, or `text`.

- `-p, --port <number>`  
  Specify the port for the web interface (default: `3000`).

- `-h, --help`  
  Display help and usage information.

### Examples

**Edit a JSON file in tree mode (default):**

```bash
jsoneditor-cli load data.json
```

**Specify a mode (e.g., code mode):**

```bash
jsoneditor-cli --mode code load data.json
```

**Launch the web interface on a specific port:**

```bash
jsoneditor-cli --port 4000 load data.json
```

Any options provided via the command line will override the configuration file settings.

## Contributing

Contributions are welcome! If you find any issues or have ideas for improvements, please open an issue or submit a pull request on [GitHub](https://github.com/yourusername/jsoneditor-cli).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.txt) file for details.
