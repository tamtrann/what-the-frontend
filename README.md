# What the Frontend

I’m a frontend lead who vibe-codes web experiments and shares them in Shorts. This is where you can try what you saw and explore the React code behind it.

- **[Snippets](https://tamtrann.github.io/what-the-frontend/#/snippets)** — Try individual interactions and reuse the components in your own projects.
- **[Landing pages](https://tamtrann.github.io/what-the-frontend/#/landing-pages)** — Scroll through complete pages or open them in their own window.

## Run the experiments

Use Node.js 22.12 or newer.

```sh
git clone https://github.com/tamtrann/what-the-frontend.git
cd what-the-frontend
npm ci
npm run dev
```

Open the local address printed by Vite. Select an experiment from the gallery. To test the production build, run `npm run build` followed by `npm run preview`.

## Projects

<!-- projects:start -->

No projects have been published yet.

<!-- projects:end -->

Browse [all projects](https://tamtrann.github.io/what-the-frontend/), [snippets](https://tamtrann.github.io/what-the-frontend/#/snippets), or [landing pages](https://tamtrann.github.io/what-the-frontend/#/landing-pages). To share one project, click its title and copy the URL.

## Add a project or type

Place each experiment in `projects/<type>/<slug>/`. Export its runnable React example as the default export of `Example.tsx` and set an English `title` in `example.json`. Keep its styles and assets alongside the example. The gallery discovers these files at build time.

After a successful deployment from `main`, GitHub Actions refreshes the project list above. The folder determines the category. To add a short note next to the links, set an optional `description` in `example.json`.

Register additional types in [gallery/types.json](./gallery/types.json) with a display label and a preview mode. Use `inline` for natural-height content and `viewport` for an independently scrollable page. Viewport examples run in their own document and can use sticky headers, viewport units and in-page anchors. You can open one directly with `?preview=<type>/<slug>`.
