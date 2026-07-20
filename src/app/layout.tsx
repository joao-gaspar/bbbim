import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: 'BBBIM Store', template: '%s | BBBIM Store' },
  description: 'O portal de referência em Building Information Modeling no Brasil. Tutoriais, dicas e novidades sobre BIM, Revit, ArchiCAD e IFC.',
  keywords: ['BIM', 'Revit', 'ArchiCAD', 'IFC', 'construção', 'projetos'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'BBBIM Store',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
