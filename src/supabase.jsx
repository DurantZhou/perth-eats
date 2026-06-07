import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://shkcasprhgbeqxsdocqs.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa2Nhc3ByaGdiZXF4c2RvY3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MjgyMjEsImV4cCI6MjA5NjQwNDIyMX0.wKyFePPjL4LdKkkywuYfVNAzDgRSeuKPLJnJuxiNC8o'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)