import React from 'react'
import { UtensilsCrossed, X } from 'lucide-react'

export default function MealModal({ onAnswer, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(12px)' }}>

            <div className="w-full max-w-md rounded-2xl p-8 relative"
                style={{
                    background: 'linear-gradient(135deg, #111827 0%, #0f172a 100%)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.08)',
                    animation: 'fade-in 0.25s ease forwards',
                }}>

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(200,34,42,0.2), rgba(160,24,32,0.2))', border: '1px solid rgba(200,34,42,0.3)' }}>
                        <UtensilsCrossed size={28} style={{ color: '#E03038' }} />
                    </div>
                </div>

                {/* Text */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        Staff Meal
                    </h2>
                    <p className="text-base leading-relaxed" style={{ color: '#94a3b8' }}>
                        Apakah Anda mengambil jatah<br />
                        <strong style={{ color: 'var(--color-text-primary)' }}>Staff Meal</strong> hari ini?
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => onAnswer(false)}
                        className="flex-1 py-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
                        style={{
                            background: 'rgba(15,23,42,0.8)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-muted)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(100,116,139,0.5)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
                    >
                        Tidak
                    </button>
                    <button
                        onClick={() => onAnswer(true)}
                        className="flex-1 py-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, #C8222A, #A01820)',
                            color: 'white',
                            boxShadow: '0 4px 20px rgba(200,34,42,0.4)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 30px rgba(200,34,42,0.6)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,34,42,0.4)'}
                    >
                        Ya, Ambil Meal
                    </button>
                </div>
            </div>
        </div>
    )
}
