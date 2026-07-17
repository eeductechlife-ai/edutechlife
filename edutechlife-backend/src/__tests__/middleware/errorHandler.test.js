
const { errorHandler, notFoundHandler } = require('../../middleware/errorHandler');

describe('errorHandler', () => {
  let req, res;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    req = { headers: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('returns 403 for CORS errors', () => {
    const err = new Error('Origen no permitido');
    errorHandler(err, req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Origen no permitido' });
  });

  it('returns 413 for entity too large', () => {
    const err = new Error('Request too large');
    err.type = 'entity.too.large';
    errorHandler(err, req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(413);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El cuerpo de la solicitud es demasiado grande',
    });
  });

  it('returns 500 for unknown errors', () => {
    const err = new Error('Something broke');
    errorHandler(err, req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
      requestId: null,
    });
  });

  it('returns custom status when err.status is set', () => {
    const err = new Error('Custom error');
    err.status = 429;
    errorHandler(err, req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(429);
  });

  it('includes requestId from header', () => {
    req.headers['x-request-id'] = 'req-abc-123';
    const err = new Error('Something broke');
    errorHandler(err, req, res, vi.fn());
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: 'req-abc-123' })
    );
  });
});

describe('notFoundHandler', () => {
  it('returns 404 with method and originalUrl', () => {
    const req = { method: 'POST', originalUrl: '/api/nonexistent' };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    notFoundHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Ruta no encontrada: POST /api/nonexistent',
    });
  });
});
