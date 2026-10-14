import { useState } from 'react'
import { Home, FolderOpen, Settings } from 'lucide-react'
import HomePage from './pages/Home'
import CaseManagementPage from './pages/CaseManagement'
import SettingsPage from './pages/Settings'

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'cases', label: 'Case Management', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const PAGES = { home: HomePage, cases: CaseManagementPage, settings: SettingsPage }

const APP_NAV = ['Portfolio', 'Superagent CRM', 'Opszero', 'Communication', 'Section 138']

export default function App() {
  const [page, setPage] = useState('home')
  const Page = PAGES[page]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* App bar */}
      <header style={{ background: '#675af9', color: 'white', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>DPDzero</span>
        {APP_NAV.map(item => (
          <span key={item} style={{ fontSize: 13, opacity: item === 'Section 138' ? 1 : 0.7, fontWeight: item === 'Section 138' ? 600 : 400, cursor: 'default' }}>
            {item}
          </span>
        ))}
        <div style={{ marginLeft: 'auto', width: 28, height: 28, borderRadius: '50%', background: 'white', color: '#675af9', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width: 260, flexShrink: 0, background: '#edeeff', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {/* Module header */}
          <div style={{ background: '#d8d8f8', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: '#675af9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚖️</div>
            <span style={{ fontWeight: 700, color: '#1a1060', fontSize: 16, flex: 1 }}>Section 138</span>
            <span style={{ color: '#7b72c8', fontSize: 14 }}>∧</span>
          </div>

          {NAV.map(({ id, label, icon: Icon }) => {
            const active = page === id
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  borderRadius: 12, border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                  background: active ? '#675af9' : 'transparent',
                  color: active ? 'white' : '#1a1060',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#d8d8f8' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: active ? 'rgba(255,255,255,0.2)' : '#d8d8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={active ? 'white' : '#675af9'} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
              </button>
            )
          })}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#fafaff' }}>
          <Page />
        </main>
      </div>
    </div>
  )
}
