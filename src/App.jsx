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
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
      <Header />

      <main className="flex flex-1 gap-0 overflow-hidden">
        {/* ── LEFT: Webcam (60%) ── */}
        <div className="flex flex-col p-6 gap-4" style={{ flex: '0 0 60%' }}>
          {/* Security badge */}
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} style={{ color: '#C8222A' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#C8222A' }}>
              Sistem Keamanan Biometrik
            </span>
          </div>

          {/* Webcam area */}
          <div className="flex-1 min-h-0">
            <WebcamFeed webcamRef={webcamRef} onReady={() => setWebcamReady(true)} />
          </div>

          {/* Footnote */}
          <p className="text-center text-xs" style={{ color: '#334155' }}>
            Sistem ini menggunakan pengenalan wajah untuk verifikasi identitas karyawan
          </p>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ width: '1px', background: 'var(--color-border)', flexShrink: 0 }} />

        {/* ── RIGHT: Form (40%) ── */}
        <div className="flex flex-col overflow-y-auto px-8 py-6 gap-6" style={{ flex: '0 0 40%' }}>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Absensi Karyawan
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Pilih nama, lalu klik tombol absen
            </p>
          </div>

          {/* Employee dropdown */}
          <EmployeeSelect value={employee} onChange={setEmployee} />

          {/* Webcam status */}
          {!webcamReady && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(200,34,42,0.08)', border: '1px solid rgba(200,34,42,0.18)', color: '#E03038' }}>
              <Loader2 size={14} className="animate-spin" />
              Menunggu verifikasi wajah...
            </div>
          )}

          {webcamReady && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
              <ShieldCheck size={14} />
              Wajah terverifikasi — siap absen
            </div>
          )}

          {/* ── Action buttons ── */}
          <div className="flex flex-col gap-3 mt-2">
            {/* Absen Masuk */}
            <button
              id="btn-masuk"
              onClick={handleMasuk}
              disabled={!canSubmit}
              className={`flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-bold text-base transition-all duration-200 ${canSubmit ? 'active:scale-[0.98] btn-primary cursor-pointer' : 'cursor-not-allowed opacity-40'
                }`}
              style={{
                background: canSubmit
                  ? 'linear-gradient(135deg, #C8222A 0%, #A01820 100%)'
                  : 'rgba(30,15,15,0.6)',
                color: 'white',
                border: canSubmit ? 'none' : '1px solid var(--color-border)',
              }}
            >
              {isLoading
                ? <Loader2 size={20} className="animate-spin" />
                : <LogIn size={20} />
              }
              Absen Masuk
            </button>

            {/* Absen Pulang */}
            <button
              id="btn-pulang"
              onClick={handlePulang}
              disabled={!canSubmit}
              className={`flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-bold text-base transition-all duration-200 ${canSubmit ? 'active:scale-[0.98] cursor-pointer' : 'cursor-not-allowed opacity-40'
                }`}
              style={{
                background: canSubmit ? 'rgba(239,68,68,0.1)' : 'rgba(30,32,50,0.6)',
                color: canSubmit ? '#f87171' : '#475569',
                border: `1px solid ${canSubmit ? 'rgba(239,68,68,0.3)' : 'var(--color-border)'}`,
              }}
              onMouseEnter={(e) => {
                if (canSubmit) {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.18)'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(239,68,68,0.2)'
                }
              }}
              onMouseLeave={(e) => {
                if (canSubmit) {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {isLoading
                ? <Loader2 size={20} className="animate-spin" />
                : <LogOut size={20} />
              }
              Absen Pulang
            </button>
          </div>

          {/* Hint when disabled */}
          {!canSubmit && !isLoading && (
            <p className="text-center text-xs" style={{ color: '#6b5e5e' }}>
              {!webcamReady
                ? 'Menunggu deteksi wajah...'
                : 'Pilih nama karyawan terlebih dahulu'
              }
            </p>
          )}
        </div>
      </main>

      {/* ── Meal modal ── */}
      {showMealModal && (
        <MealModal
          onAnswer={handleMealAnswer}
          onClose={() => setShowMealModal(false)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
