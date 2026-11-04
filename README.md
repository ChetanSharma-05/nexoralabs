# NEXORA LABS — Deployment Guide

This is a static HTML/CSS/JavaScript website prepared for GitHub + Cloudflare Pages. Existing design, animations, and image assets have been preserved.

## 1. Open in VS Code

1. Extract this ZIP.
2. In VS Code, choose **File → Open Folder** and open the extracted `nexora` folder (the folder containing `index.html`).
3. Open **Terminal → New Terminal**.

## 2. Check Git

```bash
git --version
```

If Git is not installed, install Git for Windows from https://git-scm.com/download/win and reopen VS Code.

## 3. Push to the existing GitHub repository

Run these commands from the project root (the folder containing `index.html`):

```bash
git init
git add .
git commit -m "Prepare NEXORA LABS website for deployment"
git branch -M main
git remote add origin https://github.com/ChetanSharma-05/nexoralabs.git
git push -u origin main
```

If `remote origin already exists` appears, use:

```bash
git remote set-url origin https://github.com/ChetanSharma-05/nexoralabs.git
git push -u origin main
```

GitHub may open a browser window for sign-in/authorization. Never share your password or one-time verification code.

## 4. Cloudflare Pages settings

1. Sign in at https://dash.cloudflare.com/ and open **Workers & Pages → Create → Pages → Connect to Git**.
2. Select GitHub and authorize Cloudflare, then choose `ChetanSharma-05/nexoralabs`.
3. Framework preset: **None** (or **No framework**).
4. Production branch: `main`.
5. Build command: leave blank.
6. Build output directory: `/` (project root).
7. Root directory: `/` (leave default).
8. Click **Save and Deploy**.

This site is static; no Node build or backend build is required.

## 5. EmailJS

The contact page loads the EmailJS Browser SDK, then `assets/js/email-config.js`, then `assets/js/contact.js`. The config file contains the previously supplied EmailJS **public client identifiers**. These are not private credentials, but configure allowed origins/domain restrictions in EmailJS for your live Pages hostname. Never put an EmailJS private key, account password, or other secret in frontend code.

After deployment, send a real test from the live Contact page and confirm delivery in the destination inbox and EmailJS dashboard. If it fails, check the browser Console and Network tabs. The service identifier is retained exactly as previously supplied; do not replace it without checking the working EmailJS account configuration.

## 6. Confirm the live hostname

The SEO canonical URLs, Open Graph URLs, sitemap, and robots file currently use `https://nexoralabs.pages.dev`. If Cloudflare assigns a different `*.pages.dev` hostname, replace `nexoralabs.pages.dev` in `about.html`, `contact.html`, `sitemap.xml`, and `robots.txt`, then commit and push the change.

## Cloudflare Pages build summary

- Framework: None
- Build command: *(blank)*
- Build output directory: `/`
- Root directory: `/`
- Branch: `main`

## Notes

- Keep `index.html` at the repository root.
- All 44 supplied image files are included under `assets/images/`.
- No paid domain is required; use the free `*.pages.dev` hostname.
