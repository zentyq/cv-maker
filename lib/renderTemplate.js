const fs = require('fs');
const path = require('path');

/**
 * Renders a CV template with the provided data
 * @param {string} templateName - Name of the template (e.g., 'simple', 'modern', 'two-column', 'creative')
 * @param {Object} data - CV data in JSON format
 * @returns {string} - Rendered HTML
 */
function renderTemplate(templateName, data) {
  try {
    // Read the template file
    const templatePath = path.join(process.cwd(), 'templates', `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Replace simple placeholders like {{name}}, {{title}}, {{summary}}
    template = template.replace(/\{\{name\}\}/g, escapeHtml(data.name || ''));
    template = template.replace(/\{\{title\}\}/g, escapeHtml(data.title || ''));
    template = template.replace(/\{\{summary\}\}/g, escapeHtml(data.summary || ''));
    template = template.replace(/\{\{email\}\}/g, escapeHtml(data.email || ''));
    template = template.replace(/\{\{phone\}\}/g, escapeHtml(data.phone || ''));
    template = template.replace(/\{\{location\}\}/g, escapeHtml(data.location || ''));

    // Handle experience array
    template = renderArray(template, 'experience', data.experience || [], (exp) => {
      let expHtml = `
        <div class="mb-5">
          <div class="flex justify-between items-baseline mb-1">
            <h3 class="text-lg font-semibold text-gray-900">${escapeHtml(exp.role || '')}</h3>
            <span class="text-sm text-gray-600">${escapeHtml(exp.dates || '')}</span>
          </div>
          <p class="text-gray-700 italic mb-2">${escapeHtml(exp.company || '')}</p>
          <ul class="list-disc list-inside space-y-1 text-gray-700">
      `;
      
      (exp.bullets || []).forEach(bullet => {
        expHtml += `<li>${escapeHtml(bullet)}</li>\n`;
      });
      
      expHtml += `</ul></div>`;
      return expHtml;
    });

    // Handle education array
    template = renderArray(template, 'education', data.education || [], (edu) => {
      return `
        <div class="mb-3">
          <div class="flex justify-between items-baseline">
            <h3 class="text-lg font-semibold text-gray-900">${escapeHtml(edu.degree || '')}</h3>
            <span class="text-sm text-gray-600">${escapeHtml(edu.year || '')}</span>
          </div>
          <p class="text-gray-700">${escapeHtml(edu.school || edu.institution || '')}</p>
        </div>
      `;
    });

    // Handle skills array
    template = renderArray(template, 'skills', data.skills || [], (skill) => {
      return `<span class="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">${escapeHtml(skill)}</span>`;
    });

    return template;
  } catch (error) {
    console.error('Error rendering template:', error);
    throw new Error(`Failed to render template: ${error.message}`);
  }
}

/**
 * Helper function to render arrays in templates
 * Uses Mustache-like syntax: {{#arrayName}}...{{/arrayName}}
 */
function renderArray(template, arrayName, arrayData, renderFunction) {
  const regex = new RegExp(`\\{\\{#${arrayName}\\}\\}([\\s\\S]*?)\\{\\{\\/${arrayName}\\}\\}`, 'g');
  
  return template.replace(regex, (match, innerTemplate) => {
    if (!arrayData || arrayData.length === 0) {
      return '';
    }

    // For simple rendering, use the custom render function
    return arrayData.map(item => {
      if (typeof renderFunction === 'function') {
        return renderFunction(item);
      }
      
      // Fallback: replace simple placeholders
      let rendered = innerTemplate;
      
      // Handle nested bullets array
      if (item.bullets) {
        rendered = renderArray(rendered, 'bullets', item.bullets, (bullet) => {
          return `<li>${escapeHtml(bullet)}</li>`;
        });
      }
      
      // Replace {{.}} with the item itself (for simple arrays like skills)
      rendered = rendered.replace(/\{\{\.\}\}/g, escapeHtml(String(item)));
      
      // Replace other placeholders
      Object.keys(item).forEach(key => {
        if (key !== 'bullets') {
          const value = item[key];
          rendered = rendered.replace(
            new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
            escapeHtml(String(value || ''))
          );
        }
      });
      
      return rendered;
    }).join('\n');
  });
}

/**
 * Escapes HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

module.exports = { renderTemplate };
