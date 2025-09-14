import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        padding: '40px',
        backgroundColor: '#fff',
        overflow: 'auto'
      }}>
        {children}
      </main>
    </div>
  )
}