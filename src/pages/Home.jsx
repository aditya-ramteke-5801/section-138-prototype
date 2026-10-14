import { useState } from 'react'
import { X } from 'lucide-react'

const BATCH_DETAIL = {
  0: {
    cycle: 'SEPTEMBER2026', channel: 'Physical', state: 'Dispatched',
    template: 'Section 138 — NACH bounce v2', created: '30 Sep 2026 · Aditya R.',
    funnel: [
      { stage: 'Cases picked',           count: 1247 },
      { stage: 'Legodesk accepted',      count: 1183 },
      { stage: 'Generated',              count: 1183 },
      { stage: 'Dispatched (Speed Post)', count: 1183 },
      { stage: 'Delivered',              count: 743,  color: '#08ca97' },
      { stage: 'Not delivered',          count: 12,   color: '#fb4d3d' },
    ],
    cases: [
      { id: 'L-8821', name: 'Ramesh K.', state: 'Delivered',     stateStyle: { background: '#e6faf5', color: '#059669' }, lastEvent: '2 Oct · Legodesk' },
      { id: 'L-8822', name: 'Priya S.',  state: 'Delivered',     stateStyle: { background: '#e6faf5', color: '#059669' }, lastEvent: '1 Oct · Legodesk' },
      { id: 'L-8823', name: 'Sanjay M.', state: 'Dispatched',    stateStyle: { background: '#f0eef7', color: '#332b46' }, lastEvent: '30 Sep · Legodesk' },
      { id: 'L-8824', name: 'Anjali P.', state: 'Not delivered', stateStyle: { background: '#ffedec', color: '#fb4d3d' }, lastEvent: '29 Sep · returned', retry: true },
    ],
  },
  1: {
    cycle: 'SEPTEMBER2026', channel: 'Digital (WhatsApp)', state: 'Dispatched',
    template: 'Section 138 — WA carrier v1', created: '1 Oct 2026 · Rohit M.',
    funnel: [
      { stage: 'Cases picked', count: 1183 },
      { stage: 'Generated',    count: 1183 },
      { stage: 'Sent',         count: 1183 },
      { stage: 'Delivered',    count: 981, color: '#08ca97' },
      { stage: 'Read',         count: 743, color: '#059669' },
      { stage: 'Not delivered', count: 42, color: '#fb4d3d' },
    ],
    cases: [
      { id: 'L-8821', name: 'Ramesh K.', state: 'Read',          stateStyle: { background: '#e6faf5', color: '#059669' }, lastEvent: '2 Oct · WhatsApp' },
      { id: 'L-8822', name: 'Priya S.',  state: 'Delivered',     stateStyle: { background: '#e6faf5', color: '#059669' }, lastEvent: '1 Oct · WhatsApp' },
      { id: 'L-9010', name: 'Vikram T.', state: 'Not delivered', stateStyle: { background: '#ffedec', color: '#fb4d3d' }, lastEvent: '1 Oct · failed', retry: true },
    ],
  },
  2: {
    cycle: 'SEPTEMBER2026', channel: 'Physical', state: 'Generating',
    template: 'Section 138 — NACH bounce v2', created: '14 Oct 2026 · Aditya R.',
    funnel: [
      { stage: 'Cases picked',      count: 1183 },
      { stage: 'Legodesk accepted', count: 1183 },
      { stage: 'Generated',         count: 604,  color: '#ff9b25' },
      { stage: 'Pending generation', count: 579, color: '#a5a1b3' },
    ],
    cases: [
      { id: 'L-9100', name: 'Kiran B.',  state: 'Generated', stateStyle: { background: '#fff4e5', color: '#d97706' }, lastEvent: '14 Oct · Legodesk' },
      { id: 'L-9101', name: 'Meena S.',  state: 'Generated', stateStyle: { background: '#fff4e5', color: '#d97706' }, lastEvent: '14 Oct · Legodesk' },
      { id: 'L-9102', name: 'Arjun P.',  state: 'Pending',   stateStyle: { background: '#f0eef7', color: '#6b6580' }, lastEvent: '—' },
    ],
  },
}

const stats = [
  { label: 'Notices sent this cycle', value: '2,366', sub: 'Sep 2026', highlight: true },
  { label: 'Delivered', value: '1,724', color: '#059669', sub: '73% delivery rate' },
  { label: 'Pending', value: '630', color: '#d97706', sub: 'In transit / awaiting' },
  { label: 'Not delivered', value: '12', color: '#fb4d3d', sub: 'Returned / failed' },
]

const FUNNEL = {
  all: [
    { stage: 'Cases picked',        count: 2494, color: '#675af9' },
    { stage: 'Legodesk accepted',   count: 2366, color: '#675af9' },
    { stage: 'Generated',           count: 2366, color: '#675af9' },
    { stage: 'Dispatched',          count: 2354, color: '#675af9' },
    { stage: 'Delivered',           count: 1724, color: '#08ca97' },
    { stage: 'Read',                count: 743,  color: '#059669' },
    { stage: 'Not delivered',       count: 12,   color: '#fb4d3d' },
  ],
  physical: [
    { stage: 'Cases picked',           count: 1247, color: '#675af9' },
    { stage: 'Legodesk accepted',      count: 1183, color: '#675af9' },
    { stage: 'Generated',              count: 1183, color: '#675af9' },
    { stage: 'Dispatched (Speed Post)', count: 1183, color: '#675af9' },
    { stage: 'Delivered',              count: 743,  color: '#08ca97' },
    { stage: 'Not delivered',          count: 12,   color: '#fb4d3d' },
  ],
  whatsapp: [
    { stage: 'Cases picked',  count: 1183, color: '#675af9' },
    { stage: 'Generated',     count: 1183, color: '#675af9' },
    { stage: 'Sent',          count: 1183, color: '#675af9' },
    { stage: 'Delivered',     count: 981,  color: '#08ca97' },
    { stage: 'Read',          count: 743,  color: '#059669' },
    { stage: 'Not delivered', count: 42,   color: '#fb4d3d' },
  ],
  sms:   null,
  email: null,
}

const CHANNELS = [
  { id: 'all',      label: 'All' },
  { id: 'physical', label: 'Physical (Post)' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'sms',      label: 'SMS' },
  { id: 'email',    label: 'Email' },
]

const batches = [
  { cycle: 'SEPTEMBER2026', channel: 'Physical', state: 'Dispatched', stateStyle: { background: '#e6faf5', color: '#059669' }, cases: '1,183', delivered: '743' },
  { cycle: 'SEPTEMBER2026', channel: 'Digital',  state: 'Dispatched', stateStyle: { background: '#e6faf5', color: '#059669' }, cases: '1,183', delivered: '981' },
  { cycle: 'SEPTEMBER2026', channel: 'Physical', state: 'Generating', stateStyle: { background: '#fff4e5', color: '#d97706' }, cases: '1,183', delivered: '—' },
]

const card = { background: 'white', border: '1px solid #e6e4ef', borderRadius: 12, boxShadow: '0 1px 2px rgba(18,1,47,0.04)' }
const th = { fontSize: 11, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, padding: '10px 16px', borderBottom: '1px solid #e6e4ef', textAlign: 'left' }
const td = { padding: '11px 16px', borderBottom: '1px solid #e6e4ef', fontSize: 13 }

export default function Home() {
  const [channel, setChannel] = useState('all')
  const [selectedBatch, setSelectedBatch] = useState(null)
  const data = FUNNEL[channel]
  const max = data ? data[0].count : 0
  const detail = selectedBatch !== null ? BATCH_DETAIL[selectedBatch] : null

  return (
    <div style={{ padding: '32px', maxWidth: 960 }}>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: '18px 20px', borderColor: s.highlight ? '#675af9' : '#e6e4ef', background: s.highlight ? '#f1f0ff' : 'white' }}>
            <div style={{ fontSize: 12, color: '#6b6580', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.5px', color: s.highlight ? '#675af9' : (s.color || '#12012f') }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#a5a1b3', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Funnel card */}
      <div style={{ ...card, marginBottom: 24 }}>
        {/* Header + channel filter */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e6e4ef', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Delivery funnel — Sep 2026</span>
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto', background: '#f0eef7', borderRadius: 8, padding: 3 }}>
            {CHANNELS.map(c => (
              <button key={c.id} onClick={() => setChannel(c.id)}
                style={{
                  padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: channel === c.id ? 600 : 400,
                  background: channel === c.id ? '#675af9' : 'transparent',
                  color: channel === c.id ? 'white' : '#6b6580',
                  transition: 'all 0.15s',
                }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Funnel body */}
        <div style={{ padding: '28px 40px' }}>
          {!data ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#a5a1b3' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>—</div>
              <div style={{ fontSize: 14 }}>No notices sent via this channel in Sep 2026</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              {data.map((row, i) => {
                const pct = Math.round((row.count / max) * 100)
                const barW = Math.max((row.count / max) * 100, 8)
                const dropOff = i > 0 ? data[i - 1].count - row.count : null
                const dropPct = i > 0 ? Math.round((dropOff / data[i - 1].count) * 100) : null

                return (
                  <div key={row.stage} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Drop-off connector */}
                    {dropOff !== null && dropOff > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '3px 0', color: '#a5a1b3', fontSize: 11 }}>
                        <div style={{ width: 1, height: 14, background: '#e6e4ef' }} />
                        <span style={{ color: '#fb4d3d', fontWeight: 500 }}>−{dropOff.toLocaleString()} ({dropPct}% drop)</span>
                      </div>
                    )}
                    {dropOff === null && i === 0 && <div style={{ height: 0 }} />}
                    {dropOff === 0 && <div style={{ width: 1, height: 8, background: '#e6e4ef', margin: '3px 0' }} />}

                    {/* Bar */}
                    <div style={{ width: `${barW}%`, transition: 'width 0.4s ease', position: 'relative' }}>
                      {/* Trapezoid via clip-path */}
                      <div style={{
                        background: row.color,
                        opacity: row.stage === 'Not delivered' ? 1 : 0.85 + (i * 0.02),
                        borderRadius: 6,
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minWidth: 120,
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'white', whiteSpace: 'nowrap' }}>{row.stage}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{row.count.toLocaleString()}</span>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', minWidth: 34, textAlign: 'right' }}>{pct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active batches */}
      <div style={card}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #e6e4ef' }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Active batches</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Cycle', 'Channel', 'State', 'Cases', 'Delivered'].map(h => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {batches.map((b, i) => (
              <tr key={i}
                onClick={() => setSelectedBatch(i)}
                style={{ background: selectedBatch === i ? '#f1f0ff' : 'white', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => { if (selectedBatch !== i) e.currentTarget.style.background = '#fafaff' }}
                onMouseLeave={e => { e.currentTarget.style.background = selectedBatch === i ? '#f1f0ff' : 'white' }}
              >
                <td style={{ ...td, borderBottom: i === batches.length - 1 ? 'none' : '1px solid #e6e4ef' }}>
                  <code style={{ background: '#f5f4f9', padding: '2px 7px', borderRadius: 4, fontSize: 11 }}>{b.cycle}</code>
                </td>
                <td style={{ ...td, borderBottom: i === batches.length - 1 ? 'none' : '1px solid #e6e4ef' }}>
                  <span style={{ background: '#f0eef7', color: '#332b46', fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>{b.channel}</span>
                </td>
                <td style={{ ...td, borderBottom: i === batches.length - 1 ? 'none' : '1px solid #e6e4ef' }}>
                  <span style={{ ...b.stateStyle, fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>{b.state}</span>
                </td>
                <td style={{ ...td, borderBottom: i === batches.length - 1 ? 'none' : '1px solid #e6e4ef' }}>{b.cases}</td>
                <td style={{ ...td, borderBottom: i === batches.length - 1 ? 'none' : '1px solid #e6e4ef' }}>{b.delivered}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Batch detail drawer */}
      {detail && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setSelectedBatch(null)} />
          <div style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: 520, background: 'white', boxShadow: '-4px 0 32px rgba(18,1,47,0.12)', borderLeft: '1px solid #e6e4ef', zIndex: 40, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

            {/* Drawer header */}
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #e6e4ef', background: '#f1f0ff', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{detail.cycle} · {detail.channel}</div>
                <div style={{ fontSize: 12, color: '#6b6580', marginTop: 4 }}>
                  Template: {detail.template} &nbsp;·&nbsp; Created: {detail.created}
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 500, background: detail.state === 'Dispatched' ? '#e6faf5' : '#fff4e5', color: detail.state === 'Dispatched' ? '#059669' : '#d97706' }}>
                    {detail.state}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedBatch(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6580', display: 'flex', flexShrink: 0 }}><X size={18} /></button>
            </div>

            {/* Funnel */}
            <div style={{ padding: '20px 22px', borderBottom: '1px solid #e6e4ef' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Funnel</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                {detail.funnel.map((row, i) => {
                  const pct = Math.round((row.count / detail.funnel[0].count) * 100)
                  const barW = Math.max(pct, 10)
                  const prev = detail.funnel[i - 1]
                  const dropOff = prev ? prev.count - row.count : null
                  return (
                    <div key={row.stage} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {dropOff !== null && dropOff > 0 && (
                        <div style={{ fontSize: 11, color: '#fb4d3d', margin: '3px 0', fontWeight: 500 }}>
                          ↓ −{dropOff.toLocaleString()} ({Math.round((dropOff / prev.count) * 100)}% drop)
                        </div>
                      )}
                      {(dropOff === null || dropOff === 0) && i > 0 && <div style={{ width: 1, height: 8, background: '#e6e4ef', margin: '3px 0' }} />}
                      <div style={{ width: `${barW}%`, background: row.color || '#675af9', borderRadius: 6, padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 120 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'white' }}>{row.stage}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{row.count.toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Cases table */}
            <div style={{ padding: '20px 22px', flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Cases</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Loan ID', 'Borrower', 'State', 'Last event', ''].map(h => (
                      <th key={h} style={{ fontSize: 11, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, padding: '8px 10px', borderBottom: '1px solid #e6e4ef', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detail.cases.map((c, i) => (
                    <tr key={c.id} style={{ borderBottom: i === detail.cases.length - 1 ? 'none' : '1px solid #e6e4ef' }}>
                      <td style={{ padding: '9px 10px' }}><code style={{ background: '#f5f4f9', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>{c.id}</code></td>
                      <td style={{ padding: '9px 10px', fontWeight: 500 }}>{c.name}</td>
                      <td style={{ padding: '9px 10px' }}><span style={{ ...c.stateStyle, fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 500 }}>{c.state}</span></td>
                      <td style={{ padding: '9px 10px', fontSize: 12, color: '#6b6580' }}>{c.lastEvent}</td>
                      <td style={{ padding: '9px 10px' }}>
                        {c.retry && <span style={{ fontSize: 11, color: '#fb4d3d', fontWeight: 600, cursor: 'pointer' }}>Retry</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </>
      )}
    </div>
  )
}
