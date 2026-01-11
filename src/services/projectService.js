import { supabase } from './supabase'

export const projectService = {
  /**
   * Get all projects for a user (includes forked projects)
   */
  async getProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    return { data, error }
  },

  /**
   * Get user's original projects (not forked)
   */
  async getOriginalProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .is('forked_from', null)
      .order('updated_at', { ascending: false })
    
    return { data, error }
  },

  /**
   * Get user's forked projects
   */
  async getForkedProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        original:forked_from (
          id,
          title,
          user_id
        )
      `)
      .eq('user_id', userId)
      .not('forked_from', 'is', null)
      .order('updated_at', { ascending: false })
    
    return { data, error }
  },

  /**
   * Get recently edited projects (for activity section)
   */
  async getRecentProjects(userId, limit = 8) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit)
    
    return { data, error }
  },

  /**
   * Get a single project by ID
   */
  async getProject(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  /**
   * Get a project with creator info (for community view)
   */
  async getProjectWithCreator(id) {
    // Fetch project first (projects.user_id references auth.users, not profiles directly)
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !project) {
      return { data: null, error }
    }
    
    // Then fetch creator profile separately
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', project.user_id)
      .single()
    
    return { 
      data: { 
        ...project, 
        creator: profile || null 
      }, 
      error: null 
    }
  },

  /**
   * Create a new project
   */
  async createProject(userId, title, isPublic = false) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: userId,
        title,
        html: '',
        css: '',
        js: '',
        is_public: isPublic,
      }])
      .select()
      .single()
    
    return { data, error }
  },

  /**
   * Update a project
   */
  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  /**
   * Toggle project visibility (public/private)
   */
  async toggleVisibility(id, isPublic) {
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        is_public: isPublic, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  /**
   * Delete a project
   */
  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    return { error }
  },

  /**
   * Get public project by public link (for sharing)
   */
  async getPublicProject(publicLink) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('public_link', publicLink)
      .single()
    
    return { data, error }
  },

  /**
   * Generate a public link for sharing
   */
  async generatePublicLink(id) {
    const publicLink = Math.random().toString(36).substring(2, 15)
    const { data, error } = await supabase
      .from('projects')
      .update({ public_link: publicLink })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // ============================================
  // COMMUNITY FEATURES
  // ============================================

  /**
   * Get all public projects for community feed
   */
  async getCommunityProjects(options = {}) {
    const { 
      limit = 20, 
      offset = 0, 
      sortBy = 'recent', // 'recent', 'popular', 'most_forked'
      searchQuery = ''
    } = options

    // Note: projects.user_id references auth.users, not profiles directly
    // So we fetch projects first, then get profiles separately
    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('is_public', true)

    // Apply search filter
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`)
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        query = query.order('view_count', { ascending: false })
        break
      case 'most_forked':
        query = query.order('fork_count', { ascending: false })
        break
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    // Fetch creator profiles separately (projects.user_id references auth.users, not profiles)
    if (data && data.length > 0 && !error) {
      const userIds = [...new Set(data.map(p => p.user_id).filter(Boolean))]
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds)
        
        if (profiles) {
          const profileMap = profiles.reduce((acc, p) => {
            acc[p.id] = p
            return acc
          }, {})
          
          data.forEach(project => {
            project.creator = profileMap[project.user_id] || null
          })
        }
      }
    }

    return { data, error, count }
  },

  /**
   * Fork a project
   */
  async forkProject(projectId, userId, newTitle) {
    // First, get the original project
    const { data: original, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('is_public', true)
      .single()
    
    if (fetchError || !original) {
      return { data: null, error: fetchError || { message: 'Project not found or not public' } }
    }

    // Create the forked project
    const { data: forked, error: createError } = await supabase
      .from('projects')
      .insert([{
        user_id: userId,
        title: newTitle || `${original.title} (Fork)`,
        html: original.html,
        css: original.css,
        js: original.js,
        is_public: false, // Forked projects start as private
        forked_from: projectId,
      }])
      .select()
      .single()
    
    if (createError) {
      return { data: null, error: createError }
    }

    // Increment fork count on original (best effort)
    await supabase
      .from('projects')
      .update({ fork_count: (original.fork_count || 0) + 1 })
      .eq('id', projectId)

    return { data: forked, error: null }
  },

  /**
   * Record a project view (with debounce)
   */
  async recordView(projectId, viewerId) {
    if (!viewerId) return { error: null } // Skip for anonymous users for now

    try {
      // Use RPC if available, otherwise manual insert
      const { error } = await supabase.rpc('increment_view_count', {
        p_project_id: projectId,
        p_viewer_id: viewerId
      })

      if (error) {
        // Fallback: manual upsert
        const { error: insertError } = await supabase
          .from('project_views')
          .upsert({
            project_id: projectId,
            viewer_id: viewerId,
            viewed_at: new Date().toISOString()
          }, {
            onConflict: 'project_id,viewer_id'
          })
        
        if (!insertError) {
          // Increment view count manually
          await supabase
            .from('projects')
            .update({ view_count: supabase.raw('view_count + 1') })
            .eq('id', projectId)
        }
        
        return { error: insertError }
      }
      
      return { error: null }
    } catch (err) {
      console.error('Error recording view:', err)
      return { error: err }
    }
  },

  /**
   * Get the original project info for a forked project
   */
  async getOriginalProjectInfo(forkedFromId) {
    if (!forkedFromId) return { data: null, error: null }
    
    // Fetch project first (projects.user_id references auth.users, not profiles)
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, user_id')
      .eq('id', forkedFromId)
      .single()
    
    // Then fetch creator profile separately
    if (data && data.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', data.user_id)
        .single()
      
      data.creator = profile || null
    }
    
    return { data, error }
  },

  /**
   * Get project statistics
   */
  async getProjectStats(projectId) {
    const { data, error } = await supabase
      .from('projects')
      .select('view_count, fork_count')
      .eq('id', projectId)
      .single()
    
    return { data, error }
  }
}
