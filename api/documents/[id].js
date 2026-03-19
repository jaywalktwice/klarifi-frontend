const DEMO_DOCUMENTS = {
  doc_001: {
    id: 'doc_001',
    filename: 'Invoice_NAM_Logistics_2024.pdf',
    doc_type: 'invoice',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    extraction: {
      overall_confidence: 0.96,
      page_count: 2,
      processing_time_ms: 3420,
      fields: [
        { field_name: 'invoice_number', field_value: 'INV-2024-00847', field_type: 'reference_number', confidence: 0.99 },
        { field_name: 'invoice_date', field_value: '2024-03-15', field_type: 'date', confidence: 0.98 },
        { field_name: 'due_date', field_value: '2024-04-15', field_type: 'date', confidence: 0.97 },
        { field_name: 'vendor_name', field_value: 'NAM Logistics (Pty) Ltd', field_type: 'text', confidence: 0.99 },
        { field_name: 'vendor_address', field_value: '42 Independence Ave, Windhoek, Namibia', field_type: 'address', confidence: 0.94 },
        { field_name: 'vendor_phone', field_value: '+264 61 234 5678', field_type: 'phone', confidence: 0.96 },
        { field_name: 'vendor_email', field_value: 'billing@namlogistics.com.na', field_type: 'email', confidence: 0.98 },
        { field_name: 'subtotal', field_value: 'NAD 12,450.00', field_type: 'currency', confidence: 0.97 },
        { field_name: 'vat_rate', field_value: '15%', field_type: 'percentage', confidence: 0.99 },
        { field_name: 'vat_amount', field_value: 'NAD 1,867.50', field_type: 'currency', confidence: 0.96 },
        { field_name: 'total_amount', field_value: 'NAD 14,317.50', field_type: 'currency', confidence: 0.99 },
        { field_name: 'payment_terms', field_value: 'Net 30', field_type: 'text', confidence: 0.91 },
      ]
    }
  },
  doc_002: {
    id: 'doc_002',
    filename: 'Customs_Declaration_WB2024.pdf',
    doc_type: 'customs_declaration',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    extraction: {
      overall_confidence: 0.91,
      page_count: 1,
      processing_time_ms: 5180,
      fields: [
        { field_name: 'declaration_number', field_value: 'CD-WB-2024-003291', field_type: 'reference_number', confidence: 0.98 },
        { field_name: 'declaration_date', field_value: '2024-03-12', field_type: 'date', confidence: 0.97 },
        { field_name: 'importer_name', field_value: 'Klarifi Technologies (Pty) Ltd', field_type: 'text', confidence: 0.96 },
        { field_name: 'importer_address', field_value: '18 Mandume Ndemufayo Ave, Windhoek', field_type: 'address', confidence: 0.89 },
        { field_name: 'country_of_origin', field_value: 'South Africa', field_type: 'text', confidence: 0.99 },
        { field_name: 'port_of_entry', field_value: 'Walvis Bay', field_type: 'text', confidence: 0.97 },
        { field_name: 'hs_code', field_value: '8471.30.00', field_type: 'reference_number', confidence: 0.92 },
        { field_name: 'goods_description', field_value: 'Portable digital automatic data processing machines (laptops)', field_type: 'text', confidence: 0.94 },
        { field_name: 'quantity', field_value: '25 units', field_type: 'number', confidence: 0.98 },
        { field_name: 'declared_value', field_value: 'NAD 187,500.00', field_type: 'currency', confidence: 0.95 },
        { field_name: 'duty_rate', field_value: '0%', field_type: 'percentage', confidence: 0.88 },
        { field_name: 'vat_payable', field_value: 'NAD 28,125.00', field_type: 'currency', confidence: 0.93 },
        { field_name: 'clearing_agent', field_value: 'Swift Customs Brokers', field_type: 'text', confidence: 0.91 },
        { field_name: 'vessel_name', field_value: 'MSC Namibia', field_type: 'text', confidence: 0.85 },
      ]
    }
  },
  doc_003: {
    id: 'doc_003',
    filename: 'Bank_Statement_March.pdf',
    doc_type: 'bank_statement',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    extraction: {
      overall_confidence: 0.93,
      page_count: 3,
      processing_time_ms: 7250,
      fields: [
        { field_name: 'bank_name', field_value: 'First National Bank Namibia', field_type: 'text', confidence: 0.99 },
        { field_name: 'account_holder', field_value: 'Klarifi Technologies (Pty) Ltd', field_type: 'text', confidence: 0.98 },
        { field_name: 'account_number', field_value: '62XXXXXXX847', field_type: 'reference_number', confidence: 0.97 },
        { field_name: 'statement_period', field_value: '01 Mar 2024 - 31 Mar 2024', field_type: 'date', confidence: 0.96 },
        { field_name: 'opening_balance', field_value: 'NAD 342,891.45', field_type: 'currency', confidence: 0.95 },
        { field_name: 'total_credits', field_value: 'NAD 89,750.00', field_type: 'currency', confidence: 0.94 },
        { field_name: 'total_debits', field_value: 'NAD 67,234.18', field_type: 'currency', confidence: 0.93 },
        { field_name: 'closing_balance', field_value: 'NAD 365,407.27', field_type: 'currency', confidence: 0.96 },
        { field_name: 'number_of_transactions', field_value: '47', field_type: 'number', confidence: 0.91 },
      ]
    }
  },
  doc_005: {
    id: 'doc_005',
    filename: 'Receipt_Office_Supplies.jpg',
    doc_type: 'invoice',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    extraction: {
      overall_confidence: 0.88,
      page_count: 1,
      processing_time_ms: 2100,
      fields: [
        { field_name: 'store_name', field_value: 'Waltons Windhoek', field_type: 'text', confidence: 0.97 },
        { field_name: 'receipt_date', field_value: '2024-03-10', field_type: 'date', confidence: 0.95 },
        { field_name: 'receipt_number', field_value: 'RCP-78432', field_type: 'reference_number', confidence: 0.92 },
        { field_name: 'total_amount', field_value: 'NAD 2,340.00', field_type: 'currency', confidence: 0.96 },
        { field_name: 'vat_amount', field_value: 'NAD 304.35', field_type: 'currency', confidence: 0.89 },
        { field_name: 'payment_method', field_value: 'Business Card ****4921', field_type: 'text', confidence: 0.78 },
      ]
    }
  }
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const doc = DEMO_DOCUMENTS[id];

  if (!doc) {
    return res.status(404).json({ detail: 'Document not found' });
  }

  return res.status(200).json(doc);
}
