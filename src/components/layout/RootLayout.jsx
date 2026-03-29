import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import MobileBottomNav from './MobileBottomNav'
import Footer from './Footer'
import NexusAI from '../shared/NexusAI'
import { useAuthStore } from '../../stores/authStore'

export default function RootLayout() {
  const { profile } = useAuthStore()
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>
      <MobileBottomNav />
      {/* Nexus AI is for students; admins have institutional oversight logs */}
      {!isAdmin && <NexusAI />}
      {/* <Footer /> */}
    </div>
  )
}
