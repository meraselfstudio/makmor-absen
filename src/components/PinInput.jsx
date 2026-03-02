import React, { useState, useCallback } from 'react'
import { Delete, Hash } from 'lucide-react'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

export default function PinInput({ value, onChange }) {
    const [activeIdx, setActiveIdx] = useState(null)

    const handleKey = useCallback((key) => {
        if (key === '⌫') {
            onChange(value.slice(0, -1))
        } else if (value.length < 4) {
            onChange(value + key)
        }
        // Flash animation on press
        setActiveIdx(KEYS.indexOf(key))
        setTimeout(() => setActiveIdx(null), 150)
    }, [value, onChange])

    return (
        <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--color-text-muted)' }}>
                <Hash size={12} />
                PIN Karyawan
            </label>

            {/* PIN display */}
            <div className="flex gap-3 justify-center">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 ${value.length === i ? 'digit-active' : ''}`}
                        style={{
                            background: value[i] ? 'rgba(200,34,42,0.15)' : 'rgba(20,10,10,0.8)',
                            border: `1px solid ${value[i] ? 'rgba(200,34,42,0.5)' : 'var(--color-border)'}`,
                            boxShadow: value[i] ? '0 0 12px rgba(200,34,42,0.25)' : 'none',
                            color: 'var(--color-text-primary)',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        {value[i] ? '●' : ''}
                    </div>
                ))}
            </div>

            {/* Numeric keypad */}
            <div className="grid grid-cols-3 gap-2 mt-2">
                {KEYS.map((key, idx) => (
                    <button
                        key={idx}
                        onClick={() => key && handleKey(key)}
                        disabled={!key}
                        className={`h-12 rounded-xl font-semibold text-lg transition-all duration-150 select-none ${key === '' ? 'invisible' : 'active:scale-95'
                            }`}
                        style={{
                            background: activeIdx === idx
                                ? 'rgba(200,34,42,0.35)'
                                : key === '⌫'
                                    ? 'rgba(200,34,42,0.08)'
                                    : 'rgba(20,10,10,0.8)',
                            border: `1px solid ${key === '⌫' ? 'rgba(200,34,42,0.3)' : 'var(--color-border)'}`,
                            color: key === '⌫' ? '#E03038' : 'var(--color-text-primary)',
                            fontFamily: key === '⌫' ? 'inherit' : "'JetBrains Mono', monospace",
                            boxShadow: activeIdx === idx ? '0 0 16px rgba(200,34,42,0.5)' : 'none',
                        }}
                    >
                        {key === '⌫' ? <Delete size={18} className="mx-auto" /> : key}
                    </button>
                ))}
            </div>
        </div>
    )
}
