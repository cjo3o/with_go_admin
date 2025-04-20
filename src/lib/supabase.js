import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://zgrjjnifqoactpuqolao.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0',
    {
        storage: {
          setItem: (key, value) => localStorage.setItem(`anon_${key}`, value), // 'anon_' 접두사 사용
          getItem: (key) => localStorage.getItem(`anon_${key}`),
          removeItem: (key) => localStorage.removeItem(`anon_${key}`),
        },
      }
    );
    
export default supabase;