"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

type SiteContextType = {
  currentSite: string
  setCurrentSite: (site: string) => void
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [currentSite, setCurrentSite] = useState<string>("appfirmsec")

  return (
    <SiteContext.Provider value={{ currentSite, setCurrentSite }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSiteContext() {
  const context = useContext(SiteContext)
  if (context === undefined) {
    throw new Error('useSiteContext must be used within a SiteProvider')
  }
  return context
} 