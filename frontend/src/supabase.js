import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dsdvqctqvojvaoqoffhn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHZxY3Rxdm9qdmFvcW9mZmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMjMyMTMsImV4cCI6MjA4Mjg5OTIxM30.4UE4gLKo9uAAxrKEERnk08V1dln9KH7bAXXnrLu0fqw';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
