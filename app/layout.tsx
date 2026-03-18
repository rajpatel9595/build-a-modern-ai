import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Alex Chen — AI Engineer',
  description: 'AI Engineer specializing in LLMs, RAG systems, and production-grade ML applications.',
  keywords: ['AI Engineer', 'Machine Learning', 'LLM', 'RAG', 'Portfolio'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#030712] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  )
}
