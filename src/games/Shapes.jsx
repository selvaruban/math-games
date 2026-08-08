import { useId } from 'react'
import { PATHS } from './shapeMeta'

export function Shape({ kind, size = 80, fill = '#74c0fc', stroke = '#4dabf7' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <path
        d={PATHS[kind]}
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const SHADE_RECTS = {
  full: <rect x="0" y="0" width="100" height="100" />,
  half: <rect x="0" y="0" width="50" height="100" />,
  quarter: <rect x="0" y="50" width="50" height="50" />,
  threequarter: (
    <>
      <rect x="0" y="0" width="50" height="100" />
      <rect x="50" y="50" width="50" height="50" />
    </>
  ),
}

export function ShadedShape({ kind, fraction, size = 90, fill = '#4dabf7', line = '#adb5bd' }) {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <path d={PATHS[kind]} />
        </clipPath>
      </defs>
      <path d={PATHS[kind]} fill="#f1f3f5" stroke={line} strokeWidth="3" strokeLinejoin="round" />
      {SHADE_RECTS[fraction] && (
        <g clipPath={`url(#${id})`}>
          <g fill={fill}>{SHADE_RECTS[fraction]}</g>
        </g>
      )}
      <path d={PATHS[kind]} fill="none" stroke={line} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

export function LShape({ angle = 0, size = 90, color = '#4dabf7' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <g transform={`rotate(${angle} 50 50)`}>
        <path
          d="M 22 18 H 78 V 38 H 52 V 82 H 22 Z"
          fill={color}
          stroke="#3b8fd4"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
