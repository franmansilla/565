import { createServerClient } from '@/lib/supabase/server'
import { getCurrentUserRole } from '@/lib/data'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="flex-1 flex">{children}</div>
  }

  const rol = await getCurrentUserRole(user.id)
  const isAdmin = rol === 'admin'

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar userEmail={user.email} />
        <main className="flex-1 overflow-y-auto" style={{ background: '#f9f9ff' }}>
          <div className="px-10 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
