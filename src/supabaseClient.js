// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Defina sua URL e chave do Supabase diretamente aqui
const supabaseUrl = 'https://spmhlksueltfmssrqczo.supabase.co'; // Substitua pela sua URL do Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbWhsa3N1ZWx0Zm1zc3JxY3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExMDk5OTQsImV4cCI6MjA0NjY4NTk5NH0.Qs-lMKau1ijyZ1PPYyTfOpM5AYOu-yfNYDj_1q2Y3kg'; // Substitua pela sua chave do Supabase

// Cria o cliente do Supabase com a URL e chave fornecidas
const supabase = createClient(supabaseUrl, supabaseKey);

// Exporta a instância do supabase para ser usada em outros arquivos
export default supabase;
