# Redesign handoff — Jekyll integration

Cyan deep-sea redesign for the home + all pages. These files mirror your repo
structure 1:1 — copy each into the same path. Then `bundle exec jekyll serve`
and check every page.

## Copy INTO the repo (overwrite)
- `_includes/header.html`, `_includes/footer.html`
- `_layouts/base.html`, `home.html`, `about.html`, `research.html`, `expeditions.html`
- `_layouts/blog.html`  ← NEW (blog index layout)
- `_layouts/post.html`  ← restyled single-article page (cyan, new reading column)
- `_pages/home.md`, `about.md`, `research.md`, `expeditions.md`, `blog.md`
  (front-matter only — page copy now lives in the layouts)
- `assets/css/main.css`  ← shared design system (replaces old main.css)
- `assets/css/home.css`  ← new home hero styles (replaces old home.css)
- `assets/css/post.css`  ← NEW single-article styles (replaces old blog.css for posts)
- `assets/js/plume2.js`  ← NEW background engine
- `assets/js/expeditions.js`  ← replaces old (dark world map + logo popups + cards)
- `assets/img/profile-600.png`  ← NEW 600×600 optimized avatar (the 6.7 MB
  profile.jpg was too heavy; home references this one)

## Keep AS-IS
- `_data/papers.yml` — Research pulls from it (already wired in research.html)
- `_data/expeditions.json` — already holds the 3 real expeditions (SO301, M210,
  GREAT). The map + Past/Upcoming lists render from it. To add/edit an
  expedition, just edit this file (fields: name, year, region, ship,
  description, coords:[lat,lon], logo, status:"past"|"future").
- `assets/icons/LogoSO301.png`, `M210.png`, `GREAT.png` — already present.
- `_posts/` — the blog index now lists real posts.

## Safe to DELETE (no longer referenced)
- `assets/js/dna_bg.js`, `assets/js/typing.js`, `assets/js/ventCanvas.js`
- `assets/css/about.css`, `research.css`, `expeditions.css`, `blog.css`
  (all merged into main.css / post.css)

## Still on the old style (out of scope of this pass)
- (nothing — the single-post page is now restyled too)

## How it works
- `base.html` builds the page chrome (background canvas, nav, footer) and reads
  per-page front matter: `plume_mode` (full|calm|subtle), `plume_intensity`,
  `scrim` (""=home left-gradient, hero, calm), `main_class` (page|page-body),
  `screen_label`, and `leaflet:true` (loads Leaflet + expeditions.js).
- `plume2.js` defaults to the cyan palette, so pages only pass mode/intensity.
- Entrance animation is robust: content is visible by default; it only
  hides-then-animates when the tab is actually visible (`<html class="anim">`),
  so nothing is ever stuck invisible.

## Verify after `jekyll serve`
1. Every nav link resolves; active link underlined.
2. Home: avatar + name + roles + "Enter the plume" all visible; cyan plume.
3. Research: both papers render from papers.yml.
4. Expeditions: dark world map, 3 cyan markers (GREAT = hollow ring), popups
   show logo + details on click, no connecting line; Past/Upcoming lists filled.
5. Blog: real posts listed.
6. No console errors; check mobile width.

## Git
```bash
git checkout main && git pull
git checkout -b redesign-home
# copy the files above into place, delete the retired ones
git add -A
git commit -m "Redesign: cyan deep-sea theme, fluid plume, real expeditions map"
git push -u origin redesign-home
# open a Pull Request to main on GitHub
```
