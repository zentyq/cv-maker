# 📂 Project Structure

```
CV Maker/
│
├── 📄 START-HERE.md              ⭐ Begin here!
├── 📄 README.md                  Project overview
├── 📄 GETTING-STARTED.md         Step-by-step checklist
├── 📄 SETUP.md                   Detailed setup guide
├── 📄 EXAMPLES.md                Usage examples
├── 📄 TESTING.md                 Testing & debugging
├── 📄 ARCHITECTURE.md            System diagrams
├── 📄 PROJECT-SUMMARY.md         Complete reference
├── 📄 FILE-MANIFEST.md           All files explained
│
├── ⚙️  package.json              Dependencies & scripts
├── ⚙️  next.config.js            Next.js configuration
├── ⚙️  tailwind.config.js        Tailwind CSS config
├── ⚙️  postcss.config.js         PostCSS config
├── ⚙️  .gitignore                Git exclusions
├── ⚙️  .env.example              Environment template (copy to .env)
│
├── 📁 pages/                     React pages
│   ├── 🎨 index.js               Main UI (input, preview, buttons)
│   ├── 📄 _app.js                App wrapper
│   ├── 📄 _document.js           HTML document
│   │
│   └── 📁 api/                   Backend API routes
│       ├── 🤖 generate.js        AI CV generation (OpenAI)
│       └── 📥 export.js          PDF export (Puppeteer)
│
├── 📁 lib/                       Utility libraries
│   ├── 🔧 renderTemplate.js     Template rendering engine
│   ├── 🔧 pdf.js                PDF generation utility
│   └── 📋 sampleData.js         Example CV data
│
├── 📁 templates/                 CV HTML templates
│   ├── 📄 simple.html            Simple ATS template
│   ├── 📄 modern.html            Modern blue template
│   ├── 📄 two-column.html        Sidebar layout
│   └── 📄 creative.html          Purple gradient design
│
├── 📁 styles/                    Global styles
│   └── 🎨 globals.css            Tailwind & custom CSS
│
└── 📁 public/                    Static assets
    └── 🖼️  favicon.svg            Site icon
```

## 🎯 Key Files to Know

### Essential for Setup
- `START-HERE.md` - Quick start guide
- `.env.example` - Copy this to `.env` and add your API key
- `package.json` - Run `npm install` to install dependencies

### Main Application Files
- `pages/index.js` - The UI you see in the browser
- `pages/api/generate.js` - AI CV generation logic
- `pages/api/export.js` - PDF download functionality

### Templates
- `templates/simple.html` - Clean, ATS-friendly
- `templates/modern.html` - Blue gradient, contemporary
- `templates/two-column.html` - Sidebar with skills
- `templates/creative.html` - Colorful, eye-catching

### Utilities
- `lib/renderTemplate.js` - Fills templates with data
- `lib/pdf.js` - Converts HTML to PDF

### Documentation
- `START-HERE.md` - ⭐ Best starting point
- `GETTING-STARTED.md` - Detailed checklist
- `README.md` - Project overview
- `SETUP.md` - Setup instructions
- `EXAMPLES.md` - Sample job listings
- `TESTING.md` - How to test
- `ARCHITECTURE.md` - System design
- `PROJECT-SUMMARY.md` - Everything about the project
- `FILE-MANIFEST.md` - All files explained

## 📊 File Count

```
Total Files: 29
├── Documentation:     9 files
├── Source Code:       8 files
├── Templates:         4 files
├── Config Files:      6 files
├── Utilities:         3 files
└── Assets:            1 file
```

## 🔄 Typical Workflow

1. User edits: `pages/index.js` (UI customization)
2. User edits: `templates/*.html` (CV layouts)
3. User edits: `pages/api/generate.js` (AI prompts)
4. System reads: `.env` (API keys)
5. System uses: `lib/renderTemplate.js` (rendering)
6. System uses: `lib/pdf.js` (PDF creation)

## 🎨 Visual Guide

```
┌─────────────────────────────────────────────┐
│  Browser (http://localhost:3000)            │
│  ┌───────────────────────────────────────┐ │
│  │  pages/index.js (Main UI)             │ │
│  │  • Input form                         │ │
│  │  • Template selector                  │ │
│  │  • Preview pane                       │ │
│  │  • Download button                    │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
                    ↓  ↑
┌─────────────────────────────────────────────┐
│  Next.js Server (localhost:3000)            │
│  ┌───────────────────────────────────────┐ │
│  │  pages/api/generate.js                │ │
│  │  → Calls OpenAI API                   │ │
│  │  → Returns CV JSON                    │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │  pages/api/export.js                  │ │
│  │  → Uses lib/pdf.js                    │ │
│  │  → Returns PDF file                   │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │  lib/renderTemplate.js                │ │
│  │  → Reads templates/*.html             │ │
│  │  → Injects CV data                    │ │
│  │  → Returns HTML                       │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## 🛠️ Customization Points

Want to customize? Edit these files:

| What to Change | Edit This File |
|----------------|----------------|
| UI layout/colors | `pages/index.js` |
| CV templates | `templates/*.html` |
| AI prompts | `pages/api/generate.js` |
| Global styles | `styles/globals.css` |
| PDF settings | `lib/pdf.js` |
| Template logic | `lib/renderTemplate.js` |

## 📦 Generated Files (Auto-Created)

When you run the app, these folders are created automatically:

```
CV Maker/
├── 📁 node_modules/      (npm install)
│   └── [500+ MB of dependencies]
│
├── 📁 .next/             (npm run dev)
│   └── [Build cache and compiled files]
│
└── 📄 .env               (You create this)
    └── OPENAI_API_KEY=sk-...
```

**Don't commit these to Git!** (already in `.gitignore`)

## 🎓 Learning Path

1. **Start:** `START-HERE.md`
2. **Setup:** `GETTING-STARTED.md`
3. **Try it:** Generate your first CV
4. **Explore:** Look at `templates/modern.html`
5. **Understand:** Read `ARCHITECTURE.md`
6. **Customize:** Modify templates or prompts
7. **Reference:** Use `PROJECT-SUMMARY.md` as needed

---

**Everything is organized and ready to use! 🚀**
