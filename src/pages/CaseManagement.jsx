import { useState, useRef } from 'react'
import { X, Upload, FileText, Download } from 'lucide-react'

const INSTALLMENT_FIELDS = [
  { field: 'loan_number', label: 'Loan account number', required: true },
  { field: 'customer_name', label: 'Borrower name', required: true },
  { field: 'amount_pending', label: 'Amount pending (₹)', required: true },
  { field: 'due_date', label: 'Due date', required: true },
  { field: 'mobile_number', label: 'Mobile number', required: true },
  { field: 'primary_address', label: 'Primary address', required: false },
  { field: 'city', label: 'City', required: false },
  { field: 'pin_code', label: 'PIN code', required: false },
  { field: 'gender', label: 'Gender', required: false },
  { field: 'pan', label: 'PAN', required: false },
]

const CASES = [
  { id: 'L-8821', name: 'Ramesh K.', cycle: 'SEP2026', channel: 'Digital', status: 'Read', statusStyle: { background: '#e6faf5', color: '#059669' }, date: '2 Oct 2026', canRetry: false },
  { id: 'L-8822', name: 'Priya S.', cycle: 'SEP2026', channel: 'Digital', status: 'Delivered', statusStyle: { background: '#e6faf5', color: '#059669' }, date: '1 Oct 2026', canRetry: false },
  { id: 'L-8823', name: 'Sanjay M.', cycle: 'SEP2026', channel: 'Physical', status: 'Dispatched', statusStyle: { background: '#f0eef7', color: '#332b46' }, date: '30 Sep 2026', canRetry: false },
  { id: 'L-8824', name: 'Anjali P.', cycle: 'SEP2026', channel: 'Physical', status: 'Not delivered', statusStyle: { background: '#ffedec', color: '#fb4d3d' }, date: '29 Sep 2026', canRetry: true },
  { id: 'L-9100', name: 'Kiran B.', cycle: 'SEP2026', channel: 'Physical', status: 'Generated', statusStyle: { background: '#fff4e5', color: '#d97706' }, date: '—', canRetry: false },
]

const HISTORY = {
  'L-8821': [
    { time: '2 Oct 2026, 14:03', event: 'Read', meta: 'WhatsApp · wamid.xyz' },
    { time: '1 Oct 2026, 10:14', event: 'Delivered', meta: 'WhatsApp · wamid.xyz' },
    { time: '1 Oct 2026, 10:12', event: 'Sent', meta: 'Campaign #4421 · Rohit M.' },
    { time: '30 Sep 2026, 18:40', event: 'Notice generated', meta: 'Legodesk · Section 138 — NACH bounce v2' },
    { time: '30 Sep 2026, 16:12', event: 'Batch uploaded', meta: 'Aditya R. · processId pxy_7731' },
  ],
  'L-8822': [
    { time: '1 Oct 2026, 10:14', event: 'Delivered', meta: 'WhatsApp · wamid.xyz' },
    { time: '1 Oct 2026, 10:12', event: 'Sent', meta: 'Campaign #4421 · Rohit M.' },
    { time: '30 Sep 2026, 18:41', event: 'Notice generated', meta: 'Legodesk · Section 138 — NACH bounce v2' },
    { time: '30 Sep 2026, 16:12', event: 'Batch uploaded', meta: 'Aditya R. · processId pxy_7731' },
  ],
  'L-8823': [
    { time: '30 Sep 2026, 09:00', event: 'Dispatched (Speed Post)', meta: 'Consignment #SP8823IN' },
    { time: '30 Sep 2026, 18:42', event: 'Notice generated', meta: 'Legodesk · Section 138 — NACH bounce v2' },
    { time: '30 Sep 2026, 16:12', event: 'Batch uploaded', meta: 'Aditya R. · processId pxy_7731' },
  ],
  'L-8824': [
    { time: '29 Sep 2026, 14:00', event: 'Not delivered — returned', meta: 'Consignment #SP8824IN · Address incomplete' },
    { time: '28 Sep 2026, 09:00', event: 'Dispatched (Speed Post)', meta: 'Consignment #SP8824IN' },
    { time: '27 Sep 2026, 18:44', event: 'Notice generated', meta: 'Legodesk · Section 138 — NACH bounce v2' },
    { time: '27 Sep 2026, 16:12', event: 'Batch uploaded', meta: 'Aditya R. · processId pxy_7731' },
  ],
  'L-9100': [
    { time: '14 Oct 2026, 11:30', event: 'Notice generated', meta: 'Legodesk · Section 138 — NACH bounce v2' },
    { time: '14 Oct 2026, 10:00', event: 'Batch uploaded', meta: 'Aditya R. · processId pxy_9200' },
  ],
}

const card = { background: 'white', border: '1px solid #e6e4ef', borderRadius: 12, boxShadow: '0 1px 2px rgba(18,1,47,0.04)' }
const th = { fontSize: 11, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, padding: '10px 16px', borderBottom: '1px solid #e6e4ef', textAlign: 'left' }

const Chip = ({ children, style }) => (
  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 500, ...style }}>{children}</span>
)

export default function CaseManagement() {
  const [drawer, setDrawer] = useState(null)
  const [modal, setModal] = useState(false)
  const [caseSource, setCaseSource] = useState('portfolio') // 'portfolio' | 'csv'
  const [csvFile, setCsvFile] = useState(null)
  const [csvDragging, setCsvDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileDrop = (e) => {
    e.preventDefault()
    setCsvDragging(false)
    const file = e.dataTransfer?.files[0] || e.target.files[0]
    if (file) setCsvFile(file)
  }

  return (
    <div style={{ padding: '32px', maxWidth: 1040, position: 'relative' }}>

      {/* Case list */}
      <div style={card}>
        {/* Filters */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #e6e4ef', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {['Cycle: Sep 2026', 'Status: All', 'Channel: All'].map(f => (
            <div key={f} style={{ border: '1px solid #e6e4ef', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#332b46', display: 'flex', alignItems: 'center', gap: 4, cursor: 'default' }}>
              {f} <span style={{ color: '#a5a1b3', marginLeft: 2 }}>▾</span>
            </div>
          ))}
          <input
            placeholder="Search loan ID or borrower…"
            readOnly
            style={{ border: '1px solid #e6e4ef', borderRadius: 8, padding: '6px 12px', fontSize: 13, flex: 1, minWidth: 180, outline: 'none', color: '#a5a1b3' }}
          />
          <button onClick={() => setModal(true)} style={{ background: '#675af9', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
            + Create notice batch
          </button>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Loan ID', 'Borrower', 'Cycle', 'Channel', 'Notice status', 'Date served', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {CASES.map((c, i) => {
              const active = drawer === c.id
              return (
                <tr key={c.id}
                  style={{ background: active ? '#f1f0ff' : 'white', transition: 'background 0.1s' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#fafaff' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? '#f1f0ff' : 'white' }}
                >
                  <td style={{ padding: '12px 16px', borderBottom: i === CASES.length - 1 ? 'none' : '1px solid #e6e4ef', fontSize: 13 }}>
                    <code style={{ background: '#f5f4f9', padding: '2px 7px', borderRadius: 4, fontSize: 11 }}>{c.id}</code>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: i === CASES.length - 1 ? 'none' : '1px solid #e6e4ef', fontSize: 13, fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '12px 16px', borderBottom: i === CASES.length - 1 ? 'none' : '1px solid #e6e4ef', fontSize: 13 }}>
                    <code style={{ background: '#f5f4f9', padding: '2px 7px', borderRadius: 4, fontSize: 11 }}>{c.cycle}</code>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: i === CASES.length - 1 ? 'none' : '1px solid #e6e4ef', fontSize: 13 }}>
                    <Chip style={{ background: '#f0eef7', color: '#332b46' }}>{c.channel}</Chip>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: i === CASES.length - 1 ? 'none' : '1px solid #e6e4ef', fontSize: 13 }}>
                    <Chip style={c.statusStyle}>{c.status}</Chip>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: i === CASES.length - 1 ? 'none' : '1px solid #e6e4ef', fontSize: 12, color: '#6b6580' }}>{c.date}</td>
                  <td style={{ padding: '12px 16px', borderBottom: i === CASES.length - 1 ? 'none' : '1px solid #e6e4ef', fontSize: 12, display: 'flex', gap: 12 }}>
                    {c.canRetry && <button style={{ color: '#fb4d3d', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0 }}>Retry</button>}
                    <button
                      onClick={() => setDrawer(drawer === c.id ? null : c.id)}
                      style={{ color: '#675af9', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0 }}
                    >
                      {drawer === c.id ? 'Close ×' : 'History'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid #e6e4ef', display: 'flex', alignItems: 'center', fontSize: 12, color: '#6b6580' }}>
          Showing 5 of 2,366 cases
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {['← Prev', 'Next →'].map(l => (
              <button key={l} style={{ background: '#f0eef7', color: '#332b46', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* History drawer */}
      {drawer && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setDrawer(null)} />
          <div style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: 380, background: 'white', boxShadow: '-4px 0 24px rgba(18,1,47,0.12)', borderLeft: '2px solid #675af9', zIndex: 40, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e4ef', background: '#f1f0ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Notice history</div>
                <div style={{ fontSize: 12, color: '#6b6580', marginTop: 2 }}>{CASES.find(c => c.id === drawer)?.name} · {drawer}</div>
              </div>
              <button onClick={() => setDrawer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6580', display: 'flex' }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 20px 36px', borderLeft: '2px solid #e6e4ef', marginLeft: 20 }}>
              {(HISTORY[drawer] || HISTORY['L-8821']).map((h, i) => (
                <div key={i} style={{ position: 'relative', paddingBottom: 20 }}>
                  <div style={{ position: 'absolute', left: -29, top: 4, width: 10, height: 10, borderRadius: '50%', background: '#675af9', border: '2px solid white', boxShadow: '0 0 0 2px #675af9' }} />
                  <div style={{ fontSize: 11, color: '#a5a1b3', marginBottom: 2 }}>{h.time}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{h.event}</div>
                  <div style={{ fontSize: 12, color: '#6b6580', marginTop: 2 }}>{h.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Create batch modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,1,47,0.2)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => { setModal(false); setCsvFile(null); setCaseSource('portfolio') }}>
          <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 8px 40px rgba(18,1,47,0.15)', width: 700, maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e6e4ef' }} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #e6e4ef', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Create legal notice batch</span>
              <button onClick={() => { setModal(false); setCsvFile(null); setCaseSource('portfolio') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6580', display: 'flex' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Batch config */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Cycle', 'SEPTEMBER2026'], ['Channel', 'Digital ▾'], ['Template', 'Section 138 — NACH bounce v2 ▾']].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 12, color: '#6b6580', marginBottom: 4 }}>{label}</div>
                    <div style={{ border: '1px solid #e6e4ef', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#332b46' }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Case source toggle */}
              <div>
                <div style={{ fontSize: 12, color: '#6b6580', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>How would you like to add cases?</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[['portfolio', '📋', 'Select from portfolio', 'Pick eligible cases from the current allocation'], ['csv', '📤', 'Upload CSV', 'Bulk upload a list of loan accounts']].map(([id, icon, title, desc]) => (
                    <button key={id} onClick={() => { setCaseSource(id); setCsvFile(null) }}
                      style={{ border: `2px solid ${caseSource === id ? '#675af9' : '#e6e4ef'}`, borderRadius: 10, padding: '12px 14px', background: caseSource === id ? '#f1f0ff' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: caseSource === id ? '#675af9' : '#12012f' }}>{title}</div>
                      <div style={{ fontSize: 12, color: '#6b6580', marginTop: 2 }}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Portfolio source */}
              {caseSource === 'portfolio' && (
                <div style={{ background: '#fafaff', border: '1px solid #e6e4ef', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Case summary</div>
                  {[['Cases selected', '1,247', '#12012f', false], ['✓ Eligible', '1,183', '#059669', true], ['✗ On DNC', '42', '#6b6580', false], ['✗ Already noticed this cycle', '22', '#6b6580', false]].map(([l, v, c, bold]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: 13, color: c, borderBottom: '1px dashed #e6e4ef' }}>
                      <span style={{ fontWeight: bold ? 600 : 400 }}>{l}</span>
                      <span style={{ fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Fields pulled from installments</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {INSTALLMENT_FIELDS.map(f => (
                        <span key={f.field} style={{ background: f.required ? '#f1f0ff' : '#f5f4f9', color: f.required ? '#675af9' : '#6b6580', fontSize: 11, padding: '3px 9px', borderRadius: 999, fontWeight: 500, border: f.required ? '1px solid #d4cffc' : '1px solid #e6e4ef' }}>
                          {f.field}{f.required ? ' *' : ''}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: '#a5a1b3', marginTop: 8 }}>* Required fields for notice generation</div>
                  </div>
                </div>
              )}

              {/* CSV source */}
              {caseSource === 'csv' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Drop zone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setCsvDragging(true) }}
                    onDragLeave={() => setCsvDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border: `2px dashed ${csvDragging ? '#675af9' : csvFile ? '#08ca97' : '#e6e4ef'}`, borderRadius: 12, padding: '28px 20px', textAlign: 'center', background: csvDragging ? '#f1f0ff' : csvFile ? '#e6faf5' : '#fafaff', cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileDrop} />
                    {csvFile ? (
                      <>
                        <FileText size={28} color="#08ca97" style={{ margin: '0 auto 8px' }} />
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#059669' }}>{csvFile.name}</div>
                        <div style={{ fontSize: 12, color: '#6b6580', marginTop: 4 }}>{(csvFile.size / 1024).toFixed(1)} KB · Click to replace</div>
                      </>
                    ) : (
                      <>
                        <Upload size={28} color="#a5a1b3" style={{ margin: '0 auto 8px' }} />
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#332b46' }}>Drop your CSV here, or click to browse</div>
                        <div style={{ fontSize: 12, color: '#6b6580', marginTop: 4 }}>One row per case. Max 10,000 rows.</div>
                      </>
                    )}
                  </div>

                  {/* Expected columns */}
                  <div style={{ background: '#fafaff', border: '1px solid #e6e4ef', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Expected CSV columns</div>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1px solid #e6e4ef', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#675af9', cursor: 'pointer' }}>
                        <Download size={11} /> Download template
                      </button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e6e4ef' }}>
                          <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6b6580', fontWeight: 600, fontSize: 11 }}>Column name</th>
                          <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6b6580', fontWeight: 600, fontSize: 11 }}>Description</th>
                          <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6b6580', fontWeight: 600, fontSize: 11 }}>Required</th>
                        </tr>
                      </thead>
                      <tbody>
                        {INSTALLMENT_FIELDS.map((f, i) => (
                          <tr key={f.field} style={{ borderBottom: i < INSTALLMENT_FIELDS.length - 1 ? '1px dashed #e6e4ef' : 'none' }}>
                            <td style={{ padding: '6px 8px' }}><code style={{ background: '#f5f4f9', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>{f.field}</code></td>
                            <td style={{ padding: '6px 8px', color: '#6b6580' }}>{f.label}</td>
                            <td style={{ padding: '6px 8px' }}>
                              {f.required
                                ? <span style={{ color: '#675af9', fontWeight: 600, fontSize: 11 }}>Required</span>
                                : <span style={{ color: '#a5a1b3', fontSize: 11 }}>Optional</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 22px', borderTop: '1px solid #e6e4ef', display: 'flex', justifyContent: 'flex-end', gap: 8, position: 'sticky', bottom: 0, background: 'white' }}>
              <button onClick={() => { setModal(false); setCsvFile(null); setCaseSource('portfolio') }} style={{ background: '#f0eef7', color: '#332b46', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button style={{ background: caseSource === 'csv' && !csvFile ? '#d4cffc' : '#675af9', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: caseSource === 'csv' && !csvFile ? 'not-allowed' : 'pointer' }}>
                Create batch →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
