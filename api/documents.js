export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Return a list of demo documents
  const now = new Date();
  return res.status(200).json({
    documents: [
      {
        id: 'doc_001',
        filename: 'Invoice_NAM_Logistics_2024.pdf',
        doc_type: 'invoice',
        status: 'completed',
        created_at: new Date(now - 1000 * 60 * 5).toISOString(),
        page_count: 2
      },
      {
        id: 'doc_002',
        filename: 'Customs_Declaration_WB2024.pdf',
        doc_type: 'customs_declaration',
        status: 'completed',
        created_at: new Date(now - 1000 * 60 * 30).toISOString(),
        page_count: 1
      },
      {
        id: 'doc_003',
        filename: 'Bank_Statement_March.pdf',
        doc_type: 'bank_statement',
        status: 'completed',
        created_at: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
        page_count: 3
      },
      {
        id: 'doc_004',
        filename: 'Service_Contract_2024.pdf',
        doc_type: 'contract',
        status: 'needs_review',
        created_at: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
        page_count: 5
      },
      {
        id: 'doc_005',
        filename: 'Receipt_Office_Supplies.jpg',
        doc_type: 'invoice',
        status: 'completed',
        created_at: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
        page_count: 1
      }
    ]
  });
}
