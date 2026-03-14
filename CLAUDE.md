# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Development server at http://localhost:3000
pnpm build    # Production build
pnpm start    # Run production server
```

No lint or test commands are configured.

## Architecture

This is an interactive 3D portfolio built with Next.js 16 (App Router) showcasing 68 projects across 6 galaxies. Projects are visualized as planets in a WebGL/WebGPU 3D scene.

### Core Data Flow

**Single source of truth**: `src/lib/galaxyData.ts` contains all project data. The `galaxies` array defines 6 galaxies (Enterprise, AI, Full-Stack, DevTools, Creative, Experimental), each containing an array of `Project` objects.

**State management**: `src/lib/store.ts` uses Zustand with two stores:
- `useViewStore` - Navigation state machine with views: `universe` → `galaxy` → `project` → `exploration`
- `useMotionStore` - Reduced motion preferences

### 3D Scene Architecture

The homepage (`src/app/page.tsx`) lazy-loads `GalaxyScene.tsx` to keep initial bundle under 200KB.

**Key 3D components** in `src/components/3d/`:
- `GalaxyScene.tsx` - Main container, orchestrates camera and all 3D elements
- `EnhancedProjectStars.tsx` - Renders projects as interactive star/planet meshes
- `RealisticPlanet.tsx` - Procedural planet shaders (GLSL) with atmospheres
- `PlanetSurfaceExplorer.tsx` - First-person exploration mode (WASD controls)
- `WebGPUCanvas.tsx` - WebGPU-ready renderer with WebGL fallback

Camera navigation uses animated transitions between view states. Galaxy positions are calculated by `getGalaxyCenterPosition()` in `utils.ts`.

### UI Layer

**Components** in `src/components/ui/`:
- `CommandPalette.tsx` - CMD+K quick search
- `KeyboardNavigation.tsx` - Arrow keys, number keys, ESC handling
- `ProjectModal.tsx` - Project detail overlay
- `GalaxyGuide.tsx` - AI chat assistant (uses MINMAX_API_KEY)
- `Entrance.tsx` - Initial landing overlay

### Routes

- `/` - 3D Galaxy homepage (client-side, lazy-loaded)
- `/work` - SSG project list
- `/work/[slug]` - SSG case study pages (slug = project.id)
- `/about`, `/contact`, `/privacy` - Static pages

### Types

Core interfaces in `src/lib/types.ts`:
- `Project` - id, title, description, role, tags, galaxy, size, links, metrics, featured
- `Galaxy` - id, name, color, projects[]
- `ViewState` - 'universe' | 'galaxy' | 'project' | 'exploration'

### Adding Projects

Edit `src/lib/galaxyData.ts` and add to the appropriate galaxy's `projects` array:

```typescript
{
  id: 'slug-for-urls',
  title: 'Project Name',
  description: 'Description text',
  role: 'Developer',
  tags: ['React', 'TypeScript'],
  color: '#FF6B35',  // Inherited from galaxy
  brightness: 1.5,   // 0.5-2.0, affects visual size
  size: 'large',     // small | medium | large | supermassive
  galaxy: 'ai',      // Must match galaxy.id
  links: { github: '...', live: '...' },
  featured: true,
  dateRange: '2024',
}
```

### Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://elizabethannstein.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Optional
MINMAX_API_KEY=...              # Optional, for Galaxy Guide AI
```
