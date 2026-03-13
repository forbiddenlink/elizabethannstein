'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, X } from 'lucide-react'

interface VideoEmbedProps {
  url: string
  title?: string
  thumbnail?: string
  aspectRatio?: '16:9' | '4:3' | '1:1'
}

function getVideoId(url: string): { type: 'youtube' | 'loom' | 'vimeo' | 'unknown'; id: string } {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return { type: 'youtube', id: ytMatch[1] }

  // Loom
  const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/)
  if (loomMatch) return { type: 'loom', id: loomMatch[1] }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) return { type: 'vimeo', id: vimeoMatch[1] }

  return { type: 'unknown', id: '' }
}

function getEmbedUrl(type: string, id: string): string {
  switch (type) {
    case 'youtube':
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    case 'loom':
      return `https://www.loom.com/embed/${id}?autoplay=1`
    case 'vimeo':
      return `https://player.vimeo.com/video/${id}?autoplay=1`
    default:
      return ''
  }
}

function getThumbnailUrl(type: string, id: string): string {
  switch (type) {
    case 'youtube':
      return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    case 'loom':
      return `https://cdn.loom.com/sessions/thumbnails/${id}-with-play.gif`
    case 'vimeo':
      // Vimeo requires API call for thumbnail, use placeholder
      return ''
    default:
      return ''
  }
}

export function VideoEmbed({ url, title, thumbnail, aspectRatio = '16:9' }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const { type, id } = getVideoId(url)

  if (type === 'unknown' || !id) {
    return null
  }

  const embedUrl = getEmbedUrl(type, id)
  const defaultThumbnail = getThumbnailUrl(type, id)
  const thumbnailSrc = thumbnail || defaultThumbnail

  const aspectClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-4/3',
    '1:1': 'aspect-square',
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40">
      <div className={aspectClasses[aspectRatio]}>
        {isPlaying ? (
          <>
            <iframe
              src={embedUrl}
              title={title || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
              aria-label="Close video"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </>
        ) : (
          <motion.button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Thumbnail */}
            {thumbnailSrc && (
              <img
                src={thumbnailSrc}
                alt={title || 'Video thumbnail'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </motion.div>
            </div>

            {/* Title */}
            {title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-medium">{title}</p>
                <p className="text-white/60 text-sm capitalize">{type} video</p>
              </div>
            )}
          </motion.button>
        )}
      </div>
    </div>
  )
}

// Compact inline video button for case studies
export function VideoButton({ url, label = 'Watch Demo' }: { url: string; label?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { type, id } = getVideoId(url)

  if (type === 'unknown' || !id) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200 text-white"
      >
        <Play className="w-4 h-4" />
        <span>{label}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>
            <VideoEmbed url={url} />
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
