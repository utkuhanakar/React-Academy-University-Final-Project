import fs from 'node:fs'

const hooksPath = new URL('../src/data/hooks.ts', import.meta.url)
const mdPath = new URL('../fixtures/hooks-use-effect-content.md', import.meta.url)

const md = fs.readFileSync(mdPath, 'utf8').trim()

let hooks = fs.readFileSync(hooksPath, 'utf8')
const needle = "id: 'hooks-use-effect'"
const i = hooks.indexOf(needle)
if (i < 0) throw new Error('hooks-use-effect not found')
const j = hooks.indexOf('content:', i)
if (j < 0) throw new Error('content field not found')
const k = hooks.indexOf('\n    codeExamples:', j)
if (k < 0) throw new Error('codeExamples not found after content')

const before = hooks.slice(0, j)
const after = hooks.slice(k)
const insertion = `content: ${JSON.stringify(md)},`

hooks = `${before}${insertion}${after}`

fs.writeFileSync(hooksPath, hooks, 'utf8')
