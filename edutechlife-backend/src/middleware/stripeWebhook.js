function stripeWebhookMiddleware(req, res, next) {
  if (req.path === '/api/stripe/webhook' && req.method === 'POST') {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  } else {
    next();
  }
}

module.exports = { stripeWebhookMiddleware };
