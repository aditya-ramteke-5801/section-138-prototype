import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'

const TEMPLATES = [
  { name: 'Section 138 — NACH bounce', category: 'SECTION_138', lang: 'en_IN', version: 'v2', status: 'Approved', statusStyle: { background: '#e6faf5', color: '#059669' }, approved: 'legal@acre.in', updated: '12 Sep 2026', dim: false },
  { name: 'Section 138 — NACH bounce', category: 'SECTION_138', lang: 'en_IN', version: 'v1', status: 'Retired', statusStyle: { background: '#f0eef7', color: '#6b6580' }, approved: 'legal@acre.in', updated: '05 Aug 2026', dim: true },
  { name: 'Section 138 — Hindi', category: 'SECTION_138', lang: 'hi', version: 'v1', status: 'Approved', statusStyle: { background: '#e6faf5', color: '#059669' }, approved: 'legal@acre.in', updated: '05 Aug 2026', dim: false },
  { name: 'Arbitration demand', category: 'ARBITRATION', lang: 'en_IN', version: 'v1', status: 'Draft', statusStyle: { background: '#fff4e5', color: '#d97706' }, approved: '—', updated: 'today', dim: false },
]

const card = { background: 'white', border: '1px solid #e6e4ef', borderRadius: 12, boxShadow: '0 1px 2px rgba(18,1,47,0.04)' }
const th = { fontSize: 11, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, padding: '10px 14px', borderBottom: '1px solid #e6e4ef', textAlign: 'left' }
const td = (last) => ({ padding: '11px 14px', borderBottom: last ? 'none' : '1px solid #e6e4ef', fontSize: 13 })

const Field = ({ label, children }) => (
  <div>
    <div style={{ fontSize: 12, color: '#6b6580', marginBottom: 4 }}>{label}</div>
    {children}
  </div>
)

const Input = ({ value, mono, masked }) => (
  <div style={{ border: '1px solid #e6e4ef', borderRadius: 8, padding: '8px 12px', fontSize: mono ? 12 : 13, fontFamily: mono ? 'monospace' : 'inherit', color: masked ? '#a5a1b3' : '#332b46', letterSpacing: masked ? 3 : 'normal', background: 'white' }}>
    {value}
  </div>
)

const SelectInput = ({ value }) => (
  <div style={{ border: '1px solid #e6e4ef', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#332b46', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
    {value} <span style={{ color: '#a5a1b3' }}>▾</span>
  </div>
)

export default function Settings() {
  const [tab, setTab] = useState('credentials')
  const [copied, setCopied] = useState(false)
  const [uploadModal, setUploadModal] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ padding: '32px', maxWidth: 800 }}>

      {/* Sub-nav */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e6e4ef', marginBottom: 24 }}>
        {[['credentials', 'Legodesk credentials'], ['templates', 'Templates']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: '10px 20px', fontSize: 13, fontWeight: tab === id ? 600 : 400,
              color: tab === id ? '#675af9' : '#6b6580', background: 'none', border: 'none',
              borderBottom: tab === id ? '2px solid #675af9' : '2px solid transparent',
              marginBottom: -2, cursor: 'pointer', transition: 'color 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---- Credentials tab ---- */}
      {tab === 'credentials' && (
        <div style={card}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e6e4ef', fontWeight: 600, fontSize: 14 }}>Legodesk API credentials</div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Provider"><SelectInput value="Legodesk" /></Field>
              <Field label="API base URL"><Input value="https://api.legodesk.com/case/rest" mono /></Field>
              <Field label="Auth token">
                <Input value="••••••••••••••••••••" masked />
                <div style={{ fontSize: 11, color: '#a5a1b3', marginTop: 4 }}>Bearer token issued by Legodesk</div>
              </Field>
              <Field label="Status">
                <span style={{ background: '#e6faf5', color: '#059669', fontSize: 12, padding: '4px 12px', borderRadius: 999, fontWeight: 500 }}>Connected</span>
              </Field>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Webhook / callback URL">
                <div style={{ background: '#fafaff', border: '1px solid #e6e4ef', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontFamily: 'monospace', color: '#6b6580' }}>
                  https://api.dpdzero.com/section138/callback
                </div>
                <button onClick={handleCopy} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, background: '#f0eef7', color: '#332b46', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  {copied ? <><Check size={12} color="#059669" /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </Field>
            </div>
          </div>
          <div style={{ padding: '0 20px 20px', display: 'flex', gap: 8 }}>
            <button style={{ background: '#675af9', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
            <button style={{ background: 'none', color: '#675af9', border: '1px solid #675af9', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Test connection</button>
          </div>
        </div>
      )}

      {/* ---- Templates tab ---- */}
      {tab === 'templates' && (
        <div style={card}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #e6e4ef', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Notice templates</span>
            <button onClick={() => setUploadModal(true)} style={{ marginLeft: 'auto', background: '#675af9', color: 'white', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Upload template</button>
          </div>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #e6e4ef', display: 'flex', gap: 10 }}>
            {['Category: All', 'Status: All'].map(f => (
              <div key={f} style={{ border: '1px solid #e6e4ef', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#332b46', display: 'flex', alignItems: 'center', gap: 4, cursor: 'default' }}>
                {f} <span style={{ color: '#a5a1b3' }}>▾</span>
              </div>
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name', 'Category', 'Lang', 'Ver', 'Status', 'Approved by', 'Updated', ''].map(h => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {TEMPLATES.map((t, i) => (
                <tr key={i} style={{ opacity: t.dim ? 0.45 : 1 }}
                  onMouseEnter={e => { if (!t.dim) e.currentTarget.style.background = '#fafaff' }}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <td style={td(i === TEMPLATES.length - 1)}><span style={{ fontWeight: t.dim ? 400 : 500 }}>{t.name}</span></td>
                  <td style={td(i === TEMPLATES.length - 1)}><code style={{ background: '#f5f4f9', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>{t.category}</code></td>
                  <td style={{ ...td(i === TEMPLATES.length - 1), color: '#6b6580' }}>{t.lang}</td>
                  <td style={{ ...td(i === TEMPLATES.length - 1), color: '#6b6580' }}>{t.version}</td>
                  <td style={td(i === TEMPLATES.length - 1)}><span style={{ ...t.statusStyle, fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>{t.status}</span></td>
                  <td style={{ ...td(i === TEMPLATES.length - 1), fontSize: 12, color: '#6b6580' }}>{t.approved}</td>
                  <td style={{ ...td(i === TEMPLATES.length - 1), fontSize: 12, color: '#6b6580' }}>{t.updated}</td>
                  <td style={{ ...td(i === TEMPLATES.length - 1), color: '#675af9', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload template modal */}
      {uploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,1,47,0.2)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setUploadModal(false)}>
          <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 8px 40px rgba(18,1,47,0.15)', width: 520, border: '1px solid #e6e4ef' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #e6e4ef', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Upload new template</span>
              <button onClick={() => setUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6580', display: 'flex' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Name"><Input value="Section 138 — NACH bounce" /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Category"><SelectInput value="SECTION_138" /></Field>
                <Field label="Language"><SelectInput value="English (en_IN)" /></Field>
              </div>
              <Field label="PDF file">
                <div style={{ border: '1px solid #e6e4ef', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#332b46', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ border: '1px solid #675af9', color: '#675af9', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6 }}>Choose file</span>
                  <span style={{ color: '#6b6580' }}>acre_s138_v2.pdf</span>
                </div>
              </Field>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Variable mapping</div>
                <div style={{ background: '#fafaff', border: '1px solid #e6e4ef', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['{{loan_account}}', 'loan_account_number'], ['{{amount_due}}', 'amount_pending'], ['{{borrower_name}}', 'borrower_name']].map(([ph, field]) => (
                    <div key={ph} style={{ display: 'grid', gridTemplateColumns: '1fr 20px 1fr', gap: 8, alignItems: 'center' }}>
                      <div style={{ border: '1px solid #e6e4ef', borderRadius: 6, padding: '6px 10px', fontSize: 12, fontFamily: 'monospace', background: 'white', color: '#332b46' }}>{ph}</div>
                      <div style={{ textAlign: 'center', color: '#a5a1b3', fontSize: 13 }}>→</div>
                      <div style={{ border: '1px solid #e6e4ef', borderRadius: 6, padding: '6px 10px', fontSize: 12, background: 'white', color: '#332b46', display: 'flex', justifyContent: 'space-between' }}>{field} <span style={{ color: '#a5a1b3' }}>▾</span></div>
                    </div>
                  ))}
                  <button style={{ color: '#675af9', fontSize: 12, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '4px 0 0' }}>+ Add variable</button>
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 22px', borderTop: '1px solid #e6e4ef', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setUploadModal(false)} style={{ background: '#f0eef7', color: '#332b46', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button style={{ background: 'none', color: '#675af9', border: '1px solid #675af9', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save as draft</button>
              <button style={{ background: '#675af9', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
