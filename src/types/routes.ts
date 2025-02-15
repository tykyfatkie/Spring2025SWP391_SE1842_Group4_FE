import React from 'react'

export interface Route {
  path: string
  component: React.ComponentType
  exact?: boolean
  role?: string[]
}

export interface LayoutRoute {
  layout: React.ComponentType
  data: Route[]
}
