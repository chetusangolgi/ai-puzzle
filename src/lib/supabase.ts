import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection function
export const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', supabaseUrl)
    console.log('Key (first 20 chars):', supabaseAnonKey?.substring(0, 20) + '...')
    
    const { data, error } = await supabase
      .from('puzzle')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Connection test failed:', error)
      return false
    }
    
    console.log('Connection test successful! Row count:', data)
    return true
  } catch (error) {
    console.error('Connection test error:', error)
    return false
  }
}

export interface UserData {
  id?: string
  name: string
  email: string
  score: number
}

export const saveUserData = async (userData: Omit<UserData, 'id'>): Promise<UserData | null> => {
  console.log('Attempting to save user data:', userData)
  
  try {
    const { data, error } = await supabase
      .from('puzzle')
      .insert([userData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return null
    }

    console.log('Successfully saved data:', data)
    return data
  } catch (error) {
    console.error('Catch error saving user data:', error)
    return null
  }
}

export const getLeaderboard = async (): Promise<UserData[]> => {
  try {
    const { data, error } = await supabase
      .from('puzzle')
      .select('*')
      .order('score', { ascending: true })
      .limit(10)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}