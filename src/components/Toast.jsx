import React, { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
    const [exiting, setExiting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true)
            setTimeout(onClose, 350)
        }, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    const isSuccess = type === 'success'

    return (
        <div
            className={`fixed top-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl max-w-sm shadow-2xl ${exiting ? 'toast-exit' : 'toast-enter'
                }`}
            style={{
                background: isSuccess ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${isSuccess ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                backdropFilter: 'blur(16px)',
                boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${isSuccess ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}`,
            }}
        >
            {isSuccess
                ? <CheckCircle2 size={22} style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }} />
                : <XCircle size={22} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
            }
            <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: isSuccess ? '#10b981' : '#ef4444' }}>
                    {isSuccess ? 'Berhasil!' : 'Gagal!'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{message}</p>
            </div>
            <button
                onClick={() => { setExiting(true); setTimeout(onClose, 350) }}
                style={{ color: '#64748b' }}
                className="mt-0.5 hover:text-white transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    )
}
