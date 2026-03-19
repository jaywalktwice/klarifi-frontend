export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ detail: 'Email and password required' });
  }

  // Mock signup - always succeeds
  return res.status(200).json({
    access_token: 'demo_token_' + Date.now(),
    user_id: 'user_' + Math.random().toString(36).substr(2, 9),
    email: email,
    message: 'Account created successfully (demo mode)'
  });
}
