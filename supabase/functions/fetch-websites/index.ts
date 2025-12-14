import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1mj5HP-67nI9I7JEYTnPEPBOaAavZYFLlbjLyYD-VlMI/export?format=csv";

function parseCSV(csv: string): Array<{ description: string; url: string }> {
  const lines = csv.trim().split('\n');
  const result: Array<{ description: string; url: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const firstCommaIndex = line.indexOf(',');
    if (firstCommaIndex === -1) continue;

    const description = line.substring(0, firstCommaIndex).trim().replace(/^"|"$/g, '');
    const url = line.substring(firstCommaIndex + 1).trim().replace(/^"|"$/g, '');

    if (description && url) {
      result.push({
        description,
        url
      });
    }
  }

  return result;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const data = parseCSV(csvText);

    return new Response(
      JSON.stringify({ success: true, data }),
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