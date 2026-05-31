# saldyy-blog

The source for [**A blog by Saldyy**](https://saldyy.com) — Phillip Nguyen's personal blog about full-stack development, cloud, and software engineering.

Built with [Hugo](https://gohugo.io/) and the [Paper](https://github.com/nanxiaobei/hugo-paper) theme, deployed on [Netlify](https://www.netlify.com/).

## Prerequisites

- [Hugo](https://gohugo.io/installation/) (extended) `0.147.1` or newer
- [Git](https://git-scm.com/)

## Getting started

Clone the repository, including the theme which is tracked as a Git submodule:

```bash
git clone --recurse-submodules https://github.com/saldyy/saldyy-blog.git
cd saldyy-blog
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

## Local development

Run the Hugo dev server with drafts enabled:

```bash
hugo server -D
```

The site is served at http://localhost:1313 with live reload.

## Writing a post

Create a new post from the archetype:

```bash
hugo new posts/my-new-post.md
```

Posts live in `content/posts/`. New posts are marked `draft = true`; set it to
`false` (or remove it) to publish. Images go in `static/images/`.

## Building

Generate the static site into `public/`:

```bash
hugo --gc --minify
```

## Project structure

```
archetypes/   Front-matter templates for new content
assets/       Files processed by Hugo Pipes
content/      Markdown content (posts/ and about page)
layouts/      Custom layout overrides
static/       Static assets served as-is (images, icons)
themes/paper/ Paper theme (Git submodule)
hugo.toml     Site configuration
netlify.toml  Netlify build configuration
```

## Deployment

Pushes are deployed automatically by Netlify, which runs:

```bash
git config core.quotepath false && hugo --gc --minify
```
