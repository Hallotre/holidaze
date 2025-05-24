import { NextResponse } from 'next/server';

/**
 * API route for securely proxying Mapbox static map requests
 * This keeps the Mapbox access token server-side
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Get required parameters
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const zoom = searchParams.get('zoom') || '14';
  const width = searchParams.get('width') || '600';
  const height = searchParams.get('height') || '400';
  const showMarker = searchParams.get('marker') !== 'false';
  
  // Validate parameters
  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Missing required parameters: lat and lng are required' }, 
      { status: 400 }
    );
  }
  
  // Get Mapbox token from server-side environment variable
  const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
  
  if (!MAPBOX_TOKEN) {
    return NextResponse.json(
      { error: 'Mapbox configuration is missing' }, 
      { status: 500 }
    );
  }
  
  try {
    // Build marker parameter if needed
    const markerParam = showMarker ? 
      `/pin-s+f44336(${lng},${lat})` : 
      '';
    
    // Create Mapbox static map URL with server-side token
    const staticMapUrl = 
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static` +
      `${markerParam}` +
      `/${lng},${lat},${zoom},0` +
      `/${width}x${height}` +
      `?access_token=${MAPBOX_TOKEN}`;
    
    // Fetch the image
    const response = await fetch(staticMapUrl);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }
    
    // Get the image data and content type
    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // Return the image with proper content type
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Mapbox static map proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch static map from Mapbox' }, 
      { status: 500 }
    );
  }
} 