"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"

interface TooltipProps {
  content: string
  children: ReactNode
  delay?: number
  position?: "top" | "bottom"
}

export function Tooltip({ content, children, delay = 300, position = "bottom" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const childRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true)
      updatePosition()
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsVisible(false)
  }

  const updatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return

    const childRect = childRef.current.getBoundingClientRect()

    // Position the tooltip below the element
    const top = position === "top" ? childRect.top - (tooltipRef.current?.offsetHeight || 0) - 8 : childRect.bottom + 8

    const left = childRect.left + childRect.width / 2

    setTooltipPosition({ top, left })
  }

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      updatePosition()
    }
  }, [isVisible])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={childRef}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-sm whitespace-nowrap"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: "translateX(-50%)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 150ms ease-in-out",
          }}
        >
          {content}
          <div
            className="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"
            style={{
              [position === "top" ? "bottom" : "top"]: "-4px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      )}
    </div>
  )
}

