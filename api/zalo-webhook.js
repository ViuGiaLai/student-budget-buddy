/**
 * Vercel Serverless Function: Zalo Webhook Proxy
 * Forwards webhook requests from Zalo to Supabase Edge Function
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = 'https://ieacrgscsrqtfxzebqdv.supabase.co/functions/v1/zalo-webhook';

    // Get raw body from request
    let body = '';
    if (typeof req.body === 'string') {
      body = req.body;
    } else if (req.body instanceof Buffer) {
      body = req.body.toString();
    } else {
      body = JSON.stringify(req.body);
    }

    // Forward the request to Supabase
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const data = await response.text();
    
    // Log for debugging
    console.log('Zalo webhook forwarded:', {
      statusCode: response.status,
      responseBody: data,
    });
    
    // Return response from Supabase to Zalo
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Webhook proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
