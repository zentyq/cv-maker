# CV Maker - Personal AI-Powered CV Builder

A simple, local web application that generates professional CVs using AI based on job listings.

## Features

- 🤖 AI-powered CV generation using OpenAI GPT
- 📄 Multiple professional templates (Simple, Modern, Two-Column, Creative)
- 📥 PDF export functionality
- 🎨 Built with Next.js and Tailwind CSS
- 🔒 Completely private - no database, no authentication needed

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure OpenAI API:**
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to `.env`:
     ```
     OPENAI_API_KEY=sk-your-api-key-here
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. Paste a job listing or type a job title in the text area
2. Select a CV template from the dropdown
3. Click "Generate CV"
4. Preview the generated CV
5. Click "Download PDF" to save your CV

## Templates

- **Simple ATS**: Clean, ATS-friendly format
- **Modern**: Contemporary design with good visual hierarchy
- **Two-Column**: Efficient space usage with sidebar
- **Creative**: Professional but visually distinctive

## Tech Stack

- **Frontend**: Next.js + React + Tailwind CSS
- **AI**: OpenAI GPT-4
- **PDF Generation**: Puppeteer
- **Storage**: Local/In-memory (no database)

## Project Structure

```
project/
├── pages/
│   ├── index.js          # Main UI
│   └── api/
│       ├── generate.js   # AI generation endpoint
│       └── export.js     # PDF export endpoint
├── lib/
│   ├── renderTemplate.js # Template rendering logic
│   └── pdf.js           # PDF generation utility
├── templates/           # CV templates (HTML)
└── styles/             # Global styles
```

## License

Personal use only.
