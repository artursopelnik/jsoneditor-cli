const { program } = require('commander')
const express = require('express')

program
  .name('jsoneditor-cli')
  .description('The jsoneditor CLI is a common place for utilities.')
  .version('0.0.1')

program.option('-p, --port <number>', 'port', '5053')

program
  .command('load')
  .description('Load json into jsoneditor')
  .argument('<json>', 'path to json')
  .action((json) => {
    if (!json.includes('.json')) {
      return
    }
    const port = program.opts().port
    loadJson(port, json)
  })

program.parse()

function loadJson(port, json) {
  const app = express()

  console.log('load json here')
  console.log(json)

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/`)
  })
}
