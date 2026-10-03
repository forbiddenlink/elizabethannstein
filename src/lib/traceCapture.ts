// Captured output from Trace's own example gallery: src/data/gallery.json in
// github.com/forbiddenlink/trace, written by scripts/build-gallery.mjs running the real Gemini
// pipeline. Copied verbatim (labels, confidences, boxes, repair counts); nothing here is
// hand-written. Regenerate from that file rather than editing values.

export const TRACE_SOURCE = {
  repo: 'https://github.com/forbiddenlink/trace',
  file: 'src/data/gallery.json',
  capturedAt: '2026-06-02',
  live: 'https://trace-seven-ashen.vercel.app',
} as const

export type TraceGrounding = 'grounded' | 'inferred' | 'guessed'

export interface TraceDetection {
  label: string
  component: string
  /** 0-1, the model's own score for the catalog mapping */
  confidence: number
  /** the model's own rating of how cleanly the element maps to a catalog component */
  grounding: TraceGrounding
  /** [ymin, xmin, ymax, xmax] normalized 0-1000, Gemini's native box format */
  box: [number, number, number, number]
}

export interface TraceCapture {
  id: string
  title: string
  image: string
  width: number
  height: number
  detections: TraceDetection[]
  componentsUsed: string[]
  /** compile-repair passes the pipeline needed before the generated file compiled */
  repairs: number
  /** length of the generated single-file React component */
  jsxChars: number
}

export const TRACE_CAPTURES: TraceCapture[] = [
  {
    id: 'login-form',
    title: 'Login form',
    image: '/demos/trace/login-form.webp',
    width: 928,
    height: 1120,
    detections: [
      {
        label: 'Login Card',
        component: 'Card',
        confidence: 1,
        grounding: 'grounded',
        box: [82, 109, 917, 890],
      },
      {
        label: 'Welcome back heading',
        component: 'Text',
        confidence: 0.9,
        grounding: 'inferred',
        box: [140, 158, 172, 399],
      },
      {
        label: 'Subtitle text',
        component: 'Text',
        confidence: 0.85,
        grounding: 'inferred',
        box: [184, 158, 204, 600],
      },
      {
        label: 'Email label',
        component: 'Text',
        confidence: 0.9,
        grounding: 'inferred',
        box: [280, 158, 298, 209],
      },
      {
        label: 'Email input',
        component: 'Input',
        confidence: 1,
        grounding: 'grounded',
        box: [310, 158, 358, 840],
      },
      {
        label: 'Password label',
        component: 'Text',
        confidence: 0.9,
        grounding: 'inferred',
        box: [400, 158, 418, 248],
      },
      {
        label: 'Forgot password link',
        component: 'Button',
        confidence: 0.95,
        grounding: 'grounded',
        box: [400, 760, 418, 840],
      },
      {
        label: 'Password input',
        component: 'Input',
        confidence: 1,
        grounding: 'grounded',
        box: [430, 158, 478, 840],
      },
      {
        label: 'Remember me checkbox',
        component: 'Checkbox',
        confidence: 1,
        grounding: 'grounded',
        box: [540, 158, 560, 310],
      },
      {
        label: 'Sign in button',
        component: 'Button',
        confidence: 1,
        grounding: 'grounded',
        box: [610, 158, 660, 840],
      },
      {
        label: 'Continue with Google button',
        component: 'Button',
        confidence: 1,
        grounding: 'grounded',
        box: [680, 158, 730, 840],
      },
      {
        label: 'No account text',
        component: 'Text',
        confidence: 0.85,
        grounding: 'inferred',
        box: [840, 350, 860, 470],
      },
      {
        label: 'Sign up link',
        component: 'Button',
        confidence: 0.95,
        grounding: 'grounded',
        box: [840, 475, 860, 550],
      },
    ],
    componentsUsed: ['Card', 'Input', 'Button', 'Checkbox'],
    repairs: 0,
    jsxChars: 4361,
  },
  {
    id: 'dashboard-stats',
    title: 'Dashboard stat cards',
    image: '/demos/trace/dashboard-stats.webp',
    width: 1280,
    height: 712,
    detections: [
      {
        label: 'Total revenue card',
        component: 'Card',
        confidence: 1,
        grounding: 'grounded',
        box: [100, 48, 490, 490],
      },
      {
        label: 'Total revenue label',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [150, 90, 175, 200],
      },
      {
        label: 'Total revenue value',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [240, 90, 300, 270],
      },
      {
        label: 'Total revenue comparison text',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [310, 90, 335, 350],
      },
      {
        label: 'Total revenue percentage badge',
        component: 'Badge',
        confidence: 1,
        grounding: 'grounded',
        box: [147, 354, 178, 427],
      },
      {
        label: 'Active users card',
        component: 'Card',
        confidence: 1,
        grounding: 'grounded',
        box: [100, 506, 490, 948],
      },
      {
        label: 'Active users label',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [150, 548, 175, 650],
      },
      {
        label: 'Active users value',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [240, 548, 300, 680],
      },
      {
        label: 'Active users comparison text',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [310, 548, 335, 750],
      },
      {
        label: 'Active users percentage badge',
        component: 'Badge',
        confidence: 1,
        grounding: 'grounded',
        box: [147, 804, 178, 877],
      },
      {
        label: 'Conversion card',
        component: 'Card',
        confidence: 1,
        grounding: 'grounded',
        box: [506, 48, 896, 490],
      },
      {
        label: 'Conversion label',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [555, 90, 580, 180],
      },
      {
        label: 'Conversion value',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [645, 90, 705, 270],
      },
      {
        label: 'Conversion comparison text',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [715, 90, 740, 350],
      },
      {
        label: 'Conversion percentage badge',
        component: 'Badge',
        confidence: 1,
        grounding: 'grounded',
        box: [552, 354, 583, 427],
      },
      {
        label: 'Average session card',
        component: 'Card',
        confidence: 1,
        grounding: 'grounded',
        box: [506, 506, 896, 948],
      },
      {
        label: 'Average session label',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [555, 548, 580, 650],
      },
      {
        label: 'Average session value',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [645, 548, 705, 750],
      },
      {
        label: 'Average session comparison text',
        component: 'Text',
        confidence: 0.8,
        grounding: 'inferred',
        box: [715, 548, 740, 800],
      },
      {
        label: 'Average session percentage badge',
        component: 'Badge',
        confidence: 1,
        grounding: 'grounded',
        box: [552, 804, 583, 877],
      },
    ],
    componentsUsed: ['Card', 'Badge'],
    repairs: 1,
    jsxChars: 2416,
  },
]
