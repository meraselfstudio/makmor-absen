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
        <div className="flex items-center justify-between px-5 py-3 rounded-full shadow-2xl w-full max-w-sm mx-auto pointer-events-auto"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(24px)' }}>

            {/* Brand Logo minimal */}
            <div className="flex items-center gap-3">
                <img
                    src="/makmor-logo.webp"
                    alt="Makmor"
                    className="h-8 w-auto object-contain"
                />
            </div>

            {/* Clean Digital Clock */}
            <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="text-xl font-semibold tracking-tight" style={{ color: '#fff' }}>{hh}</span>
                    <span className="text-xl font-semibold animate-pulse" style={{ color: 'rgba(255,255,255,0.5)' }}>:</span>
                    <span className="text-xl font-semibold tracking-tight" style={{ color: '#fff' }}>{mm}</span>
                </div>
                <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{dayStr}, {time.getDate()} {monthNames[time.getMonth()]}</p>
            </div>
        </div>
    )
}
