const { createFakeSupabase, installSupabaseSdkStub, freshRequire } = require('../helpers/fakeSupabase');

const stub = installSupabaseSdkStub();

// emailService se reemplaza: lo que importa es qué se manda, no el envío real.
const emailPath = require.resolve('../../services/emailService');
const sent = [];
let emailResult = { success: true, messageId: 'm1', mode: 'test' };
require.cache[emailPath] = {
  id: emailPath,
  filename: emailPath,
  loaded: true,
  exports: {
    sendEmail: async (...args) => {
      sent.push(args);
      if (emailResult instanceof Error) throw emailResult;
      return emailResult;
    },
  },
};
const { sendCrisisAlert, getParentPreferences, logNotification } = freshRequire('../../services/NotificationService');

const alertRow = (over = {}) => ({
  id: 77,
  student_id: 'stu-1',
  crisis_level: 'high',
  detected_content: 'me siento muy mal',
  parent_email: null,
  ...over,
});
const student = (over = {}) => ({ id: 'stu-1', name: 'Ana', age: 12, parent_email: 'mama@correo.co', ...over });

function setup({
  crisis = alertRow(),
  stu = student(),
  parent = { id: 'p1', email: 'mama@correo.co', phone: null },
  prefs = { data: { email_enabled: true, push_enabled: true, sms_enabled: false }, error: null },
  parentInsert = null,
} = {}) {
  return stub.use(
    createFakeSupabase({
      crisis_alerts: crisis === null ? { data: null, error: null } : { data: crisis, error: null },
      students: { data: stu, error: stu ? null : { message: 'x' } },
      parents: (state) => {
        if (state.ops.some((o) => o[0] === 'insert')) return parentInsert || { data: { id: 'pNew' }, error: null };
        return parent ? { data: parent, error: null } : { data: null, error: { code: 'PGRST116', message: 'none' } };
      },
      parent_preferences: prefs,
      notification_logs: { data: null, error: null },
    })
  );
}

const logs = (fake) => fake.calls.filter((c) => c.table === 'notification_logs').map((c) => c.args[0]);

beforeEach(() => {
  sent.length = 0;
  emailResult = { success: true, messageId: 'm1', mode: 'test' };
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('sendCrisisAlert: errores de entrada', () => {
  it('sin id responde error sin tocar la base', async () => {
    const fake = setup();
    expect(await sendCrisisAlert()).toEqual({ success: false, error: 'Crisis alert ID is required' });
    expect(fake.calls).toEqual([]);
  });

  it('si la alerta no existe', async () => {
    setup({ crisis: null });
    const out = await sendCrisisAlert(1);
    expect(out.success).toBe(false);
    expect(out.error).toMatch(/Crisis alert not found/);
  });

  it('sin correo de padre en la alerta ni en el estudiante', async () => {
    setup({ crisis: alertRow({ parent_email: null }), stu: student({ parent_email: null }) });
    const out = await sendCrisisAlert(1);
    expect(out.error).toMatch(/No parent email found/);
    expect(sent).toHaveLength(0);
  });
});

describe('sendCrisisAlert: envío por canales', () => {
  it('manda correo y push cuando ambos están activos y registra cada intento', async () => {
    const fake = setup();
    const out = await sendCrisisAlert(77);
    expect(out).toEqual({
      success: true,
      notification: { parent_id: 'p1', crisis_alert_id: 77, channels_sent: ['email', 'push'] },
    });
    expect(sent).toHaveLength(1);
    expect(sent[0][0]).toBe('mama@correo.co');
    expect(sent[0][1]).toBe('Alerta: Ana necesita ayuda en IngenIA');
    expect(logs(fake).map((l) => [l.channel, l.status])).toEqual([['email', 'sent'], ['push', 'sent']]);
  });

  it('usa el correo de la alerta antes que el del estudiante', async () => {
    setup({ crisis: alertRow({ parent_email: 'papa@correo.co' }), parent: { id: 'p2', email: 'papa@correo.co' } });
    await sendCrisisAlert(77);
    expect(sent[0][0]).toBe('papa@correo.co');
  });

  it('respeta las preferencias: solo SMS si el padre tiene teléfono', async () => {
    const fake = setup({
      parent: { id: 'p1', email: 'mama@correo.co', phone: '+573001112233' },
      prefs: { data: { email_enabled: false, push_enabled: false, sms_enabled: true }, error: null },
    });
    const out = await sendCrisisAlert(77);
    expect(out.notification.channels_sent).toEqual(['sms']);
    expect(sent).toHaveLength(0);
    expect(logs(fake)[0]).toMatchObject({ channel: 'sms', status: 'sent' });
  });

  it('SMS activado pero sin teléfono: no hay ningún canal y se informa el fallo', async () => {
    setup({ prefs: { data: { email_enabled: false, push_enabled: false, sms_enabled: true }, error: null } });
    const out = await sendCrisisAlert(77);
    expect(out).toEqual({ success: false, error: 'Failed to send notification via any channel' });
  });

  it('si el correo falla pero el push sale, la alerta cuenta como enviada', async () => {
    emailResult = { success: false, error: 'rebotó' };
    const fake = setup();
    const out = await sendCrisisAlert(77);
    expect(out.success).toBe(true);
    expect(out.notification.channels_sent).toEqual(['push']);
    expect(logs(fake)[0]).toMatchObject({ channel: 'email', status: 'failed' });
  });

  it('si el envío del correo lanza una excepción lo registra como fallido', async () => {
    emailResult = new Error('SMTP caído');
    const fake = setup({ prefs: { data: { email_enabled: true, push_enabled: false, sms_enabled: false }, error: null } });
    const out = await sendCrisisAlert(77);
    expect(out.success).toBe(false);
    expect(logs(fake)[0]).toMatchObject({ channel: 'email', status: 'failed', metadata: { error: 'SMTP caído' } });
  });

  it('si no hay preferencias guardadas usa las predeterminadas (correo y push)', async () => {
    setup({ prefs: { data: null, error: { code: 'PGRST116', message: 'sin fila' } } });
    const out = await sendCrisisAlert(77);
    expect(out.notification.channels_sent).toEqual(['email', 'push']);
  });

  it('si el padre no existe crea un registro mínimo y notifica', async () => {
    const fake = setup({ parent: null });
    const out = await sendCrisisAlert(77);
    const insert = fake.calls.find((c) => c.table === 'parents' && c.op === 'insert');
    expect(insert.args[0]).toEqual({ email: 'mama@correo.co', name: 'Parent of Ana' });
    expect(out.success).toBe(true);
    expect(out.notification.parent_id).toBe('pNew');
  });

  it('si no se puede crear el padre, falla con el motivo', async () => {
    setup({ parent: null, parentInsert: { data: null, error: { message: 'RLS' } } });
    const out = await sendCrisisAlert(77);
    expect(out.error).toMatch(/Failed to create parent record: RLS/);
  });
});

describe('correo de alerta: contenido del estudiante escapado', () => {
  const htmlOf = () => sent[0][2];

  it('un mensaje con HTML no se inyecta en el correo del padre', async () => {
    setup({
      crisis: alertRow({ detected_content: '<script>alert(1)</script><img src=x onerror=hack()>' }),
      stu: student({ name: '<b>Ana</b>' }),
    });
    await sendCrisisAlert(77);
    const html = htmlOf();
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<b>Ana</b>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('&lt;b&gt;Ana&lt;/b&gt;');
  });

  it('las comillas no rompen los atributos del enlace', async () => {
    setup({ crisis: alertRow({ id: '1" onmouseover="x' }) });
    await sendCrisisAlert('1');
    expect(htmlOf()).not.toContain('onmouseover="x');
    expect(htmlOf()).toContain('/alerts/1%22%20onmouseover%3D%22x');
  });

  it('el asunto no admite saltos de línea (inyección de cabeceras)', async () => {
    setup({ stu: student({ name: 'Ana\r\nBcc: otro@malo.co' }) });
    await sendCrisisAlert(77);
    expect(sent[0][1]).not.toMatch(/[\r\n]/);
    expect(sent[0][1]).toBe('Alerta: Ana Bcc: otro@malo.co necesita ayuda en IngenIA');
  });

  it('el color depende del nivel y el nivel también se escapa', async () => {
    setup({ crisis: alertRow({ crisis_level: 'medium' }) });
    await sendCrisisAlert(77);
    expect(htmlOf()).toContain('#FFA500');

    sent.length = 0;
    setup({ crisis: alertRow({ crisis_level: '<i>x</i>' }) });
    await sendCrisisAlert(77);
    expect(htmlOf()).toContain('&lt;i&gt;x&lt;/i&gt; Alerta');
    expect(htmlOf()).toContain('#FFB84D');
  });

  it('con datos faltantes usa textos de respaldo', async () => {
    setup({ crisis: alertRow({ detected_content: null }), stu: student({ name: null, age: null }) });
    await sendCrisisAlert(77);
    expect(sent[0][1]).toBe('Alerta: Your child necesita ayuda en IngenIA');
    expect(htmlOf()).toContain('Crisis alert detected');
    expect(htmlOf()).toContain('N/A años');
  });
});

describe('getParentPreferences y logNotification', () => {
  it('devuelve las preferencias guardadas', async () => {
    setup({ prefs: { data: { email_enabled: false, push_enabled: true, sms_enabled: true }, error: null } });
    expect(await getParentPreferences('p1')).toEqual({ email_enabled: false, push_enabled: true, sms_enabled: true });
  });

  it('sin fila usa los valores por defecto', async () => {
    setup({ prefs: { data: null, error: { code: 'PGRST116', message: 'x' } } });
    expect(await getParentPreferences('p1')).toEqual({
      email_enabled: true,
      push_enabled: true,
      sms_enabled: false,
      alert_frequency: 'immediate',
    });
  });

  it('ante un error de base devuelve los valores por defecto (la seguridad primero)', async () => {
    setup({ prefs: { data: null, error: { code: '500', message: 'caída' } } });
    const prefs = await getParentPreferences('p1');
    expect(prefs.email_enabled).toBe(true);
    expect(prefs.push_enabled).toBe(true);
  });

  it('logNotification guarda canal, estado y metadatos con la hora', async () => {
    const fake = setup();
    await logNotification('p1', 77, 'email', 'sent', { a: 1 });
    const row = logs(fake)[0];
    expect(row).toMatchObject({ parent_id: 'p1', crisis_alert_id: 77, channel: 'email', status: 'sent', metadata: { a: 1 } });
    expect(row.sent_at).toBeTruthy();
  });

  it('logNotification nunca lanza aunque falle la base', async () => {
    stub.use(createFakeSupabase({ notification_logs: { data: null, error: { message: 'x' } } }));
    await expect(logNotification('p1', 1, 'push', 'sent')).resolves.toBeUndefined();
    stub.use(createFakeSupabase({ notification_logs: new Error('boom') }));
    await expect(logNotification('p1', 1, 'push', 'sent')).resolves.toBeUndefined();
  });
});
