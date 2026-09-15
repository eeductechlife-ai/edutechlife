import { describe, test, expect } from 'vitest';
import { jsPDF } from 'jspdf';
import {
  drawCertificate,
  buildVerifyUrl,
  fitFontSize,
  INSTITUTIONS,
  PAGE,
} from '../certificatePdf';

const STRINGS = {
  title: 'Certificado de Aprobación',
  endorsement: 'Programa avalado por las siguientes entidades',
  awardedTo: 'Se otorga el presente certificado a',
  body: 'Por haber cursado y aprobado satisfactoriamente los 5 módulos del programa.',
  scanToVerify: 'Escanee para verificar',
  issueDate: 'Fecha de emisión',
  certNumber: 'Nº de certificado',
  modality: 'Modalidad',
  modalityValue: 'Virtual · 5 módulos',
  sealTop: 'CERTIFICADO',
  sealBottom: 'VERIFICADO',
  footer: 'edutechlife.co · Documento digital con verificación en línea',
};

const newDoc = () => new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

const build = (overrides = {}) => {
  const doc = newDoc();
  drawCertificate(doc, {
    studentName: 'María Fernanda Ospina',
    certNumber: 'EDL-2026-004182',
    issuedDate: '15 de septiembre de 2026',
    courseName: 'Introducción a la Inteligencia Artificial Generativa',
    verifyUrl: buildVerifyUrl('EDL-2026-004182'),
    qrMatrix: Array.from({ length: 25 }, (_, r) =>
      Array.from({ length: 25 }, (_, c) => (r + c) % 2 === 0),
    ),
    images: {},
    signatures: [
      { name: 'Dirección Académica', role: 'Edutechlife' },
      { name: 'Coordinación del Programa', role: 'Alcaldía de Manizales' },
    ],
    strings: STRINGS,
    ...overrides,
  });
  return doc;
};

describe('buildVerifyUrl', () => {
  test('builds an https verification url on the canonical domain', () => {
    expect(buildVerifyUrl('EDL-2026-000001')).toBe(
      'https://edutechlife.co/verificar/EDL-2026-000001',
    );
  });

  test('escapes the certificate number', () => {
    expect(buildVerifyUrl('EDL 2026/1')).toBe('https://edutechlife.co/verificar/EDL%202026%2F1');
  });
});

describe('fitFontSize', () => {
  test('keeps the maximum size when the text already fits', () => {
    expect(fitFontSize(newDoc(), 'Ana', 200, 30)).toBe(30);
  });

  test('shrinks a long name so it stays inside the certificate', () => {
    const doc = newDoc();
    const name = 'Juan Sebastián de la Concepción Villalobos Restrepo';
    const size = fitFontSize(doc, name, 200, 30, 14);
    expect(size).toBeLessThan(30);
    doc.setFontSize(size);
    expect(doc.getTextWidth(name)).toBeLessThanOrEqual(200);
  });

  test('never goes below the minimum size', () => {
    expect(fitFontSize(newDoc(), 'x'.repeat(500), 50, 30, 14)).toBe(14);
  });
});

describe('drawCertificate', () => {
  test('produces an A4 landscape page', () => {
    const doc = build();
    expect(doc.internal.pageSize.getWidth()).toBeCloseTo(PAGE.W, 0);
    expect(doc.internal.pageSize.getHeight()).toBeCloseTo(PAGE.H, 0);
  });

  test('writes the certificate data into the pdf', () => {
    const raw = build().output();
    expect(raw).toContain('%PDF');
    expect(raw.length).toBeGreaterThan(1000);
  });

  test('renders without images, signatures or qr', () => {
    expect(() =>
      build({ images: undefined, signatures: [], qrMatrix: null }),
    ).not.toThrow();
  });

  test('never leaves letter spacing applied to the next drawing', () => {
    const doc = build();
    expect(doc.getCharSpace()).toBe(0);
  });

  test('sets text colour with three channels only (4 args would mean CMYK)', () => {
    const doc = newDoc();
    const calls = [];
    const original = doc.setTextColor.bind(doc);
    doc.setTextColor = (...args) => {
      calls.push(args.length);
      return original(...args);
    };
    drawCertificate(doc, {
      studentName: 'Ana',
      certNumber: 'EDL-2026-1',
      issuedDate: 'hoy',
      courseName: 'Curso',
      verifyUrl: 'https://edutechlife.co/verificar/EDL-2026-1',
      qrMatrix: null,
      images: {},
      signatures: [],
      strings: STRINGS,
    });
    expect(calls.length).toBeGreaterThan(0);
    expect(calls.every((n) => n === 3)).toBe(true);
  });
});

describe('INSTITUTIONS', () => {
  test('endorses MinTIC, Alcaldía de Manizales and Edutechlife, with Edutechlife centered', () => {
    expect(INSTITUTIONS.map((i) => i.id)).toEqual(['mintic', 'edutechlife', 'manizales']);
  });

  test('every institution declares a logo path and a display name', () => {
    INSTITUTIONS.forEach((inst) => {
      expect(inst.logo).toMatch(/^\/images\//);
      expect(inst.full.length).toBeGreaterThan(0);
    });
  });
});
