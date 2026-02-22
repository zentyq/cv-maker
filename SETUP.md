# Quick Start Guide

## 1. Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages:
- Next.js (React framework)
- Tailwind CSS (styling)
- OpenAI SDK (AI generation)
- Puppeteer (PDF generation)

## 2. Configure OpenAI API Key

1. Copy the `.env.example` file to create `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Get your OpenAI API key:
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key

3. Edit `.env` and replace `your_openai_api_key_here` with your actual API key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

## 3. Run the Development Server

```powershell
npm run dev
```

The application will start at http://localhost:3000

## 4. Using the Application

1. **Enter Job Listing**: Paste a complete job listing or just a job title in the text area
2. **Choose Template**: Select from Simple ATS, Modern, Two-Column, or Creative
3. **Generate CV**: Click "Generate CV with AI" and wait 5-10 seconds
4. **Preview**: Your CV will appear in the preview pane on the right
5. **Download**: Click "Download PDF" to save your CV

## 5. Tips for Best Results

### Job Listings
- **Full listing**: Paste the entire job description for best results
- **Job title only**: Just enter "Senior Software Engineer" for a generic CV
- **Keywords**: Include specific skills or requirements you want highlighted

### Templates
- **Simple ATS**: Best for applicant tracking systems
- **Modern**: Good balance of style and professionalism
- **Two-Column**: Efficient use of space
- **Creative**: Eye-catching but still professional

### Customization
After generation, you can:
- Switch templates to see different layouts
- Regenerate with modified job listings
- Download multiple versions

## 6. Troubleshooting

### "OpenAI API key not configured"
- Make sure you created the `.env` file
- Check that your API key is correct
- Restart the dev server after adding the key

### "Failed to generate PDF"
- On first run, Puppeteer needs to download Chrome (automatic)
- Check your internet connection
- Make sure you have enough disk space (~300MB for Chrome)

### CV generation is slow
- First generation can take 10-15 seconds
- This is normal for AI processing
- Subsequent generations should be faster

### Port 3000 already in use
Run on a different port:
```powershell
$env:PORT=3001; npm run dev
```

## 7. Building for Production

To create an optimized production build:

```powershell
npm run build
npm start
```

## 8. Project Structure

```
CV Maker/
├── pages/
│   ├── index.js          # Main UI
│   ├── _app.js           # App wrapper
│   ├── _document.js      # HTML document
│   └── api/
│       ├── generate.js   # AI generation endpoint
│       └── export.js     # PDF export endpoint
├── lib/
│   ├── renderTemplate.js # Template rendering
│   └── pdf.js            # PDF generation
├── templates/
│   ├── simple.html       # Simple ATS template
│   ├── modern.html       # Modern template
│   ├── two-column.html   # Two-column layout
│   └── creative.html     # Creative template
├── styles/
│   └── globals.css       # Global styles
└── package.json          # Dependencies
```

## 9. Privacy & Data

- **No database**: All data stays in memory
- **No tracking**: No analytics or user tracking
- **Local only**: Runs entirely on your machine
- **API calls**: Only to OpenAI for CV generation
- **No storage**: CVs are not saved server-side

## 10. Cost Considerations

- OpenAI charges per API call
- Each CV generation costs ~$0.02-0.05
- GPT-4 Turbo is used for best results
- You can switch to GPT-3.5 in `pages/api/generate.js` to reduce costs

## Need Help?

Check the README.md for more information or review the code comments for implementation details.
