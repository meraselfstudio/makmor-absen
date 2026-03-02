import React, { useRef, useState, useCallback } from 'react'
import Header from './components/Header'
import WebcamFeed from './components/WebcamFeed'
import EmployeeSelect from './components/EmployeeSelect'
import MealModal from './components/MealModal'
import Toast from './components/Toast'
import { LogIn, LogOut, Loader2, ShieldCheck } from 'lucide-react'

const GAS_URL = 'https://script.google.com/macros/s/AKfycbw6DMAifJbxvgQI3DNa26BfNBWVXcmL4uL2zFAUPFrbA-VYuqPSAxwRfA8ghgPSe_WhSQ/exec'

export default function App() {
  const webcamRef = useRef(null)

  const [employee, setEmployee] = useState('')
  const [webcamReady, setWebcamReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null) // { message, type }
  const [showMealModal, setShowMealModal] = useState(false)

  const showToast = useCallback((message, type) => {
    setToast({ message, type, id: Date.now() })
  }, [])

  const canSubmit = !!employee && webcamReady && !isLoading

  const captureAndSubmit = useCallback(async (tipe, ambilMeal = false) => {
    let foto = ''
    try {
      foto = webcamRef.current?.getScreenshot() || ''
    } catch (_) { /* silent */ }

    setIsLoading(true)
    setShowMealModal(false)

    const payload = {
      nama: employee,
      tipe,
      ambilMeal: tipe === 'Keluar' ? ambilMeal : false,
      foto,
    }

    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' }, // GAS requires text/plain to avoid CORS preflight
        body: JSON.stringify(payload),
      })

      let data = {}
      try {
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          data = await res.json()
        } else {
          // GAS returned HTML (misconfigured script) — treat as error
          const text = await res.text()
          if (text.includes('TypeError') || text.includes('Error')) {
            data = { status: 'error', message: 'Script server belum dikonfigurasi. Hubungi admin.' }
          }
        }
      } catch (_) { /* silent */ }

      if (res.ok && data.status !== 'error') {
        showToast(
          tipe === 'Masuk'
            ? `Selamat datang, ${employee}! Absen masuk berhasil dicatat.`
            : `Sampai jumpa, ${employee}! Absen pulang berhasil dicatat.`,
          'success'
        )
        // Reset form after success
        setEmployee('')
      } else {
        showToast(data.message || 'Gagal menyimpan data. Coba lagi.', 'error')
      }
    } catch (err) {
      showToast('Koneksi gagal. Periksa jaringan Anda.', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [employee, showToast])

  const handleMasuk = useCallback(() => {
    if (!canSubmit) return
    captureAndSubmit('Masuk')
  }, [canSubmit, captureAndSubmit])

  const handlePulang = useCallback(() => {
    if (!canSubmit) return
    setShowMealModal(true)
  }, [canSubmit])

  const handleMealAnswer = useCallback((ambilMeal) => {
    captureAndSubmit('Keluar', ambilMeal)
  }, [captureAndSubmit])

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-black text-white">

      {/* ── BACKGROUND: Webcam (100% full screen) ── */}
      <div className="absolute inset-0 z-0 bg-black">
        <WebcamFeed webcamRef={webcamRef} onReady={() => setWebcamReady(true)} />
      </div>

      {/* ── FLOATING HEADER ── */}
      <div className="absolute top-6 mx-4 md:mx-auto left-0 right-0 max-w-sm z-20 pointer-events-none">
        <Header />
      </div>

      {/* ── FLOATING BOTTOM CONTROLS (Glass Container) ── */}
      <div className="absolute bottom-6 mx-4 md:mx-auto left-0 right-0 max-w-sm z-20 pb-safe">
        <div className="backdrop-blur-[40px] bg-black/45 border border-white/10 rounded-[2.5rem] p-5 shadow-2xl flex flex-col gap-4">

          {/* Title Area */}
          <div className="text-center mt-1">
            <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">
              Absensi Karyawan
            </h1>
            <p className="text-xs font-medium text-white/50">
              Pilih nama, lalu klik tombol absen
            </p>
          </div>

          <EmployeeSelect value={employee} onChange={setEmployee} />

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {/* Absen Masuk */}
            <button
              id="btn-masuk"
              onClick={handleMasuk}
              disabled={!canSubmit}
              className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-[2rem] font-bold text-base transition-all duration-300 ${canSubmit ? 'active:scale-95 cursor-pointer shadow-lg shadow-red-500/20' : 'cursor-not-allowed opacity-40'}`}
              style={{
                background: canSubmit ? '#C8222A' : 'rgba(255,255,255,0.06)',
                color: canSubmit ? '#fff' : 'rgba(255,255,255,0.3)',
              }}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
              Absen Masuk
            </button>

            {/* Absen Pulang */}
            <button
              id="btn-pulang"
              onClick={handlePulang}
              disabled={!canSubmit}
              className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-[2rem] font-bold text-base transition-all duration-300 ${canSubmit ? 'active:scale-95 cursor-pointer hover:bg-white/10' : 'cursor-not-allowed opacity-40'}`}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: canSubmit ? '#fff' : 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
              Absen Pulang
            </button>
          </div>
        </div>
      </div>

      {/* ── Meal modal ── */}
      {showMealModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <MealModal
            onAnswer={handleMealAnswer}
            onClose={() => setShowMealModal(false)}
          />
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50">
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  )
}
