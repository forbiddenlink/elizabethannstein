import type { CityModel } from './types'

// Demo fleet — 3 biomes with distinct bioluminescent palettes.
// Labels are dev-facing; the public snapshot skin sanitizes them (Phase 1).
export const demoCity: CityModel = {
  generatedAt: '2026-08-16T00:00:00.000Z',
  districts: [
    { id: 'personal', label: 'Personal', palette: { base: '#0a2a4f', glow: '#39ffd0' } },
    { id: 'agency', label: 'Agency', palette: { base: '#241047', glow: '#b74bff' } },
    { id: 'crc', label: 'CRC', palette: { base: '#3a2408', glow: '#ffb347' } },
  ],
  nodes: [
    // personal — teal biome
    {
      id: 'p1',
      districtId: 'personal',
      metrics: { ageDays: 12, activityScore: 0.95, sizeScore: 0.7 },
    },
    {
      id: 'p2',
      districtId: 'personal',
      metrics: { ageDays: 40, activityScore: 0.7, sizeScore: 0.4 },
    },
    {
      id: 'p3',
      districtId: 'personal',
      metrics: { ageDays: 5, activityScore: 0.85, sizeScore: 0.9 },
    },
    {
      id: 'p4',
      districtId: 'personal',
      metrics: { ageDays: 200, activityScore: 0.15, sizeScore: 0.5 },
    },
    {
      id: 'p5',
      districtId: 'personal',
      metrics: { ageDays: 365, activityScore: 0.05, sizeScore: 0.6 },
    },
    // agency — violet biome
    {
      id: 'a1',
      districtId: 'agency',
      metrics: { ageDays: 25, activityScore: 0.6, sizeScore: 0.8 },
    },
    {
      id: 'a2',
      districtId: 'agency',
      metrics: { ageDays: 60, activityScore: 0.3, sizeScore: 0.2 },
    },
    {
      id: 'a3',
      districtId: 'agency',
      metrics: { ageDays: 15, activityScore: 0.8, sizeScore: 0.55 },
    },
    {
      id: 'a4',
      districtId: 'agency',
      metrics: { ageDays: 120, activityScore: 0.2, sizeScore: 0.35 },
    },
    {
      id: 'a5',
      districtId: 'agency',
      metrics: { ageDays: 8, activityScore: 0.9, sizeScore: 0.65 },
    },
    // crc — amber biome
    { id: 'c1', districtId: 'crc', metrics: { ageDays: 30, activityScore: 0.75, sizeScore: 0.85 } },
    { id: 'c2', districtId: 'crc', metrics: { ageDays: 90, activityScore: 0.4, sizeScore: 0.5 } },
    { id: 'c3', districtId: 'crc', metrics: { ageDays: 3, activityScore: 0.98, sizeScore: 0.95 } },
    { id: 'c4', districtId: 'crc', metrics: { ageDays: 250, activityScore: 0.1, sizeScore: 0.4 } },
    { id: 'c5', districtId: 'crc', metrics: { ageDays: 45, activityScore: 0.55, sizeScore: 0.3 } },
  ],
  edges: [
    { from: 'p1', to: 'p3' },
    { from: 'p1', to: 'p2' },
    { from: 'a1', to: 'a3' },
    { from: 'a5', to: 'a1' },
    { from: 'c1', to: 'c3' },
    { from: 'c3', to: 'c5' },
    // cross-biome filaments
    { from: 'p3', to: 'a5' },
    { from: 'a3', to: 'c1' },
  ],
}
