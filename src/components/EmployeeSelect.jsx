import React from 'react'
import { ChevronDown, User } from 'lucide-react'

const EMPLOYEES = [
    'Syahrul',
    'Bagus',
]

export default function EmployeeSelect({ value, onChange }) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--color-text-muted)' }}>
                <User size={12} />
                Pilih Nama
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none rounded-xl px-4 py-3.5 pr-10 text-sm font-medium outline-none transition-all duration-200 cursor-pointer"
                    style={{
                        background: 'rgba(15,23,42,0.8)',
                        border: '1px solid var(--color-border)',
                        color: value ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(200,34,42,0.6)'
                        e.target.style.boxShadow = '0 0 0 3px rgba(200,34,42,0.1), inset 0 1px 0 rgba(255,255,255,0.04)'
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-border)'
                        e.target.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04)'
                    }}
                >
                    <option value="" style={{ background: '#111827' }}>— Pilih Nama —</option>
                    {EMPLOYEES.map((name) => (
                        <option key={name} value={name} style={{ background: '#111827' }}>{name}</option>
                    ))}
                </select>
                <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--color-text-muted)' }}
                />
            </div>
        </div>
    )
}
