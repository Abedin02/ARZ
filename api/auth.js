import { supabase } from '../supabaseClient'

// Admin login
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

// Admin logout
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Check if admin is logged in
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}