# Testing & Development Guide

## Local Development

### Starting the Development Server

```powershell
npm run dev
```

The app will be available at http://localhost:3000

### Development Features

- **Hot Reload**: Changes to code automatically refresh the browser
- **Error Overlay**: Development errors appear as overlays
- **Fast Refresh**: React components update without full page reload

## Testing the Application

### 1. Test CV Generation

**Basic Test:**
1. Enter "Software Engineer" in the job listing field
2. Click "Generate CV with AI"
3. Wait for generation (5-10 seconds)
4. Verify CV appears in preview

**Expected Result:**
- CV with realistic name, title, and summary
- 2-4 work experiences with bullet points
- Education section
- 8-12 relevant skills

**Full Job Listing Test:**
1. Copy a full job description from EXAMPLES.md
2. Paste into job listing field
3. Generate CV
4. Verify CV is tailored to the specific job

**Expected Result:**
- Skills match job requirements
- Experience bullets relate to job responsibilities
- Professional summary mentions relevant qualifications

### 2. Test Template Switching

1. Generate a CV (any job listing)
2. Click each template in dropdown:
   - Simple ATS
   - Modern
   - Two-Column
   - Creative
3. Verify preview updates for each template

**Expected Result:**
- Preview changes immediately
- All data renders correctly in each template
- No layout issues or missing content

### 3. Test PDF Export

1. Generate a CV
2. Click "Download PDF"
3. Wait for download (5-15 seconds)
4. Open downloaded PDF

**Expected Result:**
- PDF downloads with filename like "CV-John-Smith.pdf"
- PDF matches preview layout
- All content is readable and properly formatted
- Colors and styling are preserved

### 4. Test Error Handling

**No API Key Test:**
1. Remove or comment out OPENAI_API_KEY in .env
2. Restart server
3. Try to generate CV

**Expected Result:**
- Error message: "OpenAI API key not configured"
- No crash or blank screen

**Empty Input Test:**
1. Leave job listing field empty
2. Click "Generate CV"

**Expected Result:**
- Error message: "Please enter a job listing or job title"
- Generate button disabled if field is empty

**Network Error Test:**
1. Disconnect internet
2. Try to generate CV

**Expected Result:**
- Error message about connection failure
- User can try again

### 5. Test UI Responsiveness

**Desktop View:**
- Two-column layout (input left, preview right)
- All buttons visible and clickable
- Preview pane scrollable

**Tablet/Mobile View:**
- Single column layout (stacked)
- All features accessible
- Touch-friendly buttons

**Test Resizing:**
1. Resize browser window
2. Verify layout adapts smoothly
3. No overlapping elements

## Common Issues & Solutions

### Issue: CV Generation Takes Too Long

**Possible Causes:**
- Slow internet connection
- OpenAI API latency
- Large job listing

**Solutions:**
- Wait up to 30 seconds
- Try with shorter job listing
- Check internet connection

### Issue: PDF Export Fails

**Possible Causes:**
- Puppeteer not installed correctly
- Chrome binary missing
- Insufficient memory

**Solutions:**
```powershell
# Reinstall Puppeteer
npm uninstall puppeteer
npm install puppeteer

# Clear npm cache
npm cache clean --force
```

### Issue: Template Doesn't Update

**Possible Causes:**
- React state issue
- Cached preview

**Solutions:**
- Refresh the page
- Clear browser cache
- Regenerate CV

### Issue: Styles Not Loading

**Possible Causes:**
- Tailwind not configured
- CSS build issue

**Solutions:**
```powershell
# Rebuild
npm run build

# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

## Performance Testing

### Load Testing CV Generation

Test with various input sizes:

**Small Input:**
```
Software Engineer
```
Expected: < 10 seconds

**Medium Input:**
```
Senior Software Engineer with experience in React, Node.js, and AWS
```
Expected: < 15 seconds

**Large Input:**
Paste 500+ word job description
Expected: < 20 seconds

### Memory Usage

Monitor in browser DevTools:
1. Open DevTools (F12)
2. Go to Performance tab
3. Generate multiple CVs
4. Check memory doesn't grow excessively

**Expected:**
- Memory stable after 5+ generations
- No memory leaks

### PDF Generation Speed

Test PDF export times:
- First export: 10-20 seconds (Chrome download)
- Subsequent exports: 5-10 seconds

## Code Quality Checks

### Linting

```powershell
npm run lint
```

### Format Check

Ensure consistent code formatting:
- Proper indentation
- No console.errors in production code
- Meaningful variable names

## Browser Compatibility

Test on:
- ✅ Chrome (Recommended)
- ✅ Edge
- ✅ Firefox
- ✅ Safari (Mac)

**Note:** Puppeteer requires Chromium, but the web app works in all modern browsers.

## API Testing

### Test Generate Endpoint

Using PowerShell:
```powershell
$body = @{
    jobListing = "Software Engineer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/generate" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "name": "...",
  "title": "...",
  "summary": "...",
  "experience": [...],
  "education": [...],
  "skills": [...]
}
```

### Test Export Endpoint

This endpoint requires HTML in the body, best tested through the UI.

## Debugging Tips

### Enable Verbose Logging

Add to pages/api/generate.js:
```javascript
console.log('Received job listing:', jobListing);
console.log('OpenAI response:', completion);
```

### Check Puppeteer

Test Puppeteer separately:
```javascript
// test-puppeteer.js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('Puppeteer working!');
  await browser.close();
})();
```

Run:
```powershell
node test-puppeteer.js
```

### React DevTools

Install React DevTools browser extension to:
- Inspect component state
- Monitor re-renders
- Debug hooks

## Production Build Testing

Before deploying:

```powershell
# Build production version
npm run build

# Test production build locally
npm start
```

Navigate to http://localhost:3000 and verify:
- All features work
- No console errors
- Optimized performance

## Checklist Before Release

- [ ] All templates render correctly
- [ ] CV generation works with various inputs
- [ ] PDF export downloads successfully
- [ ] Error messages are clear and helpful
- [ ] No console errors
- [ ] README is up to date
- [ ] .env.example has correct variables
- [ ] All dependencies are listed in package.json
- [ ] Code is commented appropriately

## Getting Help

If you encounter issues:

1. Check this testing guide
2. Review SETUP.md for configuration
3. Check browser console for errors
4. Verify API key is correct
5. Try with a fresh npm install
