"use client"

import { useEffect, useRef } from "react"

/**
 * Animación de la portada: un diamante de voxels que se imprime capa por capa
 * sobre una cama de impresión, con plano láser y boquilla. Canvas 2D sin librerías.
 */

const R = 3
const C = 3
const LAYERS = 7
const HALF = 0.44
const BUILD = 0.5
const T_BUILD = LAYERS * BUILD + 0.3
const T_HOLD = T_BUILD + 2.4
const T_DIS = T_HOLD + 1.3
const PERIOD = T_DIS + 0.4
const TILT = 0.52
const LIGHT: Vec3 = [-0.35, 0.85, -0.4]

type Vec3 = [number, number, number]
type Voxel = { x: number; y: number; z: number }

const FACES: { n: Vec3; c: [number, number, number, number] }[] = [
  { n: [1, 0, 0], c: [1, 3, 7, 5] },
  { n: [-1, 0, 0], c: [0, 4, 6, 2] },
  { n: [0, 1, 0], c: [2, 6, 7, 3] },
  { n: [0, -1, 0], c: [0, 1, 5, 4] },
  { n: [0, 0, 1], c: [4, 5, 7, 6] },
  { n: [0, 0, -1], c: [0, 2, 3, 1] },
]

const VOXELS: Voxel[] = (() => {
  const list: Voxel[] = []
  for (let y = 0; y < LAYERS; y++)
    for (let x = 0; x < 7; x++)
      for (let z = 0; z < 7; z++)
        if (Math.abs(x - C) + Math.abs(y - C) + Math.abs(z - C) <= R)
          list.push({ x, y, z })
  return list
})()

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

const readAccent = (): Vec3 => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--brand-voxel")
    .trim()
  const match = /^#?([0-9a-f]{6})$/i.exec(value)
  if (!match) return [126, 63, 179]
  const n = parseInt(match[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

type HudState = { label: string; layer: number; progress: number }

interface Props {
  onHud?: (state: HudState) => void
}

export const VoxelPrinter = ({ onHud }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hudRef = useRef(onHud)
  hudRef.current = onHud

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const accent = readAccent()
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ct = Math.cos(TILT)
    const st = Math.sin(TILT)
    let width = 0
    let height = 0
    let k = 1
    let cx = 0
    let cy = 0
    let angle = 0.6
    let lastHud = ""

    const size = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      k = Math.min(width, height) / 9.6
      cx = width / 2
      cy = height * 0.47
    }

    const project = (p: Vec3): Vec3 => {
      const ca = Math.cos(angle)
      const sa = Math.sin(angle)
      const x1 = p[0] * ca + p[2] * sa
      const z1 = -p[0] * sa + p[2] * ca
      const y2 = p[1] * ct + z1 * st
      const z2 = -p[1] * st + z1 * ct
      const s = 1 / (1 + z2 * 0.035)
      return [cx + x1 * k * s, cy - y2 * k * s, z2]
    }

    const rotateNormal = (n: Vec3): Vec3 => {
      const ca = Math.cos(angle)
      const sa = Math.sin(angle)
      const x1 = n[0] * ca + n[2] * sa
      const z1 = -n[0] * sa + n[2] * ca
      return [x1, n[1] * ct + z1 * st, -n[1] * st + z1 * ct]
    }

    const rgba = (f: number, a: number) => {
      let [r, g, b] = accent
      if (f > 1) {
        const w = Math.min(1, f - 1)
        r += (255 - r) * w
        g += (255 - g) * w
        b += (255 - b) * w
      } else {
        r *= f
        g *= f
        b *= f
      }
      return `rgba(${r | 0},${g | 0},${b | 0},${a})`
    }

    const emitHud = (state: HudState) => {
      const key = `${state.label}|${state.layer}|${Math.round(state.progress * 20)}`
      if (key === lastHud) return
      lastHud = key
      hudRef.current?.(state)
    }

    const frame = (t: number) => {
      ctx.clearRect(0, 0, width, height)

      // Cama de impresión
      const bedY = -C - 0.62
      ctx.lineWidth = 1
      for (let i = -4; i <= 4; i++) {
        const a1 = project([i, bedY, -4])
        const a2 = project([i, bedY, 4])
        const b1 = project([-4, bedY, i])
        const b2 = project([4, bedY, i])
        ctx.strokeStyle = rgba(1, Math.abs(i) === 4 ? 0.45 : 0.14)
        ctx.beginPath()
        ctx.moveTo(a1[0], a1[1])
        ctx.lineTo(a2[0], a2[1])
        ctx.moveTo(b1[0], b1[1])
        ctx.lineTo(b2[0], b2[1])
        ctx.stroke()
      }

      const items = VOXELS.map((v) => {
        const start = v.y * BUILD + (Math.abs(v.x - C) + Math.abs(v.z - C)) * 0.035
        const p = clamp01((t - start) / 0.32)
        const q = clamp01((t - (T_HOLD + (LAYERS - 1 - v.y) * 0.13)) / 0.45)
        const offset = (1 - p) * (1 - p) * 1.4 + q * 1.8
        const center: Vec3 = [v.x - C, v.y - C + offset, v.z - C]
        return {
          center,
          alpha: p * (1 - q),
          ghost: p <= 0,
          depth: project(center)[2],
        }
      })
      items.sort((a, b) => b.depth - a.depth)

      // Nube de puntos de lo que falta por imprimir
      ctx.fillStyle = rgba(1.4, 0.35)
      for (const item of items) {
        if (!item.ghost) continue
        const g = project(item.center)
        ctx.fillRect(g[0] - 1, g[1] - 1, 2, 2)
      }

      // Voxels
      for (const item of items) {
        if (item.alpha <= 0.01) continue
        const corners: Vec3[] = []
        for (let m = 0; m < 8; m++) {
          corners.push(
            project([
              item.center[0] + (m & 1 ? HALF : -HALF),
              item.center[1] + (m & 2 ? HALF : -HALF),
              item.center[2] + (m & 4 ? HALF : -HALF),
            ])
          )
        }
        for (const face of FACES) {
          const n = rotateNormal(face.n)
          if (n[2] >= 0) continue
          const lum = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]
          const shade = 0.42 + 0.75 * Math.max(0, lum)
          ctx.beginPath()
          ctx.moveTo(corners[face.c[0]][0], corners[face.c[0]][1])
          for (let e = 1; e < 4; e++) {
            ctx.lineTo(corners[face.c[e]][0], corners[face.c[e]][1])
          }
          ctx.closePath()
          ctx.fillStyle = rgba(shade, item.alpha)
          ctx.fill()
          ctx.strokeStyle = rgba(face.n[1] === 1 ? 1.55 : 1.2, item.alpha * 0.55)
          ctx.stroke()
        }
      }

      if (t < T_BUILD) {
        const layer = Math.min(LAYERS, Math.floor(t / BUILD) + 1)
        const py = layer - 1 - C + 0.5
        const ext = 3.6
        const q1 = project([-ext, py, -ext])
        const q2 = project([ext, py, -ext])
        const q3 = project([ext, py, ext])
        const q4 = project([-ext, py, ext])
        ctx.beginPath()
        ctx.moveTo(q1[0], q1[1])
        ctx.lineTo(q2[0], q2[1])
        ctx.lineTo(q3[0], q3[1])
        ctx.lineTo(q4[0], q4[1])
        ctx.closePath()
        ctx.fillStyle = rgba(1.3, 0.07)
        ctx.fill()
        ctx.strokeStyle = rgba(1.5, 0.5)
        ctx.stroke()

        const radius = R - Math.abs(layer - 1 - C) + 0.4
        const nx = Math.sin(t * 7.3) * radius
        const nz = Math.cos(t * 4.1) * radius
        const tip = project([nx, py, nz])
        const top = project([nx, py + 5, nz])
        const gradient = ctx.createLinearGradient(top[0], top[1], tip[0], tip[1])
        gradient.addColorStop(0, rgba(1.6, 0))
        gradient.addColorStop(1, rgba(1.8, 0.9))
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(top[0], top[1])
        ctx.lineTo(tip[0], tip[1])
        ctx.stroke()
        ctx.lineWidth = 1
        ctx.fillStyle = rgba(1.9, 1)
        ctx.shadowColor = rgba(1.4, 1)
        ctx.shadowBlur = 14
        ctx.beginPath()
        ctx.arc(tip[0], tip[1], 3.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        emitHud({ label: "Imprimiendo", layer, progress: t / T_BUILD })
      } else if (t < T_HOLD) {
        emitHud({ label: "Pieza lista", layer: LAYERS, progress: 1 })
      } else {
        emitHud({
          label: "Siguiente pieza",
          layer: LAYERS,
          progress: 1 - clamp01((t - T_HOLD) / (T_DIS - T_HOLD)),
        })
      }
    }

    size()

    const handleResize = () => {
      size()
      if (reduce) frame(T_BUILD + 0.5)
    }
    window.addEventListener("resize", handleResize)

    if (reduce) {
      frame(T_BUILD + 0.5)
      return () => window.removeEventListener("resize", handleResize)
    }

    // Arranca con la pieza completa para que el primer cuadro ya se vea terminado
    const start = performance.now() - (T_BUILD + 0.2) * 1000
    let raf = 0
    let visible = true
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(canvas)

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      const elapsed = (now - start) / 1000
      angle = 0.6 + elapsed * 0.45
      frame(elapsed % PERIOD)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block h-full w-full"
      aria-hidden="true"
    />
  )
}

export type { HudState }
