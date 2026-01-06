import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode')
    return saved ? JSON.parse(saved) : false
  })

  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  useEffect(() => {
    localStorage.setItem('adminDarkMode', JSON.stringify(darkMode))

    // Dark mode sadece admin sayfalarinda uygulansın
    if (darkMode && isAdminPage) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode, isAdminPage])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
