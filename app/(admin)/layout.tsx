import { Navbar } from '@/components/Navbar'
import { AppShell } from '@/components/AppShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      {/* Mobile-only top bar — hidden on lg where TopBar takes over */}
      <div className="lg:hidden">
        <Navbar />
      </div>
      <AppShell>{children}</AppShell>
    </div>
  )
}
