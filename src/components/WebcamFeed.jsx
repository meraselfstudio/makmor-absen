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

    const handleUserMediaError = useCallback(() => {
        setStatus('error')
    }, [])

    const handleUserMedia = useCallback(() => {
        setStatus('ready')
        setTimeout(() => {
            setFaceDetected(true)
            onReady?.()
        }, 1000)
    }, [onReady])

    return (
        <div className="relative w-full h-full overflow-hidden bg-black">

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

            {/* Screen overlay to make UI readable */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 60%, rgba(0,0,0,0.8) 100%)' }} />

            {/* Loading state */}
            {status === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-md bg-black/40 z-10">
                    <Loader2 size={40} className="animate-spin text-white" />
                </div>
            )}

            {/* Error state */}
            {status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black z-10 p-6 text-center">
                    <AlertCircle size={40} className="text-red-500" />
                    <p className="text-base font-medium text-white">Camera Access Denied</p>
                    <p className="text-sm text-white/60">
                        Please allow camera permissions in your browser to use Face ID.
                    </p>
                </div>
            )}

            {/* === HUD OVERLAY (Apple FaceID Style) === */}
            {status === 'ready' && (
                <div className="absolute inset-x-0 top-[20vh] md:top-[25vh] flex flex-col items-center justify-center pointer-events-none">
                    {/* Face detection frame */}
                    <div
                        className="relative transition-all duration-700 ease-in-out"
                        style={{
                            width: '280px',
                            height: '280px',
                            borderRadius: '3rem',
                            border: `2px solid ${faceDetected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'}`,
                            boxShadow: faceDetected ? '0 0 40px rgba(255,255,255,0.2)' : 'none'
                        }}
                    >
                        {/* Scanning line animation */}
                        {!faceDetected && (
                            <div className="absolute left-0 right-0 h-[2px] bg-white opacity-50 shadow-[0_0_8px_white]"
                                style={{ animation: 'scanline 2s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
                        )}

                        {/* Status Label (Glass Pill) */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                                style={{
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(16px)',
                                }}>
                                {faceDetected ? (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                        <span className="text-[11px] font-semibold text-white tracking-widest uppercase">
                                            Face Detected
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Loader2 size={12} className="text-white/70 animate-spin" />
                                        <span className="text-[11px] font-medium text-white/70 tracking-widest uppercase">
                                            Position your face
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
