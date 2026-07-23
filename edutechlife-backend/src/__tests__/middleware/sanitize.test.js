const sanitizeMiddleware = require('../../middleware/sanitize');

describe('sanitizeMiddleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {}, query: {} };
    res = {};
    next = vi.fn();
  });

  it('sanitizes req.body when it exists', () => {
    req.body = { name: '<script>alert(1)</script>' };
    sanitizeMiddleware(req, res, next);
    expect(req.body.name).toBe('');
    expect(next).toHaveBeenCalled();
  });

  it('sanitizes string query params', () => {
    req.query = { search: '<script>bad()</script>', page: '2' };
    sanitizeMiddleware(req, res, next);
    expect(req.query.search).toBe('');
    expect(req.query.page).toBe('2');
    expect(next).toHaveBeenCalled();
  });

  it('handles missing body', () => {
    req.body = null;
    sanitizeMiddleware(req, res, next);
    expect(req.body).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  it('handles missing query', () => {
    req.query = null;
    sanitizeMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('preserves non-string query values', () => {
    req.query = { count: 42, flag: true };
    sanitizeMiddleware(req, res, next);
    expect(req.query.count).toBe(42);
    expect(req.query.flag).toBe(true);
    expect(next).toHaveBeenCalled();
  });
});
