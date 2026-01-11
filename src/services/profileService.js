import { supabase } from './supabase'

export const profileService = {
  /**
   * Get a user's profile by user ID
   */
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  /**
   * Get a user's profile by username
   */
  async getProfileByUsername(username) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', username)
      .single()
    
    return { data, error }
  },

  /**
   * Check if a username is available (case-insensitive)
   */
  async checkUsernameAvailable(username) {
    const { data, error } = await supabase
      .rpc('check_username_available', { check_username: username })
    
    if (error) {
      // Fallback: manual check if function doesn't exist
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', username)
        .single()
      
      return { available: !existingProfile, error: null }
    }
    
    return { available: data, error: null }
  },

  /**
   * Create a new profile with username and email
   */
  async createProfile(userId, username, avatarUrl = null, email = null) {
    const profileData = {
      id: userId,
      username: username.trim(),
      avatar_url: avatarUrl,
    }
    
    // Add email if provided
    if (email) {
      profileData.email = email
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single()
    
    return { data, error }
  },

  /**
   * Update a user's profile
   */
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  },

  /**
   * Update username (with availability check)
   */
  async updateUsername(userId, newUsername) {
    // First check availability
    const { available, error: checkError } = await this.checkUsernameAvailable(newUsername)
    
    if (checkError) {
      return { data: null, error: checkError }
    }
    
    if (!available) {
      return { data: null, error: { message: 'Username is already taken' } }
    }
    
    return this.updateProfile(userId, { username: newUsername.trim() })
  },

  /**
   * Validate username format
   * Rules: 3-20 characters, alphanumeric with underscores, no spaces
   */
  validateUsername(username) {
    if (!username) {
      return { valid: false, error: 'Username is required' }
    }
    
    const trimmed = username.trim()
    
    if (trimmed.length < 3) {
      return { valid: false, error: 'Username must be at least 3 characters' }
    }
    
    if (trimmed.length > 20) {
      return { valid: false, error: 'Username must be at most 20 characters' }
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return { valid: false, error: 'Username can only contain letters, numbers, and underscores' }
    }
    
    if (/^[0-9]/.test(trimmed)) {
      return { valid: false, error: 'Username cannot start with a number' }
    }
    
    if (/^_|_$/.test(trimmed)) {
      return { valid: false, error: 'Username cannot start or end with an underscore' }
    }
    
    // Check for reserved usernames
    const reserved = ['admin', 'administrator', 'moderator', 'mod', 'system', 'bumuo', 'support', 'help', 'null', 'undefined', 'api', 'www']
    if (reserved.includes(trimmed.toLowerCase())) {
      return { valid: false, error: 'This username is reserved' }
    }
    
    return { valid: true, error: null }
  },

  /**
   * Generate avatar URL from username (using DiceBear or similar)
   */
  generateAvatarUrl(username) {
    // Using DiceBear API for avatar generation
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=3b82f6&textColor=ffffff`
  },

  /**
   * Get multiple profiles by user IDs
   */
  async getProfiles(userIds) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds)
    
    return { data, error }
  }
}
