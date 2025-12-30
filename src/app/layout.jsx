import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CARE-IO - Professional Care Services for Your Loved Ones',
  description: 'Book professional baby care, elderly care, and sick care services. Certified caregivers available 24/7. Your peace of mind is our priority.',
  keywords: 'baby care, elderly care, sick care, nursing, caregiver, home care, childcare, senior care',
  openGraph: {
    title: 'CARE-IO - Professional Care Services',
    description: 'Quality care services for your loved ones',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}