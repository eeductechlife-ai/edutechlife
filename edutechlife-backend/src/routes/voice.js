const { Router } = require('express');

const router = Router();

router.get('/token', async (req, res) => {
  try {
    const { GoogleAuth } = require('google-auth-library');

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.GOOGLE_CLIENT_EMAIL || !privateKey) {
      return res.status(500).json({ error: 'Google credentials not configured' });
    }

    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      }
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();
    res.json({ access_token: token });
  } catch (error) {
    console.error('Error generating Google token:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
