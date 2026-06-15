const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default function handler(req, res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  return res.status(200).json({
    ok: true,
    ai: Boolean(process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY),
  })
}
