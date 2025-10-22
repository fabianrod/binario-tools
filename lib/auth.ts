import { createClient } from './supabase-client'
import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  email?: string
}

export const signUp = async (email: string, password: string) => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const supabase = createClient()
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null)
  })
}
