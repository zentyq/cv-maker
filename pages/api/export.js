import { generatePDF } from '../../lib/pdf';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { html } = req.body;

    if (!html || html.trim() === '') {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Generate PDF from HTML
    const pdfBuffer = await generatePDF(html);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send the PDF
    return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('Error exporting PDF:', error);
    return res.status(500).json({ 
      error: 'Failed to generate PDF',
      details: error.message 
    });
  }
}

// Increase the body size limit for HTML content
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
