export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' });

  // Simulate a ~2 second processing delay
  return res.status(200).json({
    id: 'doc_new_' + Date.now(),
    filename: 'uploaded_document.pdf',
    doc_type: 'invoice',
    status: 'completed',
    message: 'Document processed successfully (demo mode)',
    fields_extracted: 12,
    confidence: 0.94
  });
}
