import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, title, format } = req.body;

    if (!content || !format) {
      return res.status(400).json({ error: 'Content and format are required' });
    }

    if (format === 'pdf') {
      // Export as PDF using Puppeteer
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();

      const htmlContent = `
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
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `;

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

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

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${title || 'document'}.pdf"`);
      return res.send(pdfBuffer);

    } else if (format === 'docx') {
      // Export as Word document
      const $ = cheerio.load(content);
      const children = [];

      // Convert HTML to docx structure
      $('body').children().each((i, elem) => {
        const tagName = elem.name;
        const text = $(elem).text();

        if (!text.trim()) return;

        if (tagName === 'h1') {
          children.push(
            new Paragraph({
              text: text,
              heading: HeadingLevel.HEADING_1,
            })
          );
        } else if (tagName === 'h2') {
          children.push(
            new Paragraph({
              text: text,
              heading: HeadingLevel.HEADING_2,
            })
          );
        } else if (tagName === 'h3') {
          children.push(
            new Paragraph({
              text: text,
              heading: HeadingLevel.HEADING_3,
            })
          );
        } else if (tagName === 'ul' || tagName === 'ol') {
          $(elem).find('li').each((j, li) => {
            children.push(
              new Paragraph({
                text: $(li).text(),
                bullet: tagName === 'ul' ? { level: 0 } : undefined,
                numbering: tagName === 'ol' ? { reference: 'default-numbering', level: 0 } : undefined,
              })
            );
          });
        } else {
          // Parse inline formatting
          const runs = [];
          $(elem).contents().each((k, node) => {
            if (node.type === 'text') {
              runs.push(new TextRun(node.data));
            } else if (node.name === 'strong' || node.name === 'b') {
              runs.push(new TextRun({ text: $(node).text(), bold: true }));
            } else if (node.name === 'em' || node.name === 'i') {
              runs.push(new TextRun({ text: $(node).text(), italics: true }));
            } else if (node.name === 'u') {
              runs.push(new TextRun({ text: $(node).text(), underline: {} }));
            } else {
              runs.push(new TextRun($(node).text()));
            }
          });

          children.push(new Paragraph({ children: runs.length > 0 ? runs : [new TextRun(text)] }));
        }
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: children.length > 0 ? children : [new Paragraph({ text: 'Empty document' })],
        }],
      });

      const buffer = await Packer.toBuffer(doc);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${title || 'document'}.docx"`);
      return res.send(buffer);

    } else {
      return res.status(400).json({ error: 'Unsupported format' });
    }
  } catch (error) {
    console.error('Error exporting document:', error);
    return res.status(500).json({ 
      error: 'Failed to export document',
      details: error.message 
    });
  }
}
