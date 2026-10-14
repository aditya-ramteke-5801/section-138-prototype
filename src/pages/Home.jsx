import { useState } from 'react'

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
  const data = FUNNEL[channel]
  const max = data ? data[0].count : 0

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
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #e6e4ef', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Active batches</span>
          <button style={{ marginLeft: 'auto', background: '#675af9', color: 'white', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            + Create new batch
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Cycle', 'Channel', 'State', 'Cases', 'Delivered', ''].map(h => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {batches.map((b, i) => (
              <tr key={i} style={{ background: 'white' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafaff'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <td style={td}><code style={{ background: '#f5f4f9', padding: '2px 7px', borderRadius: 4, fontSize: 11 }}>{b.cycle}</code></td>
                <td style={td}><span style={{ background: '#f0eef7', color: '#332b46', fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>{b.channel}</span></td>
                <td style={td}><span style={{ ...b.stateStyle, fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>{b.state}</span></td>
                <td style={td}>{b.cases}</td>
                <td style={td}>{b.delivered}</td>
                <td style={{ ...td, color: '#675af9', fontSize: 12, fontWeight: 500, cursor: 'pointer', borderBottom: i === batches.length - 1 ? 'none' : '1px solid #e6e4ef' }}>View →</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
