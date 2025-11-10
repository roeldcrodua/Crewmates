import { createClient } from '@supabase/supabase-js';

const URL = 'https://ujwflwknjeyzibvebyor.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqd2Zsd2tuamV5emlidmVieW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MzgzNzMsImV4cCI6MjA3ODMxNDM3M30.YnCNGw_ZHTS5XfXyexpk0oPu70k98Oqrg4pbxQ3cqOc';

export const supabase = createClient(URL, API_KEY);
