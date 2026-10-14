const stats = [
  { label: 'Notices sent this cycle', value: '2,366', sub: 'Sep 2026', highlight: true },
  { label: 'Delivered', value: '1,724', color: '#059669', sub: '73% delivery rate' },
  { label: 'Pending', value: '630', color: '#d97706', sub: 'In transit / awaiting' },
  { label: 'Not delivered', value: '12', color: '#fb4d3d', sub: 'Returned / failed' },
]

const funnel = [
  { label: 'Cases picked', count: '2,494', pct: 100 },
  { label: 'Legodesk accepted', count: '2,366', pct: 95 },
  { label: 'Notices generated', count: '2,366', pct: 95 },
  { label: 'Dispatched', count: '2,354', pct: 94 },
  { label: 'Delivered', count: '1,724', pct: 69, color: '#08ca97' },
  { label: 'Not delivered', count: '12', pct: 1, color: '#fb4d3d' },
]

const activity = [
  { dot: '#08ca97', title: 'Acre — Sep 2026 · Physical batch closed', meta: '743 delivered · 12 not delivered · 2 Oct 2026' },
  { dot: '#675af9', title: 'Acre — Sep 2026 · Digital campaign dispatched', meta: '981 sent via WhatsApp · 1 Oct 2026' },
  { dot: '#ff9b25', title: 'Slice — Sep 2026 · Notices generating', meta: '604 of 1,183 generated · in progress' },
  { dot: '#a5a1b3', title: 'New template approved', meta: 'Section 138 — Hindi v1 · legal@acre.in' },
]

const batches = [
  { cycle: 'SEPTEMBER2026', channel: 'Physical', state: 'Dispatched', stateStyle: { background: '#e6faf5', color: '#059669' }, cases: '1,183', delivered: '743' },
  { cycle: 'SEPTEMBER2026', channel: 'Digital', state: 'Dispatched', stateStyle: { background: '#e6faf5', color: '#059669' }, cases: '1,183', delivered: '981' },
  { cycle: 'SEPTEMBER2026', channel: 'Physical', state: 'Generating', stateStyle: { background: '#fff4e5', color: '#d97706' }, cases: '1,183', delivered: '—' },
]

const card = { background: 'white', border: '1px solid #e6e4ef', borderRadius: 12, boxShadow: '0 1px 2px rgba(18,1,47,0.04)' }
const th = { fontSize: 11, color: '#6b6580', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, padding: '10px 16px', borderBottom: '1px solid #e6e4ef', textAlign: 'left' }
const td = { padding: '11px 16px', borderBottom: '1px solid #e6e4ef', fontSize: 13 }

export default function Home() {
  return (
    <div style={{ padding: '32px', maxWidth: 1000 }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: '18px 20px', borderColor: s.highlight ? '#675af9' : '#e6e4ef', background: s.highlight ? '#f1f0ff' : 'white' }}>
            <div style={{ fontSize: 12, color: '#6b6580', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.5px', color: s.highlight ? '#675af9' : (s.color || '#12012f') }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#a5a1b3', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

        {/* Funnel */}
        <div style={card}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #e6e4ef', fontWeight: 600, fontSize: 14 }}>Overall funnel — Sep 2026</div>
          <div style={{ padding: '16px 18px' }}>
            {funnel.map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, marginBottom: 10, borderBottom: '1px dashed #e6e4ef' }}>
                <span style={{ width: 150, fontSize: 12, color: '#6b6580', flexShrink: 0 }}>{f.label}</span>
                <span style={{ width: 50, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{f.count}</span>
                <div style={{ flex: 1, height: 7, background: '#e6e4ef', borderRadius: 4 }}>
                  <div style={{ width: `${f.pct}%`, height: 7, borderRadius: 4, background: f.color || '#675af9', transition: 'width 0.3s' }} />
                </div>
                <span style={{ width: 36, textAlign: 'right', fontSize: 11, color: '#6b6580' }}>{f.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #e6e4ef', fontWeight: 600, fontSize: 14 }}>Recent activity</div>
          <div style={{ flex: 1 }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '13px 18px', borderBottom: i < activity.length - 1 ? '1px dashed #e6e4ef' : 'none' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.dot, flexShrink: 0, marginTop: 5 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: '#6b6580', marginTop: 2 }}>{a.meta}</div>
                </div>
              </div>
            ))}
          </div>
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
