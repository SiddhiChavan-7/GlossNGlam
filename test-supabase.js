const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://vgdfnyimaqoiosmednok.supabase.co";
const supabaseKey = "sb_publishable_raIH9zezAikaDuY1hPr5JQ_uCfNN2qN";
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('products').select('*, categories(name, slug)').order('created_at', { ascending: false });
  console.log("Error:", error);
  console.log("Data:", data);
}
test();
