/**
 * Correo de alerta de crisis al padre (services/crisisDetection.js → formatCrisisAlertEmail).
 *
 * El contenido detectado lo escribe el niño y el nombre lo pone él al
 * registrarse: los dos deben llegar escapados al HTML del correo.
 */

const { formatCrisisAlertEmail } = require('../../services/crisisDetection');

describe('formatCrisisAlertEmail escapa el texto del estudiante', () => {
  const contenido = 'ya no aguanto <script>alert(1)</script> <a href="https://malo.example">clic</a>';

  it('no inserta etiquetas del contenido detectado en el HTML', () => {
    const { html } = formatCrisisAlertEmail('Ana', 10, contenido, 'padre@ejemplo.co');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<a href="https://malo.example">');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('&lt;a href=&quot;https://malo.example&quot;&gt;');
  });

  it('no inserta etiquetas del nombre del estudiante en el HTML', () => {
    const { html } = formatCrisisAlertEmail('<img src=x onerror=alert(1)>Ana', 10, 'no puedo más', 'padre@ejemplo.co');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;Ana');
  });

  it('mantiene la edad y el texto plano legibles', () => {
    const { html, text } = formatCrisisAlertEmail('Ana', 10, 'no puedo más', 'padre@ejemplo.co');
    expect(html).toContain('<strong>Ana (10 años)</strong>');
    expect(html).toContain('"no puedo más..."');
    expect(text).toContain('Ana (10 años)');
  });
});
