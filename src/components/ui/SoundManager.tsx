'use client'

import { useViewStore } from '@/lib/store'
import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function SoundManager() {
  const [isMuted, setIsMuted] = useState(true) // Start muted by default
  const [isClient, setIsClient] = useState(false)
  const synthRef = useRef<AudioSynth | null>(null)
  const hasEntered = useViewStore((state) => state.hasEntered)

  useEffect(() => {
    setIsClient(true)
    // Use the singleton to avoid a second AudioContext alongside store's instance
    synthRef.current = getAudioSynth()

    return () => {
      // Don't destroy singleton on unmount — store and other components share it
    }
  }, [])

  useEffect(() => {
    if (!synthRef.current) return

    if (!isMuted && hasEntered) {
      synthRef.current.resume()
      synthRef.current.playDrone()
    } else {
      synthRef.current.stopDrone()
    }
  }, [isMuted, hasEntered])

  useEffect(() => {
    if (!isClient || !synthRef.current) return

    const handleButtonHover = () => !isMuted && synthRef.current?.playHover()
    const handleButtonClick = () => !isMuted && synthRef.current?.playClick()

    // Add event listeners to buttons
    const buttons = document.querySelectorAll('button, a[href], [role="button"]')
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', handleButtonHover)
      button.addEventListener('click', handleButtonClick)
    })

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener('mouseenter', handleButtonHover)
        button.removeEventListener('click', handleButtonClick)
      })
    }
  }, [isMuted, isClient])

  if (!isClient || !hasEntered) return null

  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      className="fixed bottom-6 left-56 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300 group hover:scale-110 hidden lg:flex"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
      title={isMuted ? 'Enable sound effects' : 'Disable sound effects'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
      ) : (
        <Volume2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      )}
    </button>
  )
}

// Separate synth class to keep component clean
class AudioSynth {
  ctx: AudioContext | null = null
  masterGain: GainNode | null = null
  droneOscillators: OscillatorNode[] = []
  droneGain: GainNode | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioContextClass()
      this.masterGain = this.ctx.createGain()
      this.masterGain.connect(this.ctx.destination)
      this.masterGain.gain.value = 0.3 // Master volume
    }
  }

  resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playDrone() {
    if (!this.ctx || !this.masterGain || this.droneOscillators.length > 0) return

    this.droneGain = this.ctx.createGain()
    this.droneGain.connect(this.masterGain)
    this.droneGain.gain.value = 0.0

    // Low frequency drone
    const osc1 = this.ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = 55 // A1

    // Slight detune for texture
    const osc2 = this.ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 112 // A2 approx

    osc1.connect(this.droneGain)
    osc2.connect(this.droneGain)

    osc1.start()
    osc2.start()

    this.droneOscillators = [osc1, osc2]

    // Fade in
    this.droneGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 2)
  }

  stopDrone() {
    if (!this.droneGain || !this.ctx) return

    // Fade out
    this.droneGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5)

    setTimeout(() => {
      this.droneOscillators.forEach((o) => o.stop())
      this.droneOscillators = []
      this.droneGain?.disconnect()
      this.droneGain = null
    }, 500)
  }

  playClick() {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.connect(gain)
    gain.connect(this.masterGain)

    // High tech click
    osc.type = 'sine'
    osc.frequency.setValueAtTime(2000, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.1)
  }

  playHover() {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.connect(gain)
    gain.connect(this.masterGain)

    // Subtle hover chirp
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, this.ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.05)
  }

  // Whoosh sound for galaxy navigation / hyperspace
  playWarp() {
    if (!this.ctx || !this.masterGain) return

    // Create noise for whoosh texture
    const bufferSize = this.ctx.sampleRate * 0.8
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    // Bandpass filter for whoosh character
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(200, this.ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.3)
    filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.8)
    filter.Q.value = 1

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.1)
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.4)
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    noise.start()
    noise.stop(this.ctx.currentTime + 0.8)
  }

  // Descent/zoom sound for project selection
  playZoom() {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.connect(gain)
    osc2.connect(gain)
    gain.connect(this.masterGain)

    // Descending tone
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.4)

    // Harmonic
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1200, this.ctx.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.4)

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4)

    osc.start()
    osc2.start()
    osc.stop(this.ctx.currentTime + 0.4)
    osc2.stop(this.ctx.currentTime + 0.4)
  }

  // Success/completion chime
  playSuccess() {
    if (!this.ctx || !this.masterGain) return

    const notes = [523.25, 659.25, 783.99] // C5, E5, G5 - major chord
    const duration = 0.15

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()

      osc.connect(gain)
      gain.connect(this.masterGain!)

      osc.type = 'sine'
      osc.frequency.value = freq

      const startTime = this.ctx!.currentTime + i * 0.08
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.06, startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      osc.start(startTime)
      osc.stop(startTime + duration)
    })
  }
}

// Export singleton for use in 3D components
let audioSynthInstance: AudioSynth | null = null

export function getAudioSynth(): AudioSynth | null {
  if (typeof window === 'undefined') return null
  if (!audioSynthInstance) {
    audioSynthInstance = new AudioSynth()
  }
  return audioSynthInstance
}
