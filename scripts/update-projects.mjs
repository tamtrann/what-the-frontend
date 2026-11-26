import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const categories = JSON.parse(await readFile('gallery/types.json', 'utf8'))
const gallery = 'https://tamtrann.github.io/what-the-frontend/'
const readme = await readFile('README.md', 'utf8')
const start = '<!-- projects:start -->'
const end = '<!-- projects:end -->'
const from = readme.indexOf(start)
const to = readme.indexOf(end)
if (from < 0 || to < from || from !== readme.lastIndexOf(start) || to !== readme.lastIndexOf(end)) {
  throw new Error('Expected exactly one ordered pair of project list markers in README.md.')
}

function text(value) {
  return value.replace(/\s+/g, ' ').trim().replace(/[\\`*_\[\]<>]/g, '\\$&')
}

const lines = []
for (const [type, category] of Object.entries(categories)) {
  const entries = await readdir(join('projects', type), { withFileTypes: true }).catch(error => {
    if (error.code === 'ENOENT') return []
    throw error
  })
  const projects = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const directory = join('projects', type, entry.name)
    const files = await readdir(directory)
    if (!files.includes('Example.tsx')) continue
    const metadata = files.includes('example.json')
      ? JSON.parse(await readFile(join(directory, 'example.json'), 'utf8')) : {}
    projects.push({ slug: entry.name, title: metadata.title ?? entry.name, description: metadata.description })
  }
  if (!projects.length) continue
  lines.push('### ' + text(category.label), '')
  projects.sort((a, b) => a.title.localeCompare(b.title, 'en') || a.slug.localeCompare(b.slug, 'en'))
  for (const project of projects) {
    const path = [type, project.slug].map(encodeURIComponent).join('/')
    const note = project.description ? ' — ' + text(project.description) : ''
    lines.push('- **' + text(project.title) + '** · [Demo](' + gallery + '#/' + path + ') · [Source](./projects/' + path + ')' + note)
  }
  lines.push('')
}
if (!lines.length) lines.push('No projects have been published yet.', '')
const newline = readme.includes('\r\n') ? '\r\n' : '\n'
const updated = readme.slice(0, from + start.length) + ['', '', ...lines, ''].join(newline) + readme.slice(to)
if (updated !== readme) await writeFile('README.md', updated)
