# 🌌 Galaxy Portfolio

Elizabeth Stein's interactive 3D portfolio - an Awwwards-quality experience showcasing 68 projects across 6 galaxies with planetary exploration.

## ✨ Features

### 🚀 3D Galaxy Experience
- **Interactive Solar System**: Navigate 68 projects represented as realistic planets
- **Planetary Exploration**: Land on planets and walk around in first-person mode (WASD controls)
- **Cinematic Animations**: GSAP-powered camera transitions and landing sequences
- **Procedural Planets**: GLSL shaders with realistic atmospheres, clouds, and ring systems

### ⌨️ Advanced Navigation
- **Command Palette** (CMD/CTRL+K): Quick search and exploration commands
- **Keyboard Shortcuts**: Arrow keys, 1-6 for galaxies, Enter/Escape navigation
- **Deep Linking**: Share direct links to projects with `/?p=[slug]`
- **Minimap Navigator**: Overview of entire galaxy system

### 🎨 Modern UI/UX
- Glassmorphism design with backdrop blur effects
- Custom cursor with spotlight and particle trails
- Touch gesture support for mobile devices
- Holographic project panels in exploration mode
- Ambient glow orbs and morphing backgrounds

### 🎯 SEO & Performance
- **< 200KB Initial Bundle**: 3D scene lazy-loaded for instant FCP
- **SSG for All Routes**: `/work` and `/work/[slug]` pre-rendered
- **Comprehensive SEO**: Sitemap, robots.txt, JSON-LD, Open Graph, Twitter Cards
- **Error Boundaries**: Graceful WebGL fallback for unsupported browsers
- **Analytics Ready**: Google Analytics integration

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Run development server
pnpm dev

# Build for production
pnpm build
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **UI**: React 19.2.3, TypeScript 5.9.3, Tailwind CSS 4.1.18
- **3D**: Three.js, React Three Fiber, React Three Drei
- **Animation**: GSAP, Framer Motion
- **State**: Zustand
- **Fonts**: Space Grotesk, JetBrains Mono (Google Fonts)

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + SEO + JSON-LD
│   ├── page.tsx                # 3D Galaxy homepage
│   ├── globals.css             # Tailwind v4 + design tokens
│   ├── loading.tsx             # Loading state
│   ├── not-found.tsx           # 404 page
│   ├── sitemap.ts              # Auto-generated sitemap
│   ├── robots.ts               # SEO robots config
│   ├── manifest.ts             # PWA manifest
│   ├── opengraph-image.tsx     # Dynamic OG image generation
│   ├── about/
│   │   └── page.tsx            # About page with JSON-LD
│   ├── contact/
│   │   └── page.tsx            # Contact page
│   ├── privacy/
│   │   └── page.tsx            # Privacy policy
│   └── work/
│       ├── page.tsx            # SSG project list view
│       └── [slug]/
│           └── page.tsx        # SSG case studies
├── components/
│   ├── 3d/
│   │   ├── GalaxyScene.tsx           # Main 3D container
│   │   ├── RealisticPlanet.tsx       # Procedural planet shaders
│   │   ├── PlanetSurfaceExplorer.tsx # First-person exploration
│   │   ├── NebulaBackground.tsx      # Nebula particle effects
│   │   └── WebGPUCanvas.tsx          # WebGPU-ready renderer
│   ├── ui/
│   │   ├── CommandPalette.tsx        # CMD+K quick actions
│   │   ├── KeyboardNavigation.tsx    # Arrow key controls
│   │   ├── ProjectModal.tsx          # Project detail modal
│   │   ├── ContactSection.tsx        # Email/social links
│   │   ├── SocialIcons.tsx           # Custom SVG social icons
│   │   ├── ResumeDownload.tsx        # Resume PDF download
│   │   ├── ExplorationOverlay.tsx    # Planetary exploration UI
│   │   ├── GalaxyGuide.tsx           # AI chat assistant
│   │   └── HolographicProjectPanel.tsx
│   ├── projects/
│   │   └── ProjectCaseStudy.tsx      # Shared case study component
│   ├── work/
│   │   └── WorkPageClient.tsx        # Client-side work page
│   ├── Analytics.tsx                 # Google Analytics
│   └── ErrorBoundary.tsx             # WebGL fallback
└── lib/
    ├── types.ts                # TypeScript interfaces
    ├── galaxyData.ts           # Single source of truth (68 projects)
    ├── constants.ts            # Design tokens and constants
    ├── store.ts                # Zustand state management
    ├── easings.ts              # Animation easing functions
    └── utils.ts                # Helper functions
```

## ⚙️ Configuration

### Environment Variables

Create `.env.local`:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://elizabethannstein.com

# Optional - Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional - Galaxy Guide AI chat
MINMAX_API_KEY=your-key-here
```

### Customization

**Add Projects**: Edit `src/lib/galaxyData.ts`:

```typescript
{
  id: 'my-project',
  title: 'My Project',
  description: 'Description here',
  role: 'Developer',
  tags: ['React', 'TypeScript'],
  color: '#FF6B35',
  brightness: 1.5,
  size: 'large',
  galaxy: 'fullstack',
  links: { github: '...', live: '...' },
  featured: true,
  dateRange: '2024',
}
```

**Update Contact Info**:
- Edit `src/components/ui/ContactSection.tsx` with your links
- Update `src/app/layout.tsx` JSON-LD schema

**Add Resume**: Place PDF at `public/resume.pdf`

## ⌨️ Keyboard Shortcuts

- **Arrow Keys**: Navigate between projects/galaxies
- **1-6**: Jump to specific galaxy
- **Enter**: Select/zoom into project or galaxy
- **Escape**: Zoom out / return to previous view
- **H**: Return home (universe view)
- **CMD/CTRL + K**: Open command palette
- **?**: Show keyboard shortcuts help

## 🔗 Routes

- `/` - 3D Galaxy experience (lazy-loaded)
- `/work` - Project list view (SSG, fast path)
- `/work/[slug]` - Individual project pages (SSG)
- `/about` - About page with structured data
- `/contact` - Contact information
- `/privacy` - Privacy policy
- `/sitemap.xml` - Auto-generated sitemap
- `/robots.txt` - SEO configuration

## 🎯 Performance

- ✅ **< 200KB** initial bundle (3D lazy-loaded)
- ✅ **SSG** for all `/work` routes
- ✅ **60 FPS** 3D rendering on desktop
- ✅ **AVIF/WebP** image optimization
- ✅ **Code splitting** for optimal loading

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Requires WebGL**. Error boundary provides fallback for unsupported browsers.

## 🚀 Deployment

```bash
# Build
pnpm build

# Deploy to Vercel (recommended)
vercel deploy
```

---

**Elizabeth Stein** - Full-Stack Developer & AI Integration Specialist
[GitHub](https://github.com/forbiddenlink) • [LinkedIn](https://linkedin.com/in/imkindageeky)
