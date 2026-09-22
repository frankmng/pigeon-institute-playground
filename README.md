# The Pigeon Institute Playground

A deliberately serious, fully static publishing playground built with Astro, Sveltia CMS, GitHub, and Cloudflare Workers Static Assets.

## The Mental Model

- **Sveltia** = the editor Dan uses at `/admin/`
- **GitHub** = the filing cabinet that stores every article and image
- **Astro** = the website builder that turns those files into pages
- **Cloudflare** = the publisher and web server that rebuilds after every GitHub change

## Publishing Flow

Editor → Sveltia → GitHub commit → Cloudflare Workers Build → Astro site goes live

After the one-time account setup, an editor never needs to open GitHub, Cloudflare, Git, Markdown, or a terminal.

## Important URLs

These become final after the account connection steps are complete.

- Public website: `https://pigeon-institute-playground.<cloudflare-subdomain>.workers.dev/`
- CMS: `https://pigeon-institute-playground.<cloudflare-subdomain>.workers.dev/admin/`
- GitHub repository: `https://github.com/frankmng/pigeon-institute-playground`
- Cloudflare Worker: `pigeon-institute-playground`
- Sveltia OAuth Worker: `https://pigeon-institute-auth.<cloudflare-subdomain>.workers.dev/`

## Normal Editor Workflow

1. Open `/admin/` and choose **Sign in with GitHub**.
2. Open **Updates**, then choose **New Update**.
3. Add a title, date, category, summary, hero photo, and article content.
4. Preview the update.
5. Choose **Publish**.

Sveltia commits the post and optimized image to `main`. Cloudflare sees the commit, runs the Astro build, and publishes the result automatically.

Uploaded photos are converted in the browser to WebP, limited to 2400 × 2400 pixels, stripped of EXIF metadata, and capped at 12 MB before processing. They live in `public/uploads/`. R2 is a sensible future migration if the media library becomes large, but it is intentionally not part of this playground.

## Project Map

```text
src/pages/              public routes
src/components/         shared site pieces
src/layouts/            page shell and metadata
src/content/updates/    CMS-managed Markdown updates
public/uploads/         CMS-managed images
src/pages/admin.astro    Sveltia CMS entry page
public/admin/            Sveltia CMS configuration
wrangler.jsonc          Cloudflare static-assets Worker
```

## Developer Workflow

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
npm run build
npm run preview
```

Local site: `http://localhost:4321/`  
Local CMS: `http://localhost:4321/admin/`

In the local CMS, choose **Work with Local Repository** and grant access to this project folder. Production uses GitHub OAuth only.

## One-Time Production Setup

### 1. GitHub

Authenticate GitHub CLI, then create and push the repository:

```bash
gh auth login -h github.com -w
gh repo create pigeon-institute-playground --public --source=. --remote=origin --push
```

If the selected GitHub owner is not `frankmng`, update `backend.repo` in `public/admin/config.yml` first.

### 2. Website Worker and automatic builds

1. In Cloudflare, open **Workers & Pages → Create → Import a repository**.
2. Select `pigeon-institute-playground` and name the Worker `pigeon-institute-playground`.
3. Production branch: `main`.
4. Build command: `npm run build`.
5. Deploy command: `npx wrangler deploy`.
6. Save and deploy. Under **Settings → Builds**, confirm the Git repository is connected.

Cloudflare Workers Builds then deploys every push to `main`, including commits made by Sveltia.

### 3. GitHub OAuth for Sveltia

Deploy the official [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) as a separate Worker named `pigeon-institute-auth`.

In GitHub, create an OAuth App with:

- Homepage URL: the deployed public website URL
- Authorization callback URL: `https://pigeon-institute-auth.<cloudflare-subdomain>.workers.dev/callback`

In the authenticator Worker, configure:

- `GITHUB_CLIENT_ID` as a normal environment variable
- `GITHUB_CLIENT_SECRET` as an encrypted secret — never commit or paste it into this project
- `ALLOWED_DOMAINS` as the website hostname only, without `https://`

Finally, replace the placeholder `backend.base_url`, `site_url`, and `display_url` in `public/admin/config.yml` and the placeholder `site` in `astro.config.mjs`, then push. OAuth-only login is already enforced with `auth_methods: [oauth]`.

## Recovery

All content and images live in GitHub. Every publish and edit is a commit, so a deleted or broken post can be restored from repository history. Cloudflare only publishes a generated copy; it is not the source of truth. If a build fails, the last successful deployment remains available while the source is repaired.

## Expected Cost

For a small public playground, GitHub public repositories, Sveltia CMS, and typical Cloudflare Workers/Builds usage fit their free tiers. Costs can change, so check current account limits before high-volume use.
