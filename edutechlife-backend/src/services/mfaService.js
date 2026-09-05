const { createHmac, randomBytes } = require('crypto');
const QRCode = require('qrcode');
const supabase = require('../db/supabase');

// ── TOTP implementation (RFC 6238 / RFC 4226) ──────────────────────────────

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(str) {
  let bits = 0;
  let value = 0;
  let output = [];
  for (const char of str.toUpperCase().replace(/=+$/, '')) {
    const idx = BASE32_CHARS.indexOf(char);
    if (idx === -1) throw new Error('Invalid base32 character: ' + char);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

function base32Encode(buf) {
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += BASE32_CHARS[(value << (5 - bits)) & 31];
  return output;
}

function generateTotpCode(secret, timeStep) {
  const keyBuf = base32Decode(secret);
  const counter = Buffer.alloc(8);
  // Write the 64-bit big-endian counter (time step)
  const hi = Math.floor(timeStep / 0x100000000);
  const lo = timeStep >>> 0;
  counter.writeUInt32BE(hi, 0);
  counter.writeUInt32BE(lo, 4);

  const hmac = createHmac('sha1', keyBuf).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    (((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)) %
    1000000;
  return String(code).padStart(6, '0');
}

function verifyTotpCode(token, secret, window = 1) {
  const now = Math.floor(Date.now() / 1000 / 30);
  for (let i = -window; i <= window; i++) {
    if (generateTotpCode(secret, now + i) === token) return true;
  }
  return false;
}

function generateSecret() {
  return base32Encode(randomBytes(20));
}

function buildOtpAuthUri(accountName, issuer, secret) {
  const label = encodeURIComponent(`${issuer}:${accountName}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

// ── Role gate ──────────────────────────────────────────────────────────────

const MFA_ROLES = ['admin', 'parent', 'educator'];
const CHALLENGE_TTL_MS = 5 * 60 * 1000;

function requiresMfa(userType) {
  return MFA_ROLES.includes(userType);
}

// ── DB helpers ─────────────────────────────────────────────────────────────

async function getMfaState(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('mfa_secret, mfa_enabled, user_type')
    .eq('id', userId)
    .single();
  if (error) throw new Error(`MFA state fetch failed: ${error.message}`);
  return data;
}

async function enroll(userId, userEmail) {
  const state = await getMfaState(userId);
  if (!requiresMfa(state.user_type)) {
    throw new Error('MFA solo está disponible para administradores, padres y educadores.');
  }

  const secret = generateSecret();
  const otpauth = buildOtpAuthUri(userEmail, 'EdutechLife', secret);
  const qrDataUrl = await QRCode.toDataURL(otpauth);

  const { error } = await supabase
    .from('users')
    .update({ mfa_secret: secret, mfa_enabled: false })
    .eq('id', userId);
  if (error) throw new Error(`MFA enroll failed: ${error.message}`);

  return { qrDataUrl, secret, otpauth };
}

async function verifySetup(userId, code) {
  const state = await getMfaState(userId);
  if (!state.mfa_secret) {
    throw new Error('No hay configuración MFA pendiente. Inicia el proceso de configuración.');
  }

  if (!verifyTotpCode(code, state.mfa_secret)) {
    throw new Error('Código incorrecto. Intenta de nuevo.');
  }

  const { error } = await supabase
    .from('users')
    .update({ mfa_enabled: true })
    .eq('id', userId);
  if (error) throw new Error(`MFA confirm failed: ${error.message}`);

  return { ok: true };
}

async function issueChallengeToken(userId) {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString();

  const { error } = await supabase
    .from('users')
    .update({ mfa_challenge_token: token, mfa_challenge_expires_at: expires })
    .eq('id', userId);
  if (error) throw new Error(`MFA challenge issue failed: ${error.message}`);

  return token;
}

async function verifyLoginChallenge(challengeToken, code) {
  const { data, error } = await supabase
    .from('users')
    .select('id, mfa_secret, mfa_challenge_token, mfa_challenge_expires_at')
    .eq('mfa_challenge_token', challengeToken)
    .maybeSingle();

  if (error) throw new Error(`MFA lookup failed: ${error.message}`);
  if (!data) throw new Error('Token MFA inválido o expirado.');

  if (new Date(data.mfa_challenge_expires_at) < new Date()) {
    throw new Error('El código MFA expiró. Inicia sesión de nuevo.');
  }

  if (!verifyTotpCode(code, data.mfa_secret)) {
    throw new Error('Código MFA incorrecto.');
  }

  // Clear challenge token (single use)
  await supabase
    .from('users')
    .update({ mfa_challenge_token: null, mfa_challenge_expires_at: null })
    .eq('id', data.id);

  return data.id;
}

async function disable(userId) {
  const { error } = await supabase
    .from('users')
    .update({
      mfa_secret: null,
      mfa_enabled: false,
      mfa_challenge_token: null,
      mfa_challenge_expires_at: null,
    })
    .eq('id', userId);
  if (error) throw new Error(`MFA disable failed: ${error.message}`);
  return { ok: true };
}

module.exports = {
  requiresMfa,
  enroll,
  verifySetup,
  issueChallengeToken,
  verifyLoginChallenge,
  disable,
};
