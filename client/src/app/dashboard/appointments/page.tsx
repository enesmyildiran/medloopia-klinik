import Link from 'next/link';

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Randevular</h1>
        <Link
          href="/dashboard/appointments/new"
          className="btn-primary"
        >
          Yeni Randevu
        </Link>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-medium text-gray-900">Şubat 2024</h2>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-md">
              Ay
            </button>
            <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Hafta
            </button>
            <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Gün
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
            <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i + 1;
            const hasAppointments = [5, 12, 15, 20, 25].includes(day);
            const isToday = day === 20;
            return (
              <div
                key={day}
                className={`min-h-[100px] bg-white p-2 ${
                  isToday ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isToday ? 'font-semibold text-primary-600' : 'text-gray-500'}`}>
                    {day}
                  </span>
                  {hasAppointments && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                      2
                    </span>
                  )}
                </div>
                {hasAppointments && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-500">09:00 - John Doe</div>
                    <div className="text-xs text-gray-500">14:30 - Jane Smith</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Bugünkü Randevular</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium">JD</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">John Doe</div>
                    <div className="text-sm text-gray-500">Kontrol</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">09:00 - 09:30</div>
                  <Link
                    href="/dashboard/appointments/123"
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Detaylar
                  </Link>
                </div>
              </div>
            </li>
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium">JS</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                    <div className="text-sm text-gray-500">İmplant Tedavisi</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">14:30 - 15:30</div>
                  <Link
                    href="/dashboard/appointments/124"
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Detaylar
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 