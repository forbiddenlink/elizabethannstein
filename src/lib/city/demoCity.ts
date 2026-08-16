import type { CityModel } from './types'

export const demoCity: CityModel = {
  generatedAt: '2026-08-16T00:00:00.000Z',
  districts: [{ id: 'personal', label: 'Personal', palette: { base: '#0a2a4f', glow: '#39ffd0' } }],
  nodes: [
    {
      id: 'n1',
      districtId: 'personal',
      metrics: { ageDays: 12, activityScore: 0.95, sizeScore: 0.7 },
    },
    {
      id: 'n2',
      districtId: 'personal',
      metrics: { ageDays: 40, activityScore: 0.7, sizeScore: 0.4 },
    },
    {
      id: 'n3',
      districtId: 'personal',
      metrics: { ageDays: 5, activityScore: 0.85, sizeScore: 0.9 },
    },
    {
      id: 'n4',
      districtId: 'personal',
      metrics: { ageDays: 200, activityScore: 0.15, sizeScore: 0.5 },
    },
    {
      id: 'n5',
      districtId: 'personal',
      metrics: { ageDays: 90, activityScore: 0.45, sizeScore: 0.3 },
    },
    {
      id: 'n6',
      districtId: 'personal',
      metrics: { ageDays: 365, activityScore: 0.05, sizeScore: 0.6 },
    },
    {
      id: 'n7',
      districtId: 'personal',
      metrics: { ageDays: 25, activityScore: 0.6, sizeScore: 0.8 },
    },
    {
      id: 'n8',
      districtId: 'personal',
      metrics: { ageDays: 60, activityScore: 0.3, sizeScore: 0.2 },
    },
  ],
  edges: [
    { from: 'n1', to: 'n3' },
    { from: 'n1', to: 'n7' },
    { from: 'n2', to: 'n5' },
    { from: 'n3', to: 'n7' },
  ],
}
