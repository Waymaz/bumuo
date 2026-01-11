import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../services/supabase'
import { profileService } from '../services/profileService'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [needsUsername, setNeedsUsername] = useState(false)
  const [authError, setAuthError] = useState(null)
  const mountedRef = useRef(true)
  const initCompleteRef = useRef(false)

  // Fetch profile - handles errors gracefully
  const fetchProfile = useCallback(async (userId, userEmail = null) => {
    if (!userId || !mountedRef.current) {
      setProfile(null)
      setNeedsUsername(false)
      return
    }

    setProfileLoading(true)
    
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await profileService.getProfile(userId)
      
      if (!mountedRef.current) return
      
      if (error || !data) {
        console.log('No profile found, user needs to set username')
        setProfile(null)
        setNeedsUsername(true)
      } else {
        console.log('Profile found:', data.username)
        // If profile exists but email is missing, update it
        if (!data.email && userEmail) {
          try {
            await profileService.updateProfile(userId, { email: userEmail })
            data.email = userEmail
          } catch (e) {
            console.warn('Could not update email:', e)
          }
        }
        setProfile(data)
        setNeedsUsername(false)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      if (mountedRef.current) {
        setProfile(null)
        setNeedsUsername(true)
      }
    } finally {
      if (mountedRef.current) {
        setProfileLoading(false)
      }
    }
  }, [])

  // Handle profile creation after username setup
  const handleProfileCreated = useCallback((newProfile) => {
    console.log('Profile created:', newProfile?.username)
    setProfile(newProfile)
    setNeedsUsername(false)
  }, [])

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id, user.email)
    }
  }, [user?.id, user?.email, fetchProfile])

  // Process auth state change - separate function to avoid async callback issues
  const processAuthChange = useCallback(async (event, session) => {
    if (!mountedRef.current) return
    
    console.log('Processing auth event:', event)
    const currentUser = session?.user ?? null
    
    setUser(currentUser)
    setAuthError(null)
    
    if (currentUser) {
      console.log('User authenticated:', currentUser.email)
      await fetchProfile(currentUser.id, currentUser.email)
    } else {
      console.log('No user session')
      setProfile(null)
      setNeedsUsername(false)
    }
    
    if (mountedRef.current) {
      setLoading(false)
    }
  }, [fetchProfile])

  // Initialize auth state
  useEffect(() => {
    mountedRef.current = true
    
    // Safety timeout - prevent infinite loading (15 seconds)
    const safetyTimeout = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn('Auth loading timeout - forcing completion')
        setLoading(false)
      }
    }, 15000)

    const initializeAuth = async () => {
      if (initCompleteRef.current) return
      
      try {
        console.log('=== Initializing BumuO Auth ===')
        
        // Check for OAuth callback in URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const queryParams = new URLSearchParams(window.location.search)
        const hasAccessToken = hashParams.has('access_token')
        const hasCode = queryParams.has('code')
        const hasError = queryParams.has('error') || hashParams.has('error')
        
        // Handle OAuth errors
        if (hasError) {
          const errorDesc = queryParams.get('error_description') || hashParams.get('error_description')
          console.error('OAuth error:', errorDesc)
          setAuthError(errorDesc || 'Authentication failed')
          setLoading(false)
          window.history.replaceState({}, document.title, window.location.pathname)
          return
        }
        
        // If OAuth callback detected, wait for Supabase to process
        if (hasAccessToken || hasCode) {
          console.log('OAuth callback detected, letting Supabase handle it...')
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          setAuthError(error.message)
          setLoading(false)
          return
        }

        const currentUser = session?.user ?? null
        console.log('Initial session user:', currentUser?.email || 'none')
        
        if (mountedRef.current) {
          setUser(currentUser)
          
          if (currentUser) {
            await fetchProfile(currentUser.id, currentUser.email)
          }
          
          setLoading(false)
          initCompleteRef.current = true
          
          // Clean up URL after OAuth callback
          if ((hasAccessToken || hasCode) && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (mountedRef.current) {
          setAuthError(err.message)
          setLoading(false)
        }
      }
    }

    // IMPORTANT: Set up auth state change listener with non-async callback
    // Using async directly causes "message channel closed" error
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email || 'no user')
      
      // Skip INITIAL_SESSION during init - initializeAuth handles that
      if (!initCompleteRef.current && event === 'INITIAL_SESSION') {
        console.log('Skipping INITIAL_SESSION - init will handle it')
        return
      }
      
      // Process auth change in next tick to avoid message channel error
      // This is the KEY FIX for the error you're seeing
      queueMicrotask(() => {
        processAuthChange(event, session)
      })
    })

    // Run initialization
    initializeAuth()

    return () => {
      mountedRef.current = false
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
  }, [fetchProfile, processAuthChange, loading])

  // Sign up with email/password
  const signUp = async (email, password) => {
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      
      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      setAuthError(err.message)
      return { data: null, error: err }
    }
  }

  // Sign in with email/password
  const signIn = async (email, password) => {
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      setAuthError(err.message)
      return { data: null, error: err }
    }
  }

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      setAuthError(err.message)
      return { data: null, error: err }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setProfile(null)
      setNeedsUsername(false)
      setAuthError(null)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  // Password reset
  const resetPassword = async (email) => {
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      setAuthError(err.message)
      return { data: null, error: err }
    }
  }

  // Update password
  const updatePassword = async (newPassword) => {
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      
      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      setAuthError(err.message)
      return { data: null, error: err }
    }
  }

  // Update profile
  const updateProfile = async (updates) => {
    if (!user?.id) return { error: { message: 'Not authenticated' } }
    
    const { data, error } = await profileService.updateProfile(user.id, updates)
    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }

  // Clear auth error
  const clearError = () => setAuthError(null)

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      loading, 
      profileLoading,
      needsUsername,
      authError,
      signUp, 
      signIn,
      signInWithGoogle,
      signOut,
      resetPassword,
      updatePassword,
      handleProfileCreated,
      refreshProfile,
      updateProfile,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
