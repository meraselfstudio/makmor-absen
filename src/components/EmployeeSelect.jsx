import React from 'react'
import { ChevronDown, User } from 'lucide-react'

const EMPLOYEES = [
    'Syahrul',
    'Bagus',
]

export default function EmployeeSelect({ value, onChange }) {
    return (
        <div className="space-y-2 mt-2">
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none rounded-[2rem] px-5 py-4 pl-12 pr-12 text-[15px] font-semibold outline-none transition-all duration-300 cursor-pointer"
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        color: value ? '#fff' : 'rgba(255,255,255,0.4)',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(200,34,42,0.6)'
                        e.target.style.background = 'rgba(255,255,255,0.1)'
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.05)'
                        e.target.style.background = 'rgba(255,255,255,0.06)'
                    }}
                >
                    <option value="" className="text-black bg-white/90">— Pilih Nama Karyawan —</option>
                    {EMPLOYEES.map((name) => (
                        <option key={name} value={name} className="text-black bg-white/90">{name}</option>
                    ))}
                </select>
                <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: value ? '#fff' : 'rgba(255,255,255,0.4)' }}
                />
                <ChevronDown
                    size={20}
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                />
            </div>
        </div>
    )
}
