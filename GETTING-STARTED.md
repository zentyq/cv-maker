# 🚀 Getting Started Checklist

Follow these steps to get your CV Maker up and running!

## ☐ Step 1: Install Node.js (if not already installed)

- [ ] Download Node.js from https://nodejs.org
- [ ] Install LTS version (18.x or higher)
- [ ] Verify installation: `node --version`
- [ ] Verify npm: `npm --version`

## ☐ Step 2: Install Project Dependencies

Open PowerShell in the CV Maker folder and run:

```powershell
npm install
```

- [ ] Wait for installation to complete (~2-3 minutes)
- [ ] Verify no errors in output
- [ ] Check that `node_modules` folder was created

**Expected packages installed:**
- next
- react
- react-dom
- openai
- puppeteer
- tailwindcss
- autoprefixer
- postcss

## ☐ Step 3: Get OpenAI API Key

- [ ] Go to https://platform.openai.com/api-keys
- [ ] Sign in or create account
- [ ] Click "Create new secret key"
- [ ] Name it "CV Maker" or similar
- [ ] Copy the key (starts with `sk-`)
- [ ] **Important:** Save it somewhere safe (you can't see it again!)

**Note:** You'll need billing enabled on your OpenAI account. Each CV costs ~$0.02-0.05.

## ☐ Step 4: Configure Environment Variables

In PowerShell:

```powershell
# Copy the example file
Copy-Item .env.example .env
```

Then:

- [ ] Open `.env` file in a text editor
- [ ] Replace `your_openai_api_key_here` with your actual API key
- [ ] Save the file
- [ ] Verify the file is named exactly `.env` (no `.txt` extension)

**Your .env should look like:**
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
```

## ☐ Step 5: Start Development Server

```powershell
npm run dev
```

- [ ] Wait for "ready - started server on 0.0.0.0:3000"
- [ ] Look for "Local: http://localhost:3000"
- [ ] No error messages appear

**If you see errors:**
- Check that `.env` file exists
- Verify API key is correct
- Try `npm install` again

## ☐ Step 6: Open in Browser

- [ ] Open browser (Chrome recommended)
- [ ] Navigate to http://localhost:3000
- [ ] Page loads successfully
- [ ] You see "AI CV Builder" heading
- [ ] No errors in browser console (F12)

## ☐ Step 7: Test CV Generation

**Quick test:**

- [ ] Type "Software Engineer" in the text area
- [ ] Click "Generate CV with AI"
- [ ] Wait 5-15 seconds
- [ ] CV appears in preview pane
- [ ] CV has name, experience, education, skills

**Full test:**

- [ ] Paste a full job listing from `EXAMPLES.md`
- [ ] Generate CV
- [ ] Verify CV is tailored to the job
- [ ] Skills match job requirements

## ☐ Step 8: Test Template Switching

- [ ] Select "Modern" from dropdown
- [ ] Preview updates with blue gradient header
- [ ] Select "Two-Column"
- [ ] Preview shows sidebar layout
- [ ] Select "Creative"
- [ ] Preview shows purple/pink design
- [ ] Select "Simple ATS"
- [ ] Preview shows clean, minimal design

## ☐ Step 9: Test PDF Export

- [ ] With a CV generated, click "Download PDF"
- [ ] Wait 10-20 seconds (first time downloads Chrome)
- [ ] PDF file downloads to your Downloads folder
- [ ] Open PDF and verify it looks correct
- [ ] Try downloading again (should be faster)

**Note:** First PDF export takes longer as Puppeteer downloads Chromium (~300MB).

## ☐ Step 10: Verify Everything Works

**Complete workflow test:**

1. [ ] Enter new job listing
2. [ ] Choose a template
3. [ ] Generate CV
4. [ ] Preview looks good
5. [ ] Switch to different template
6. [ ] Preview updates correctly
7. [ ] Download PDF
8. [ ] PDF matches preview

## 🎉 Success Criteria

You're all set if:

- ✅ Development server runs without errors
- ✅ CVs generate in under 20 seconds
- ✅ All 4 templates display correctly
- ✅ PDFs download successfully
- ✅ No error messages appear

## 🐛 Troubleshooting

### Server won't start
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
npm cache clean --force
npm install
```

### "OpenAI API key not configured"
- Check `.env` file exists in root folder
- Verify key starts with `sk-`
- Restart dev server after adding key
- No spaces before or after the key

### PDF export fails
```powershell
# Reinstall Puppeteer
npm uninstall puppeteer
npm install puppeteer
```

### Template doesn't update
- Hard refresh browser (Ctrl + Shift + R)
- Clear browser cache
- Restart dev server

### Port 3000 already in use
```powershell
# Use different port
$env:PORT=3001
npm run dev
```

### Styles not loading
```powershell
# Rebuild
npm run build
npm run dev
```

## 📋 Optional: Production Build

For better performance:

```powershell
# Build optimized version
npm run build

# Run production server
npm start
```

- [ ] Build completes without errors
- [ ] Production server starts
- [ ] App works at http://localhost:3000
- [ ] Performance feels faster

## 📚 Next Steps

Now that everything works:

1. **Read EXAMPLES.md** - See sample job listings to try
2. **Read SETUP.md** - Detailed setup information
3. **Read TESTING.md** - Testing and debugging tips
4. **Customize templates** - Edit files in `/templates` folder
5. **Modify AI prompts** - Edit `pages/api/generate.js`

## 🎯 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Check code quality |

| File | Purpose |
|------|---------|
| `.env` | Your API key (don't commit!) |
| `pages/index.js` | Main UI |
| `pages/api/generate.js` | AI generation |
| `templates/*.html` | CV templates |

## ✅ Final Checklist

Before you start creating CVs:

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] OpenAI API key obtained
- [ ] `.env` file created and configured
- [ ] Dev server running (`npm run dev`)
- [ ] Browser shows app at localhost:3000
- [ ] Test CV generated successfully
- [ ] All templates work
- [ ] PDF export works
- [ ] No errors in console

**All checked? You're ready to build amazing CVs! 🚀**

---

**Need help?** Check:
- SETUP.md for detailed setup
- TESTING.md for troubleshooting
- EXAMPLES.md for usage ideas
- PROJECT-SUMMARY.md for complete overview
