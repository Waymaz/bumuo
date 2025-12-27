import { supabase } from './supabase'

export const projectService = {
  async getProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    return { data, error }
  },

  async getProject(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  async createProject(userId, title) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: userId,
        title,
        html: '',
        css: '',
        js: '',
      }])
      .select()
      .single()
    
    return { data, error }
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    return { error }
  },

  async getPublicProject(publicLink) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('public_link', publicLink)
      .single()
    
    return { data, error }
  },

  async generatePublicLink(id) {
    const publicLink = Math.random().toString(36).substring(2, 15)
    const { data, error } = await supabase
      .from('projects')
      .update({ public_link: publicLink })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  }
}
