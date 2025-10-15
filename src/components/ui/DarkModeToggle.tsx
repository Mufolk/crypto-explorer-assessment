'use client'

import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="
        p-2 rounded-lg border border-gray-200 dark:border-gray-700 
        bg-white dark:bg-gray-800 
        text-gray-600 dark:text-gray-300 
        hover:bg-gray-50 dark:hover:bg-gray-700 
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  )
}
