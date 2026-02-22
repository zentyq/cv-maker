import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

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
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    uploadedFile = file.filepath;
    const buffer = fs.readFileSync(file.filepath);
    let content = '';
    let text = '';

    // Handle different file types based on extension and mimetype
    const fileExt = path.extname(file.originalFilename || file.newFilename || '').toLowerCase();
    
    if (file.mimetype === 'application/pdf' || fileExt === '.pdf') {
      // Parse PDF
      const data = await pdfParse(buffer);
      text = data.text;
      // Clean up text and convert to HTML paragraphs
      const lines = data.text.split('\n').filter(line => line.trim());
      content = lines.map(line => `<p>${line.trim()}</p>`).join('');
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword' ||
      fileExt === '.docx' ||
      fileExt === '.doc'
    ) {
      // Parse Word document
      const result = await mammoth.convertToHtml({ buffer });
      content = result.value;
      text = result.value.replace(/<[^>]*>/g, '');
    } else if (file.mimetype === 'text/plain' || fileExt === '.txt') {
      // Parse plain text
      text = buffer.toString('utf-8');
      const lines = text.split('\n').filter(line => line.trim());
      content = lines.map(line => `<p>${line.trim()}</p>`).join('');
    } else {
      // Clean up before error
      if (uploadedFile && fs.existsSync(uploadedFile)) {
        fs.unlinkSync(uploadedFile);
      }
      return res.status(400).json({ 
        error: `Unsupported file type: ${file.mimetype || 'unknown'}. Please upload PDF, Word, or text files.` 
      });
    }

    // Clean up temp file
    if (uploadedFile && fs.existsSync(uploadedFile)) {
      fs.unlinkSync(uploadedFile);
    }

    return res.status(200).json({ content, text });
  } catch (error) {
    // Clean up on error
    if (uploadedFile && fs.existsSync(uploadedFile)) {
      try {
        fs.unlinkSync(uploadedFile);
      } catch (e) {
        console.error('Error cleaning up file:', e);
      }
    }
    
    console.error('Error uploading document:', error);
    return res.status(500).json({ 
      error: 'Failed to upload document',
      details: error.message 
    });
  }
}
