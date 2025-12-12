import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1mj5HP-67nI9I7JEYTnPEPBOaAavZYFLlbjLyYD-VlMI/export?format=csv&gid=0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const response = await fetch(SHEET_CSV_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.status}`);
    }

    const text = await response.text();
    const rows = text.split('\n').filter(row => row.trim());

    const parsed = rows.slice(1).map(row => {
      const matches = row.match(/(".*?"|[^,]+)(?:,|$)/g);
      if (!matches || matches.length < 2) return null;

      const description = matches[0].replace(/,$/, '').replace(/^"|"$/g, '').trim();
      const url = matches[1].replace(/,$/, '').replace(/^"|"$/g, '').trim();

      if (!description || !url) return null;

      return { description, url };
    }).filter(Boolean);

    return new Response(
      JSON.stringify({ success: true, data: parsed }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});