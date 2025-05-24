import { NextResponse } from 'next/server';

// This route acts as a proxy for Mapbox API requests
// It keeps the access token on the server side
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const query = searchParams.get('query');
  
  if (!endpoint || !query) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }
  
  // Get Mapbox token from server-side environment variable
  const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
  
  if (!MAPBOX_TOKEN) {
    return NextResponse.json({ error: 'Mapbox configuration is missing' }, { status: 500 });
  }
  
  try {
    // Forward the request to Mapbox with our server-side token
    const mapboxUrl = `https://api.mapbox.com/${endpoint}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}`;
    const response = await fetch(mapboxUrl);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Mapbox API proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch data from Mapbox' }, { status: 500 });
  }
} 