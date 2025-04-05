
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ighuvgxigaosflskcijo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnaHV2Z3hpZ2Fvc2Zsc2tjaWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwOTcxNDEsImV4cCI6MjA1NzY3MzE0MX0.XWKcoHhBnjOeBobuE4eRY97w3LlXa_nBlDxzW0PfCA8'
const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase };