import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the audio synth before importing store
vi.mock('@/components/ui/SoundManager', () => ({
  getAudioSynth: () => null,
}))

import { useViewStore } from '@/lib/store'

describe('useViewStore', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useViewStore.setState({
      view: 'universe',
      selectedGalaxy: null,
      selectedProject: null,
      isLanding: false,
      hasEntered: false,
      scannedPlanets: new Set(),
      scanningPlanet: null,
      scanProgress: 0,
      isJourneyMode: false,
      journeyStep: 0,
      isJourneyPaused: false,
      activeTourId: null,
    })
  })

  describe('initial state', () => {
    it('starts in universe view', () => {
      expect(useViewStore.getState().view).toBe('universe')
    })

    it('has no galaxy or project selected', () => {
      expect(useViewStore.getState().selectedGalaxy).toBeNull()
      expect(useViewStore.getState().selectedProject).toBeNull()
    })

    it('has not entered yet', () => {
      expect(useViewStore.getState().hasEntered).toBe(false)
    })
  })

  describe('enter', () => {
    it('sets hasEntered to true', () => {
      useViewStore.getState().enter()
      expect(useViewStore.getState().hasEntered).toBe(true)
    })
  })

  describe('zoomToGalaxy', () => {
    it('sets galaxy view and galaxy ID', () => {
      useViewStore.getState().zoomToGalaxy('ai')
      const state = useViewStore.getState()
      expect(state.view).toBe('galaxy')
      expect(state.selectedGalaxy).toBe('ai')
    })

    it('clears selected project', () => {
      useViewStore.setState({ selectedProject: 'some-project' })
      useViewStore.getState().zoomToGalaxy('ai')
      expect(useViewStore.getState().selectedProject).toBeNull()
    })
  })

  describe('zoomToProject', () => {
    it('sets project view and project ID', () => {
      useViewStore.getState().zoomToProject('lumira')
      const state = useViewStore.getState()
      expect(state.view).toBe('project')
      expect(state.selectedProject).toBe('lumira')
    })

    it('auto-selects the parent galaxy', () => {
      useViewStore.getState().zoomToProject('lumira')
      // lumira is in the 'ai' galaxy
      expect(useViewStore.getState().selectedGalaxy).toBe('ai')
    })
  })

  describe('zoomOut', () => {
    it('goes from project to galaxy', () => {
      useViewStore.setState({ view: 'project', selectedGalaxy: 'ai', selectedProject: 'lumira' })
      useViewStore.getState().zoomOut()
      const state = useViewStore.getState()
      expect(state.view).toBe('galaxy')
      expect(state.selectedProject).toBeNull()
    })

    it('goes from galaxy to universe', () => {
      useViewStore.setState({ view: 'galaxy', selectedGalaxy: 'ai' })
      useViewStore.getState().zoomOut()
      const state = useViewStore.getState()
      expect(state.view).toBe('universe')
      expect(state.selectedGalaxy).toBeNull()
    })

    it('stays at universe if already there', () => {
      useViewStore.getState().zoomOut()
      expect(useViewStore.getState().view).toBe('universe')
    })

    it('goes from exploration to galaxy', () => {
      useViewStore.setState({ view: 'exploration', selectedGalaxy: 'ai', selectedProject: 'lumira' })
      useViewStore.getState().zoomOut()
      const state = useViewStore.getState()
      expect(state.view).toBe('galaxy')
      expect(state.selectedProject).toBeNull()
    })
  })

  describe('reset', () => {
    it('returns to universe with nothing selected', () => {
      useViewStore.setState({ view: 'project', selectedGalaxy: 'ai', selectedProject: 'lumira' })
      useViewStore.getState().reset()
      const state = useViewStore.getState()
      expect(state.view).toBe('universe')
      expect(state.selectedGalaxy).toBeNull()
      expect(state.selectedProject).toBeNull()
    })
  })

  describe('exploreProject', () => {
    it('enters exploration mode with landing', () => {
      useViewStore.getState().exploreProject('lumira')
      const state = useViewStore.getState()
      expect(state.view).toBe('exploration')
      expect(state.selectedProject).toBe('lumira')
      expect(state.isLanding).toBe(true)
    })
  })

  describe('exitExploration', () => {
    it('returns to galaxy view if galaxy was selected', () => {
      useViewStore.setState({ view: 'exploration', selectedGalaxy: 'ai', selectedProject: 'lumira' })
      useViewStore.getState().exitExploration()
      expect(useViewStore.getState().view).toBe('galaxy')
      expect(useViewStore.getState().selectedProject).toBeNull()
    })

    it('returns to universe if no galaxy was selected', () => {
      useViewStore.setState({ view: 'exploration', selectedGalaxy: null, selectedProject: 'lumira' })
      useViewStore.getState().exitExploration()
      expect(useViewStore.getState().view).toBe('universe')
    })
  })

  describe('scan actions', () => {
    it('tracks scan progress', () => {
      useViewStore.getState().startScan('lumira')
      expect(useViewStore.getState().scanningPlanet).toBe('lumira')
      expect(useViewStore.getState().scanProgress).toBe(0)

      useViewStore.getState().updateScanProgress(0.5)
      expect(useViewStore.getState().scanProgress).toBe(0.5)
    })

    it('clamps scan progress to [0, 1]', () => {
      useViewStore.getState().updateScanProgress(1.5)
      expect(useViewStore.getState().scanProgress).toBe(1)

      useViewStore.getState().updateScanProgress(-0.5)
      expect(useViewStore.getState().scanProgress).toBe(0)
    })

    it('completes scan and adds to scanned set', () => {
      useViewStore.getState().startScan('lumira')
      useViewStore.getState().completeScan('lumira')
      const state = useViewStore.getState()
      expect(state.scannedPlanets.has('lumira')).toBe(true)
      expect(state.scanningPlanet).toBeNull()
      expect(state.scanProgress).toBe(0)
    })

    it('cancels scan', () => {
      useViewStore.getState().startScan('lumira')
      useViewStore.getState().updateScanProgress(0.7)
      useViewStore.getState().cancelScan()
      expect(useViewStore.getState().scanningPlanet).toBeNull()
      expect(useViewStore.getState().scanProgress).toBe(0)
    })
  })

  describe('journey mode', () => {
    it('starts and ends journey', () => {
      useViewStore.getState().startJourney()
      expect(useViewStore.getState().isJourneyMode).toBe(true)
      expect(useViewStore.getState().journeyStep).toBe(0)

      useViewStore.getState().endJourney()
      expect(useViewStore.getState().isJourneyMode).toBe(false)
    })

    it('navigates journey steps', () => {
      useViewStore.getState().startJourney()
      useViewStore.getState().nextJourneyStop()
      expect(useViewStore.getState().journeyStep).toBe(1)
      useViewStore.getState().nextJourneyStop()
      expect(useViewStore.getState().journeyStep).toBe(2)
      useViewStore.getState().prevJourneyStop()
      expect(useViewStore.getState().journeyStep).toBe(1)
    })

    it('supports narrative tours', () => {
      useViewStore.getState().startJourney('ai-journey')
      expect(useViewStore.getState().activeTourId).toBe('ai-journey')
    })
  })
})
