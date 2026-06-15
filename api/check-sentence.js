import { evaluateSentence } from './lib/sentenceCheck.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { word, sentence, example } = req.body || {}
    if (!word || !sentence) {
      return res.status(400).json({ error: 'Thiếu từ hoặc câu' })
    }

    const result = await evaluateSentence(word, sentence, example || '')

    return res.status(200).json({
      correct: Boolean(result.correct),
      feedback: result.feedback || '',
      suggestions: result.suggestions || '',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
