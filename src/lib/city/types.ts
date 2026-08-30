export type CityDistrict = { id: string; label: string; palette: { base: string; glow: string } }
export type CityNode = {
  id: string
  districtId: string
  metrics: { ageDays: number; activityScore: number; sizeScore: number }
}
export type CityEdge = { from: string; to: string }
export type CityModel = {
  generatedAt: string
  districts: CityDistrict[]
  nodes: CityNode[]
  edges: CityEdge[]
}
