import React, { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <div className="text-xl font-bold mb-8">Medloopia Klinik</div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/dashboard/patients" className="block p-2 hover:bg-gray-700 rounded">
                Patients
              </a>
            </li>
            <li>
              <a href="/dashboard/treatments" className="block p-2 hover:bg-gray-700 rounded">
                Treatments
              </a>
            </li>
            <li>
              <a href="/dashboard/appointments" className="block p-2 hover:bg-gray-700 rounded">
                Appointments
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <span className="sr-only">Notifications</span>
                🔔
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <span className="sr-only">Profile</span>
                👤
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
} 