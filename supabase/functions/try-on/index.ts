import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

serve(async (req) => {
    const { method } = req
    if (method === 'OPTIONS') return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        // 1. Validate API Key
        const apiKey = req.headers.get("X-API-Key")
        if (!apiKey) return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 401 })

        const { data: keyData, error: keyError } = await supabase
            .from('api_keys')
            .select('user_id, id')
            .eq('key_hash', apiKey)
            .eq('is_active', true)
            .single()

        if (keyError || !keyData) return new Response(JSON.stringify({ error: "Invalid or inactive API Key" }), { status: 401 })

        // 2. Check Credits
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits_remaining')
            .eq('id', keyData.user_id)
            .single()

        if (profileError || profile.credits_remaining <= 0) {
            return new Response(JSON.stringify({ error: "Insufficient credits" }), { status: 403 })
        }

        // 3. Process Images (Mock Gemini Integration for now, as we need actual model endpoint/SDK)
        const { person_image, garment_image } = await req.json()
        if (!person_image || !garment_image) {
            return new Response(JSON.stringify({ error: "Missing images" }), { status: 400 })
        }

        // Here we would call Gemini API
        // const result = await callGemini(person_image, garment_image)
        const mockResultImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000"

        // 4. Deduct Credits
        await supabase.rpc('deduct_credits', { user_id_val: keyData.user_id, amount: 1 })

        // 5. Log Usage
        await supabase.from('usage_logs').insert({
            user_id: keyData.user_id,
            api_key_id: keyData.id,
            endpoint: '/api/v1/try-on',
            status_code: 200,
            credits_used: 1,
            metadata: { person_image, garment_image }
        })

        return new Response(
            JSON.stringify({
                success: true,
                image_url: mockResultImage,
                message: "Try-on processed successfully (Demo Mode)"
            }),
            { headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } }
        )

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})
