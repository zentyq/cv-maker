# 📋 Complete File Manifest

This document lists every file in the CV Maker project with descriptions.

## Project Root Files

| File | Purpose | Type |
|------|---------|------|
| `package.json` | Dependencies, scripts, and project metadata | Config |
| `next.config.js` | Next.js configuration (Puppeteer externals) | Config |
| `tailwind.config.js` | Tailwind CSS configuration | Config |
| `postcss.config.js` | PostCSS configuration for Tailwind | Config |
| `.gitignore` | Files to exclude from Git | Config |
| `.env.example` | Environment variable template | Config |
| `README.md` | Project overview and quick start | Docs |
| `SETUP.md` | Detailed setup instructions | Docs |
| `GETTING-STARTED.md` | Step-by-step checklist | Docs |
| `EXAMPLES.md` | Usage examples and sample job listings | Docs |
| `TESTING.md` | Testing procedures and debugging | Docs |
| `PROJECT-SUMMARY.md` | Complete project reference | Docs |
| `ARCHITECTURE.md` | Visual architecture diagrams | Docs |
| `FILE-MANIFEST.md` | This file | Docs |

**Total Root Files: 14**

---

## 📁 /pages Directory

React pages and components.

### Main Pages

| File | Purpose | Lines | Key Features |
|------|---------|-------|--------------|
| `index.js` | Main UI page | ~300 | Job input, template selector, preview, download |
| `_app.js` | Next.js app wrapper | ~5 | Imports global CSS |
| `_document.js` | HTML document structure | ~12 | Sets up <html>, <body> |

**Total Page Files: 3**

---

## 📁 /pages/api Directory

API routes for backend functionality.

| File | Purpose | Lines | Key Features |
|------|---------|-------|--------------|
| `generate.js` | AI CV generation endpoint | ~100 | OpenAI integration, prompt engineering |
| `export.js` | PDF export endpoint | ~40 | Puppeteer integration, PDF generation |

**Features:**
- ✅ OpenAI GPT-4 Turbo integration
- ✅ Error handling for API failures
- ✅ Structured JSON validation
- ✅ PDF generation with proper headers
- ✅ 4MB body size limit for HTML

**Total API Files: 2**

---

## 📁 /lib Directory

Utility functions and helpers.

| File | Purpose | Lines | Key Features |
|------|---------|-------|--------------|
| `renderTemplate.js` | Template rendering engine | ~120 | Mustache-style templating, HTML escaping |
| `pdf.js` | PDF generation utility | ~80 | Puppeteer wrapper, custom options |
| `sampleData.js` | Example CV data structure | ~70 | Sample JSON for reference |

**Features:**
- ✅ XSS protection (HTML escaping)
- ✅ Array rendering (experiences, education, skills)
- ✅ Nested data support (bullets within experience)
- ✅ Headless Chrome PDF generation
- ✅ Professional PDF settings (A4, margins)

**Total Library Files: 3**

---

## 📁 /templates Directory

HTML templates for CV layouts.

| File | Style | Best For | Key Design Elements |
|------|-------|----------|---------------------|
| `simple.html` | Minimal, ATS-friendly | Applicant Tracking Systems | Black/white, standard formatting, no fancy design |
| `modern.html` | Contemporary | Tech companies, general use | Blue gradient header, rounded elements, modern typography |
| `two-column.html` | Sidebar layout | Space efficiency | Dark sidebar, white main area, professional gray scheme |
| `creative.html` | Eye-catching | Creative industries, startups | Purple-pink gradients, unique bullets, modern accents |

**Common Features:**
- ✅ Responsive design
- ✅ Tailwind CSS via CDN
- ✅ Mustache-style placeholders ({{name}}, {{title}}, etc.)
- ✅ Sections: Header, Summary, Experience, Education, Skills
- ✅ Print-optimized

**Template Structure:**
```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <!-- Header with name/title -->
    <!-- Professional summary -->
    <!-- Experience section -->
    <!-- Education section -->
    <!-- Skills section -->
  </body>
</html>
```

**Total Template Files: 4**

---

## 📁 /styles Directory

Global styles and CSS.

| File | Purpose | Lines | Key Features |
|------|---------|-------|--------------|
| `globals.css` | Global styles | ~35 | Tailwind imports, custom utility classes, gradients |

**Custom Classes Defined:**
- `.cv-preview` - Preview pane styling
- `.btn-primary` - Generate button
- `.btn-secondary` - Download button

**Total Style Files: 1**

---

## 📁 /public Directory

Static assets.

| File | Purpose | Type |
|------|---------|------|
| `favicon.svg` | Site icon (document/CV icon) | SVG |

**Total Public Files: 1**

---

## File Statistics Summary

```
Total Files:             28
├── Root Config:         6
├── Documentation:       8
├── React Pages:         3
├── API Routes:          2
├── Utilities:           3
├── Templates:           4
├── Styles:              1
└── Public Assets:       1

Lines of Code:           ~1,500
├── JavaScript/React:    ~800
├── API/Backend:         ~220
├── Templates (HTML):    ~400
├── Documentation:       ~2,500 (not counted in LOC)

Languages Used:
├── JavaScript (JSX)     ████████████ 60%
├── HTML                 ██████       30%
├── CSS                  ██           10%
```

---

## Dependency Count

**Production Dependencies: 4**
- next
- react
- react-dom
- openai
- puppeteer

**Development Dependencies: 3**
- tailwindcss
- autoprefixer
- postcss

**Total: 7 direct dependencies**

---

## Code Organization

### Frontend (Client-Side)
```
pages/
├── index.js              Main UI component
├── _app.js               App wrapper
└── _document.js          HTML document
```

### Backend (Server-Side)
```
pages/api/
├── generate.js           OpenAI integration
└── export.js             PDF generation

lib/
├── renderTemplate.js     Template engine
└── pdf.js                PDF utility
```

### Content (Static)
```
templates/
├── simple.html
├── modern.html
├── two-column.html
└── creative.html

public/
└── favicon.svg
```

### Configuration
```
Root/
├── package.json          Dependencies
├── next.config.js        Next.js config
├── tailwind.config.js    Tailwind config
├── postcss.config.js     PostCSS config
├── .env.example          Environment template
└── .gitignore            Git exclusions
```

### Documentation
```
Root/
├── README.md             Overview
├── SETUP.md              Setup guide
├── GETTING-STARTED.md    Checklist
├── EXAMPLES.md           Usage examples
├── TESTING.md            Testing guide
├── PROJECT-SUMMARY.md    Complete reference
├── ARCHITECTURE.md       Diagrams
└── FILE-MANIFEST.md      This file
```

---

## File Purposes Quick Reference

### For Users
- `README.md` - Start here for overview
- `GETTING-STARTED.md` - Follow this checklist
- `EXAMPLES.md` - Sample inputs to try
- `.env.example` - Copy to `.env` and add API key

### For Developers
- `ARCHITECTURE.md` - Understand the system design
- `TESTING.md` - Test and debug
- `PROJECT-SUMMARY.md` - Complete feature list
- `lib/sampleData.js` - Example data structure

### For Customization
- `templates/*.html` - Modify CV layouts
- `pages/api/generate.js` - Adjust AI prompts
- `styles/globals.css` - Change global styles
- `tailwind.config.js` - Customize Tailwind

---

## Files You'll Create

During setup, you'll create:

| File | When | Purpose |
|------|------|---------|
| `.env` | Setup | Your OpenAI API key |
| `node_modules/` | npm install | Dependencies (auto-generated) |
| `.next/` | First run | Build cache (auto-generated) |

**These are gitignored and should not be committed.**

---

## Files You Can Modify Safely

### Safe to Edit
- ✅ `templates/*.html` - Customize CV layouts
- ✅ `pages/api/generate.js` - Adjust AI behavior
- ✅ `styles/globals.css` - Change colors/styles
- ✅ `.env` - Add/update API key

### Edit with Caution
- ⚠️ `pages/index.js` - Main UI logic
- ⚠️ `lib/renderTemplate.js` - Template engine
- ⚠️ `lib/pdf.js` - PDF generation

### Don't Edit (Config)
- ❌ `package.json` - Manage with npm commands
- ❌ `next.config.js` - Needed for Puppeteer
- ❌ `.gitignore` - Standard exclusions

---

## File Relationships

```
index.js (UI)
  ├─→ /api/generate (OpenAI)
  │     └─→ Returns CV JSON
  │
  ├─→ renderTemplate() (lib/renderTemplate.js)
  │     ├─→ Reads templates/*.html
  │     └─→ Returns rendered HTML
  │
  └─→ /api/export (PDF)
        └─→ pdf.generatePDF() (lib/pdf.js)
              └─→ Returns PDF buffer
```

---

## Critical Files (Don't Delete)

These files are essential for the app to work:

1. `package.json` - Dependencies
2. `next.config.js` - Puppeteer config
3. `pages/index.js` - Main UI
4. `pages/api/generate.js` - AI generation
5. `pages/api/export.js` - PDF export
6. `lib/renderTemplate.js` - Template engine
7. `lib/pdf.js` - PDF generation
8. All `templates/*.html` files
9. `.env` (after you create it)

**Missing any of these will break the application.**

---

## File Size Reference

Approximate file sizes:

| File Type | Size |
|-----------|------|
| JavaScript/React files | 2-10 KB each |
| Template HTML files | 3-5 KB each |
| Documentation files | 5-20 KB each |
| Config files | 0.5-2 KB each |
| Total project (no deps) | ~150 KB |
| With node_modules | ~500 MB |

---

## Version Control

Files tracked in Git:
- ✅ All source code
- ✅ All templates
- ✅ All documentation
- ✅ Config files
- ✅ `.env.example`

Files excluded from Git:
- ❌ `.env` (contains secrets)
- ❌ `node_modules/` (dependencies)
- ❌ `.next/` (build cache)
- ❌ Generated PDFs

---

This manifest helps you understand every piece of the project!
