# Data Flow

Single source of truth is `src/lib/galaxyData.ts` (the `galaxies` array of
projects). State flows through the view store into the lazy-loaded 3D scene,
which renders each project as a star/planet.

```mermaid
flowchart TD
    GD["galaxyData.ts<br/>galaxies[] · projects[]"] --> STORE["useViewStore (zustand)<br/>view · selectedGalaxy · selectedProject"]
    STORE --> PAGE["app/page.tsx<br/>dynamic import, ssr:false"]
    PAGE --> SCENE["3d/GalaxyScene.tsx"]
    SCENE --> STARS["EnhancedProjectStars"]
    SCENE --> PLANET["RealisticPlanet (GLSL shaders)"]
    SCENE --> EXPLORE["PlanetSurfaceExplorer (WASD)"]
    GD -. getProjectById .-> SCENE
    UTILS["utils.ts<br/>getGalaxyCenterPosition · generateProjectPosition"] --> SCENE
    TYPES["types.ts<br/>Project · Galaxy · ViewState"] -.types.-> GD
```

Key files: `src/app/page.tsx:32` (lazy `GalaxyScene`),
`src/components/3d/GalaxyScene.tsx:43-45` (imports galaxyData + store + utils).
Galaxy count / project count live in `galaxyData.ts`; do not duplicate the
numbers elsewhere.
