import { renderTemplate } from '../../lib/renderTemplate';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { templateName, data, fontFamily, fontSize } = req.body;

    if (!templateName || !data) {
      return res.status(400).json({ error: 'Template name and data are required' });
    }

    // Render the template with the data
    let html = renderTemplate(templateName, data);

    // Apply font customizations
    if (fontFamily || fontSize) {
      html = applyFontStyles(html, fontFamily, fontSize);
    }

    res.status(200).json({ html });
  } catch (error) {
    console.error('Template rendering error:', error);
    res.status(500).json({ error: error.message || 'Failed to render template' });
  }
}

function applyFontStyles(html, fontFamily, fontSize) {
  // Inject custom CSS for font family and size
  const fontStyle = `
    <style>
      body, body * {
        ${fontFamily ? `font-family: '${fontFamily}', sans-serif !important;` : ''}
        ${fontSize ? `font-size: ${fontSize} !important;` : ''}
      }
      h1 { font-size: calc(${fontSize || '14px'} * 2.5) !important; }
      h2 { font-size: calc(${fontSize || '14px'} * 1.75) !important; }
      h3 { font-size: calc(${fontSize || '14px'} * 1.4) !important; }
      h4 { font-size: calc(${fontSize || '14px'} * 1.125) !important; }
    </style>
  `;
  
  // Insert the style tag before </head>
  return html.replace('</head>', `${fontStyle}</head>`);
}
