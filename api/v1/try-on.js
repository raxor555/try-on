import axios from 'axios';

export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Extract configuration (Prioritize Env Vars, fallback to hardcoded from config.js)
    const SUPABASE_URL = process.env.SUPABASE_URL || "https://rufhrppnoksntttbenuk.supabase.co";
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZmhycHBub2tzbnR0dGJlbnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNzI2MjgsImV4cCI6MjA4Mzk0ODYyOH0.CDc3pD5EWnQJoI__z-OVkxKHsgK4tnoZH8oxW1wOY-c";

    const functionUrl = `${SUPABASE_URL}/functions/v1/try-on`;

    // 3. Extract customer headers
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ error: 'Missing X-API-Key header' });
    }

    try {
        // 4. Forward the request to Supabase with injected apikey
        // Including both 'apikey' and 'Authorization' for maximum compatibility with Supabase Gateway
        const response = await axios({
            method: 'post',
            url: functionUrl,
            data: req.body || {},
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });

        // 5. Return the result to the customer
        return res.status(200).json(response.data);

    } catch (error) {
        // 6. Detailed error reporting for easier debugging
        const responseData = error.response?.data;
        const statusCode = error.response?.status || 500;

        console.error('Proxy Error Details:', {
            status: statusCode,
            data: responseData,
            message: error.message
        });

        return res.status(statusCode).json({
            success: false,
            error: responseData?.message || error.message || 'Internal Server Error',
            code: responseData?.code || 'PROXY_ERROR',
            details: responseData
        });
    }
}
