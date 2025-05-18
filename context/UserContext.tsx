"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, login, register, getUserById } from '@/lib/user'

type UserContextType = {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ user: User | null; error: any }>
  register: (username: string, password: string, displayName?: string) => Promise<{ user: User | null; error: any }>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user in local storage
    const loadUser = async () => {
      setIsLoading(true)
      const storedUserId = localStorage.getItem('userId')
      
      if (storedUserId) {
        try {
          const { user } = await getUserById(storedUserId)
          setUser(user)
        } catch (error) {
          console.error('Error loading user:', error)
          localStorage.removeItem('userId')
        }
      }
      
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password)
    
    if (result.user) {
      setUser(result.user)
      localStorage.setItem('userId', result.user.id)
    }
    
    return result
  }

  const handleRegister = async (username: string, password: string, displayName?: string) => {
    const result = await register(username, password, displayName)
    
    if (result.user) {
      setUser(result.user)
      localStorage.setItem('userId', result.user.id)
    }
    
    return result
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('userId')
  }

  const value = {
    user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}