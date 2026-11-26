import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import types from './types.json'
import './style.css'

const categories = Object.entries(types)
const modules = import.meta.glob<{ default: ComponentType }>('../projects/*/*/Example.tsx')
const titles = import.meta.glob<string>('../projects/*/*/example.json', { eager: true, import: 'title' })
const projects = Object.entries(modules).map(([file, load]) => {
  const [, , type, slug] = file.split('/')
  const config = types[type as keyof typeof types]
  if (!config) throw new Error('Unregistered project type: ' + type)
  return {
    type, slug, id: type + '/' + slug, framed: config.preview === 'viewport',
    title: titles[file.replace('Example.tsx', 'example.json')] ?? slug,
    View: lazy(load),
  }
}).sort((a, b) => a.title.localeCompare(b.title))

function ProjectCard({ project }: { project: typeof projects[number] }) {
  const url = '?preview=' + project.id
  return <article className={project.framed ? 'project-card framed' : 'project-card'}>
    <div className="gallery-title">
      <h2><a href={'#/' + project.id}>{project.title}</a></h2>
      <div className="project-links">
        {project.framed && <a href={url} target="_blank" rel="noreferrer">Open page ↗</a>}
        <a href={'https://github.com/tamtrann/what-the-frontend/tree/main/projects/' + project.id}>Source ↗</a>
      </div>
    </div>
    {project.framed
      ? <iframe className="page-preview" src={url} title={project.title + ' preview'} loading="lazy" />
      : <Suspense fallback={<p>Loading preview…</p>}><project.View /></Suspense>}
  </article>
}

function Gallery() {
  const [route, setRoute] = useState(() => location.hash.slice(1))
  useEffect(() => {
    const navigate = () => setRoute(location.hash.slice(1))
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])
  const path = route.replace(/^\//, '')
  const category = categories.find(([id]) => id === path)
  // Keep existing links from Shorts and earlier versions of the README working.
  const selected = projects.find(item => item.id === path || item.slug === path && !route.startsWith('/'))
  const activeType = category?.[0] ?? selected?.type
  const visible = !path ? projects : category ? projects.filter(p => p.type === path) : selected ? [selected] : []
  return <main className="gallery">
    <header><a href="#">What the Frontend</a><a href="https://github.com/tamtrann/what-the-frontend">GitHub ↗</a></header>
    <nav className="type-tabs" aria-label="Filter projects by type">
      <a href="#" aria-current={!path ? 'page' : undefined}>All projects</a>
      {categories.map(([id, config]) => <a key={id} href={'#/' + id} aria-current={activeType === id ? 'page' : undefined}>{config.label}</a>)}
    </nav>
    {visible.map(p => <ProjectCard key={p.id} project={p} />)}
    {visible.length === 0 && <p>{category ? 'No projects in this category yet.' : path ? 'Project not found.' : 'No projects have been published yet.'} <a href="#">Browse all projects</a></p>}
  </main>
}

// A separate document gives each page a real viewport, its own scroll position,
// CSS and anchor navigation. Its hashes never change the gallery filter.
const standalone = new URLSearchParams(location.search).get('preview')
const project = projects.find(p => p.id === standalone)
if (project && standalone) document.title = project.title + ' · What the Frontend'
createRoot(document.getElementById('root')!).render(standalone === null ? <Gallery /> :
  project ? <Suspense fallback={<p>Loading page…</p>}><project.View /></Suspense> : <p>Page not found. <a href="./">Browse projects</a></p>)
