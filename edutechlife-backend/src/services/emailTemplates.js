/**
 * Email Templates Service
 * Handles loading and rendering email templates with variables
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '../../email-templates');

/**
 * Simple template renderer that replaces {{variable}} with values
 * @param {string} template - Template content
 * @param {Object} variables - Variables to inject
 * @returns {string} - Rendered template
 */
function renderTemplate(template, variables = {}) {
  let rendered = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replaceAll(placeholder, value || '');
  }

  return rendered;
}

/**
 * Loads and renders an MJML email template
 * MJML files need to be converted to HTML via mjml-core or similar,
 * but for now we provide a simple HTML rendering.
 *
 * In production, you may want to:
 * - Pre-compile MJML to HTML at build time
 * - Use mjml-core library: npm install mjml mjml-core
 *
 * @param {string} templateName - Name of template file (without .mjml)
 * @param {Object} variables - Variables to inject
 * @returns {Promise<string>} - Rendered HTML
 */
async function loadTemplate(templateName, variables = {}) {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.mjml`);

  try {
    const mjmlContent = fs.readFileSync(templatePath, 'utf8');

    // Simple MJML-to-HTML converter (basic implementation)
    // For production, use mjml-core: const mjml2html = require('mjml-core');
    const html = convertMjmlToHtml(mjmlContent);

    // Render variables into template
    return renderTemplate(html, variables);
  } catch (error) {
    console.error(`[Template Error] Failed to load template "${templateName}":`, error.message);
    throw new Error(`Template not found or invalid: ${templateName}`);
  }
}

/**
 * Basic MJML-to-HTML converter (simple implementation)
 * This is a fallback converter that handles basic MJML tags.
 * For production, use the mjml-core library.
 *
 * @param {string} mjml - MJML content
 * @returns {string} - HTML content
 */
function convertMjmlToHtml(mjml) {
  // Extract text between <mj-head> and </mj-head>
  const headMatch = mjml.match(/<mj-head>([\s\S]*?)<\/mj-head>/);
  const head = headMatch ? headMatch[1] : '';

  // Extract text between <mj-body> and </mj-body>
  const bodyMatch = mjml.match(/<mj-body[^>]*>([\s\S]*?)<\/mj-body>/);
  const bodyContent = bodyMatch ? bodyMatch[1] : '';

  // Extract style from <mj-style>
  const styleMatch = head.match(/<mj-style>([\s\S]*?)<\/mj-style>/);
  const styles = styleMatch ? styleMatch[1] : '';

  // Extract preview (for future use in meta tags)
  // const previewMatch = head.match(/<mj-preview>([\s\S]*?)<\/mj-preview>/);

  // Extract title
  const titleMatch = head.match(/<mj-title>([\s\S]*?)<\/mj-title>/);
  const title = titleMatch ? titleMatch[1] : 'EdutechLife';

  // Convert MJML body sections to HTML
  let html = convertMjmlBody(bodyContent);

  // Wrap in complete HTML document
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    a {
      color: #004B63;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .button {
      display: inline-block;
      padding: 12px 28px;
      background-color: #004B63;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
      margin: 16px 0;
    }
    .button:hover {
      background-color: #003b4a;
      text-decoration: none;
    }
    .divider {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 32px 0;
    }
    .highlight {
      background-color: #f1f5f9;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .section {
      padding: 40px 20px;
    }
    .section-dark {
      background-color: #004B63;
      padding: 24px;
      color: #ffffff;
    }
    .section-footer {
      background-color: #f8fafc;
      padding: 32px 20px;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    h1 { font-size: 24px; color: #004B63; margin: 0 0 16px 0; }
    h2 { font-size: 16px; color: #004B63; margin: 24px 0 12px 0; }
    p { margin: 0 0 16px 0; }
    ${styles}
  </style>
</head>
<body>
  <div class="email-container">
    ${html}
  </div>
</body>
</html>`;
}

/**
 * Converts MJML body content to HTML
 * @param {string} body - MJML body content
 * @returns {string} - HTML
 */
function convertMjmlBody(body) {
  let html = '';

  // Find all <mj-section> elements
  const sectionRegex = /<mj-section([^>]*)>([\s\S]*?)<\/mj-section>/g;
  let sectionMatch;

  while ((sectionMatch = sectionRegex.exec(body)) !== null) {
    const sectionAttrs = sectionMatch[1];
    const sectionContent = sectionMatch[2];

    // Extract section attributes
    const bgColorMatch = sectionAttrs.match(/background-color="([^"]*)"/);
    const bgColor = bgColorMatch ? bgColorMatch[1] : '';
    const paddingMatch = sectionAttrs.match(/padding="([^"]*)"/);
    const padding = paddingMatch ? paddingMatch[1] : '';

    let sectionStyle = '';
    if (bgColor) sectionStyle += `background-color: ${bgColor};`;
    if (padding) sectionStyle += `padding: ${padding};`;

    const sectionClass = bgColor && bgColor.includes('004B63') ? 'section-dark' : 'section';
    const finalStyle = sectionStyle ? ` style="${sectionStyle}"` : '';

    html += `<div class="${sectionClass}"${finalStyle}>`;
    html += convertMjmlColumn(sectionContent);
    html += `</div>`;
  }

  return html;
}

/**
 * Converts MJML column content to HTML
 * @param {string} content - Column content
 * @returns {string} - HTML
 */
function convertMjmlColumn(content) {
  let html = '';

  // Handle text elements
  const textRegex = /<mj-text([^>]*)>([\s\S]*?)<\/mj-text>/g;
  let textMatch;
  const textReplacements = [];

  while ((textMatch = textRegex.exec(content)) !== null) {
    const attrs = textMatch[1];
    const text = textMatch[2];
    const isHeading = attrs.includes('font-weight="700"') && attrs.includes('font-size="24px"');
    const tag = isHeading ? 'h1' : 'p';
    const sizeMatch = attrs.match(/font-size="([^"]*)"/);
    const colorMatch = attrs.match(/color="([^"]*)"/);
    const alignMatch = attrs.match(/align="([^"]*)"/);
    const weightMatch = attrs.match(/font-weight="([^"]*)"/);

    let style = '';
    if (sizeMatch) style += `font-size: ${sizeMatch[1]};`;
    if (colorMatch) style += `color: ${colorMatch[1]};`;
    if (alignMatch) style += `text-align: ${alignMatch[1]};`;
    if (weightMatch) style += `font-weight: ${weightMatch[1]};`;

    const styleAttr = style ? ` style="${style}"` : '';
    const replacement = `<${tag}${styleAttr}>${text}</${tag}>`;
    textReplacements.push({ original: textMatch[0], replacement });
  }

  let result = content;
  textReplacements.forEach(({ original, replacement }) => {
    result = result.replace(original, replacement);
  });

  // Handle button elements
  const buttonRegex = /<mj-button([^>]*)>([\s\S]*?)<\/mj-button>/g;
  let buttonMatch;

  while ((buttonMatch = buttonRegex.exec(result)) !== null) {
    const attrs = buttonMatch[1];
    const text = buttonMatch[2].trim();
    const hrefMatch = attrs.match(/href="([^"]*)"/);
    const href = hrefMatch ? hrefMatch[1] : '#';
    const bgColorMatch = attrs.match(/background-color="([^"]*)"/);
    const bgColor = bgColorMatch ? bgColorMatch[1] : '#004B63';

    const buttonHtml = `<a href="${href}" class="button" style="background-color: ${bgColor};">${escapeHtml(text)}</a>`;
    result = result.replace(buttonMatch[0], buttonHtml);
  }

  // Handle divider elements
  result = result.replace(/<mj-divider[^>]*>/g, '<hr class="divider">');

  // Handle image elements
  const imgRegex = /<mj-image([^>]*)>/g;
  result = result.replace(imgRegex, (match, attrs) => {
    const srcMatch = attrs.match(/src="([^"]*)"/);
    const altMatch = attrs.match(/alt="([^"]*)"/);
    const widthMatch = attrs.match(/width="([^"]*)"/);
    const src = srcMatch ? srcMatch[1] : '';
    const alt = altMatch ? altMatch[1] : '';
    const width = widthMatch ? widthMatch[1] : '';
    return `<img src="${src}" alt="${alt}" ${width ? `style="max-width: ${width};"` : ''} style="display: block; margin: 0 auto;">`;
  });

  // Remove any remaining MJML tags
  html = result.replace(/<mj-[^>]*>/g, '').replace(/<\/mj-[^>]*>/g, '');

  return html;
}

/**
 * Escapes HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Generates a parental consent verification email
 * @param {Object} params - Parameters
 * @param {string} params.parentEmail - Parent email (included for context, used in template)
 * @param {number} params.studentAge - Student age
 * @param {string} params.token - Verification token
 * @returns {Promise<Object>} - Email object with subject, html, text
 */
async function generateParentVerificationEmail({ _parentEmail, studentAge, token }) {
  const verifyUrl = `https://edutechlife.co/api/smartboard/parental-consent/verify?token=${token}`;

  const html = await loadTemplate('parent-verification', {
    studentAge,
    verifyUrl,
  });

  // Generate plain text version
  const text = `
Verifica el acceso de tu hijo a SmartBoard

Recibimos una solicitud para activar SmartBoard (nuestra plataforma de aprendizaje gamificado) para un estudiante de ${studentAge} años.

¿Qué es SmartBoard?
SmartBoard es una plataforma interactiva que ayuda a estudiantes entre 8 y 16 años a aprender a través del juego.

Verifica tu identidad en el siguiente enlace:
${verifyUrl}

Este enlace es de un solo uso y expira en 24 horas.

Seguridad y privacidad:
- Este enlace es personal y debe mantenerse confidencial.
- Nunca compartimos tu contraseña por correo electrónico.
- Los datos de tu hijo están protegidos con RLS (Seguridad en Filas).
- Cumplimos con COPPA, Ley 1581 y GDPR-K.

¿Necesitas ayuda?
Email: soporte@edutechlife.co
Centro de ayuda: https://edutechlife.co/help

Si no reconoces esta solicitud, simplemente ignora este correo.
  `.trim();

  return {
    subject: 'Verifica el acceso de tu hijo a SmartBoard',
    html,
    text,
  };
}

module.exports = {
  loadTemplate,
  renderTemplate,
  generateParentVerificationEmail,
};
