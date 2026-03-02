import React, { useState, useEffect } from 'react'
import { Battery, Signal } from 'lucide-react'

export default function Header() {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    const pad = (n) => String(n).padStart(2, '0')
    const hh = pad(time.getHours())
    const mm = pad(time.getMinutes())
    const ss = pad(time.getSeconds())

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const dayStr = dayNames[time.getDay()]
    const dateStr = `${time.getDate()} ${monthNames[time.getMonth()]} ${time.getFullYear()}`

    return (
        <header className="flex items-center justify-between px-6 py-3 border-b"
            style={{ borderColor: 'var(--color-border)', background: 'rgba(13,10,10,0.97)', backdropFilter: 'blur(12px)' }}>

            {/* Brand — real logo */}
            <div className="flex items-center gap-3">
                <img
                    src="/makmor-logo.webp"
                    alt="Toko Baso Makmor"
                    className="h-12 w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 2px 6px rgba(200,34,42,0.35))' }}
                />
                <div className="h-8 w-px" style={{ background: 'var(--color-border)' }} />
                <div>
                    <p className="font-semibold text-xs tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
                        Toko Baso Makmor
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Absensi</p>
                </div>
            </div>

            {/* Digital Clock */}
            <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <span className="text-4xl font-bold" style={{ color: '#f5f0f0' }}>{hh}</span>
                    <span className="text-3xl font-bold animate-pulse" style={{ color: '#C8222A' }}>:</span>
                    <span className="text-4xl font-bold" style={{ color: '#f5f0f0' }}>{mm}</span>
                    <span className="text-2xl font-bold ml-1" style={{ color: '#C8222A' }}>:</span>
                    <span className="text-2xl font-bold" style={{ color: '#a09090' }}>{ss}</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{dayStr}, {dateStr}</p>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"
                        style={{ animation: 'dot-blink 2s ease-in-out infinite' }} />
                    <span className="text-xs font-medium text-emerald-400">ONLINE</span>
                </div>
                <Signal size={16} style={{ color: 'var(--color-text-muted)' }} />
                <Battery size={18} style={{ color: 'var(--color-text-muted)' }} />
            </div>
        </header>
    )
}
