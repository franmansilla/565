import { Navbar } from '@/components/Navbar'
import { AppShell } from '@/components/AppShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <AppShell>{children}</AppShell>
    </div>
  )
}
