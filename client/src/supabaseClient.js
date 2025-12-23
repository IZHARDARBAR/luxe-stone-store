import { createClient } from '@supabase/supabase-js'

// 1. Yahan Apna Project URL paste karein
const supabaseUrl = 'https://lrnyrmamtwfcdeshgpkg.supabase.co'

// 2. Yahan Apni 'anon public' Key paste karein
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybnlybWFtdHdmY2Rlc2hncGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTg3NDQsImV4cCI6MjA4MDQ3NDc0NH0.VKZzJXwPWcHSQibtAdAPNAn1G8Je9aivZiqzLyzgF60'

export const supabase = createClient(supabaseUrl, supabaseKey)