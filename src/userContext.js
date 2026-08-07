import { createContext, useContext } from 'react'

export const POINTS_PER_CORRECT = 10

export const UserContext = createContext(null)

export function useUser() {
  return useContext(UserContext)
}
