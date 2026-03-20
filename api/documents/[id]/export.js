export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' });

  const { id } = req.query;
  const { format } = req.body || {};

  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=klerifi_${id}.csv`);
    return res.status(200).send(
      'field_name,field_value,field_type,confidence\n' +
      'invoice_number,INV-2024-00847,reference_number,0.99\n' +
      'invoice_date,2024-03-15,date,0.98\n' +
      'vendor_name,NAM Logistics (Pty) Ltd,text,0.99\n' +
      'total_amount,NAD 14317.50,currency,0.99\n'
    );
  }

  // JSON export
  return res.status(200).json({
    document_id: id,
    exported_at: new Date().toISOString(),
    format: 'json',
    data: {
      invoice_number: 'INV-2024-00847',
      invoice_date: '2024-03-15',
      vendor_name: 'NAM Logistics (Pty) Ltd',
      total_amount: 'NAD 14,317.50'
    }
  });
}
