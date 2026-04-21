export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex overflow-hidden">
      {children}
    </div>
  )
}
