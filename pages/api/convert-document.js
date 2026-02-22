import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// pdf-parse needs to be imported dynamically
const pdfParse = require('pdf-parse');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let uploadedFile = null;

  try {
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file?.[0] || files.file;
    const targetFormat = fields.targetFormat?.[0] || fields.targetFormat;

    if (!file || !targetFormat) {
      return res.status(400).json({ error: 'File and target format are required' });
    }

    uploadedFile = file.filepath;
    const buffer = fs.readFileSync(file.filepath);
    let text = '';
    let htmlContent = '';
    
    const fileExt = path.extname(file.originalFilename || file.newFilename || '').toLowerCase();

    // Parse source file
    if (file.mimetype === 'application/pdf' || fileExt === '.pdf') {
      // PDF to Word
      const data = await pdfParse(buffer);
      text = data.text;
      
      if (targetFormat === 'docx') {
        // Convert to Word
        const paragraphs = text.split('\n').filter(line => line.trim()).map(line => 
          new Paragraph({ 
            children: [new TextRun(line.trim())]
          })
        );

        const doc = new Document({
          sections: [{
            properties: {},
            children: paragraphs.length > 0 ? paragraphs : [new Paragraph({ children: [new TextRun('Empty document')] })],
          }],
        });

        const docBuffer = await Packer.toBuffer(doc);

        // Clean up
        if (uploadedFile && fs.existsSync(uploadedFile)) {
          fs.unlinkSync(uploadedFile);
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalFilename?.replace('.pdf', '.docx') || 'converted.docx'}"`);
        return res.send(docBuffer);
      }
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword' ||
      fileExt === '.docx' ||
      fileExt === '.doc'
    ) {
      // Word to PDF
      const result = await mammoth.convertToHtml({ buffer });
      htmlContent = result.value;

      if (targetFormat === 'pdf') {
        // Convert to PDF
        const browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  padding: 40px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                h1 { font-size: 24px; margin-bottom: 16px; }
                h2 { font-size: 20px; margin-bottom: 14px; }
                h3 { font-size: 18px; margin-bottom: 12px; }
                p { margin-bottom: 12px; }
                table { border-collapse: collapse; width: 100%; margin: 16px 0; }
                td { padding: 8px; border: 1px solid #ddd; }
              </style>
            </head>
            <body>
              ${htmlContent}
            </body>
          </html>
        `;

        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
          format: 'A4',
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          },
          printBackground: true
        });

        await browser.close();
        
        // Clean up
        if (uploadedFile && fs.existsSync(uploadedFile)) {
          fs.unlinkSync(uploadedFile);
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalFilename?.replace(/\.(docx?|doc)$/, '.pdf') || 'converted.pdf'}"`);
        return res.send(pdfBuffer);
      }
    } else {
      // Clean up before error
      if (uploadedFile && fs.existsSync(uploadedFile)) {
        fs.unlinkSync(uploadedFile);
      }
      return res.status(400).json({ error: 'Unsupported source file type. Please upload PDF or Word documents.' });
    }

    // Clean up
    if (uploadedFile && fs.existsSync(uploadedFile)) {
      fs.unlinkSync(uploadedFile);
    }
    
    return res.status(400).json({ error: 'Conversion failed or unsupported format combination' });

  } catch (error) {
    // Clean up on error
    if (uploadedFile && fs.existsSync(uploadedFile)) {
      try {
        fs.unlinkSync(uploadedFile);
      } catch (e) {
        console.error('Error cleaning up file:', e);
      }
    }
    
    console.error('Error converting document:', error);
    return res.status(500).json({ 
      error: 'Failed to convert document',
      details: error.message 
    });
  }
}
