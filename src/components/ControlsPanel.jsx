// src/components/ControlsPanel.jsx
import { useControls } from 'leva'
import { create } from 'zustand'

// Zustand store
export const useAppStore = create((set) => ({
  mode: 'point',
  color: '#ff0000',
  lightIntensity: 1,
  lightColor: '#ffffff',
  setMode: (mode) => set({ mode }),
  setColor: (color) => set({ color }),
  setLightIntensity: (val) => set({ lightIntensity: val }),
  setLightColor: (val) => set({ lightColor: val }),
}))

export default function ControlsPanel() {
  const { setMode, setColor, setLightIntensity, setLightColor } = useAppStore()

  useControls({
    Mode: {
      options: ['point', 'line', 'polygon'],
      value: 'point',
      onChange: setMode,
    },
    DrawColor: {
      value: '#ff0000',
      onChange: setColor,
    },
    LightIntensity: {
      value: 1,
      min: 0,
      max: 5,
      step: 0.1,
      onChange: setLightIntensity,
    },
    LightColor: {
      value: '#ffffff',
      onChange: setLightColor,
    },
  })

  return null
}
