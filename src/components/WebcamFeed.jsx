import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Camera, Loader2, AlertCircle } from 'lucide-react'

const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',
}

export default function WebcamFeed({ webcamRef, onReady }) {
    const [status, setStatus] = useState('loading') // loading | ready | error
    const [faceDetected, setFaceDetected] = useState(false)

    const handleUserMedia = useCallback(() => {
        setStatus('ready')
        // Simulate "face detection" after 2 seconds of camera being ready
        setTimeout(() => {
            setFaceDetected(true)
            onReady?.()
        }, 1000)
    }, [onReady])

    const handleUserMediaError = useCallback(() => {
        setStatus('error')
    }, [])

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden"
            style={{ background: '#0a0505', border: '1px solid var(--color-border)' }}>

            {/* Webcam stream */}
            {status !== 'error' && (
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={0.85}
                    videoConstraints={videoConstraints}
                    onUserMedia={handleUserMedia}
                    onUserMediaError={handleUserMediaError}
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                />
            )}

            {/* Loading state */}
            {status === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                    style={{ background: '#0a0505' }}>
                    <Loader2 size={40} className="animate-spin" style={{ color: '#C8222A' }} />
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Mengaktifkan kamera...</p>
                </div>
            )}

            {/* Error state */}
            {status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                    style={{ background: '#0a0505' }}>
                    <AlertCircle size={40} style={{ color: '#ef4444' }} />
                    <p className="text-sm font-medium" style={{ color: '#ef4444' }}>Kamera tidak dapat diakses</p>
                    <p className="text-xs text-center px-6" style={{ color: 'var(--color-text-muted)' }}>
                        Pastikan browser memiliki izin untuk menggunakan kamera
                    </p>
                </div>
            )}

            {/* === SCANNER OVERLAY === */}
            {status === 'ready' && (
                <>
                    {/* Grid background */}
                    <div className="scan-grid absolute inset-0 pointer-events-none" />

                    {/* Moving scanline */}
                    <div className="scan-line absolute left-0 right-0 pointer-events-none" style={{ top: '20%' }} />

                    {/* Corner brackets */}
                    <div className="corner-tl" />
                    <div className="corner-tr" />
                    <div className="corner-bl" />
                    <div className="corner-br" />

                    {/* Face detection ring */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="face-ring transition-all duration-700"
                            style={{
                                width: '38%',
                                paddingBottom: '45%',
                                borderColor: faceDetected ? 'rgba(16,185,129,0.8)' : 'rgba(200,34,42,0.75)',
                            }}
                        />
                    </div>

                    {/* Status label */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full"
                            style={{
                                background: faceDetected ? 'rgba(16,185,129,0.15)' : 'rgba(200,34,42,0.15)',
                                border: `1px solid ${faceDetected ? 'rgba(16,185,129,0.4)' : 'rgba(200,34,42,0.45)'}`,
                                backdropFilter: 'blur(8px)',
                            }}>
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                    background: faceDetected ? '#10b981' : '#C8222A',
                                    animation: 'dot-blink 1.2s ease-in-out infinite',
                                }}
                            />
                            <span className="text-xs font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: faceDetected ? '#10b981' : '#E03038' }}>
                                {faceDetected ? 'WAJAH TERDETEKSI' : 'MEMINDAI WAJAH...'}
                            </span>
                        </div>
                    </div>

                    {/* Top label */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                        <Camera size={12} style={{ color: '#C8222A' }} />
                        <span className="text-xs font-mono" style={{ color: '#6b5e5e' }}>LIVE • FACIAL RECOGNITION</span>
                    </div>

                    {/* REC dot */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600"
                            style={{ animation: 'dot-blink 1s ease-in-out infinite' }} />
                        <span className="text-xs font-mono text-red-500">REC</span>
                    </div>
                </>
            )}
        </div>
    )
}
