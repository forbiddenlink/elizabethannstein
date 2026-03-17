
import { NextResponse } from 'next/server'
import { allProjects, galaxies } from '@/lib/galaxyData'

const MINMAX_API_URL = 'https://api.minimax.io/v1/text/chatcompletion_v2'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    // Input validation
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Validate each message shape and sanitize
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== 'string') {
        return NextResponse.json(
          { error: 'Invalid message structure' },
          { status: 400 }
        )
      }
      if (msg.content.length > 2000) {
        return NextResponse.json(
          { error: 'Message too long' },
          { status: 400 }
        )
      }
    }

    const apiKey = process.env.MINMAX_API_KEY

    // Fallback if no API key - helpful for dev/demo without breaking
    if (!apiKey) {
      return NextResponse.json({ 
        role: 'assistant', 
        content: "I'm sorry, I can't connect to the galaxy command center right now (Missing API Key). However, I can tell you that Elizabeth's portfolio features " + allProjects.length + " amazing projects across " + galaxies.length + " galactic sectors!" 
      })
    }

    // Construct system prompt with portfolio data
    const systemPrompt = `You are the "Galaxy Guide", an intelligent AI assistant for Elizabeth Stein's 3D interactive portfolio. 
    Your role is to help visitors navigate the portfolio, find projects, and learn about Elizabeth's skills.
    
    Style & Tone:
    - You are helpful, futuristic, and professional but slightly whimsical (galaxy theme).
    - Detailed but concise.
    - Metaphor: You are a holographic guide on a spaceship bridge.
    
    Context - Elizabeth Stein:
    - Full-stack developer, design systems expert, and AI integrator.
    - Specializes in Next.js, React, Three.js, and AI agents.
    
    Context - Portfolio Galaxy Structure:
    ${galaxies.map(g => `- ${g.name} (${g.id}): ${g.description}`).join('\n')}
    
    Context - All Projects (Use this to answer specific questions):
    ${allProjects.map(p => `
    - Project: ${p.title}
      - ID: ${p.id}
      - Role: ${p.role}
      - Description: ${p.description}
      - Tech Stack: ${p.tags.join(', ')}
      - Galaxy: ${p.galaxy}
      - Featured: ${p.featured ? 'Yes' : 'No'}
      ${p.links ? `- Links: ${Object.entries(p.links).map(([k, v]) => `${k}: ${v}`).join(', ')}` : ''}
    `).join('\n')}
    
    Instructions:
    - If asked about specific technologies (e.g., "React projects"), list relevant projects.
    - If asked about "best" or "featured" work, highlight the Featured projects.
    - Keep responses under 3-4 sentences unless asked for deep detail.
    - Do not make up info not in this context.
    `

    // Prepare messages for MiniMax
    // MiniMax expects specific format. We'll map standard messages.
    // Ensure the system prompt is the first message or correctly placed.
    // MiniMax v2 usually takes 'messages' array.
    
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    // Add 15s timeout to prevent hanging if external API is slow
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    let response: Response
    try {
      response = await fetch(MINMAX_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'abab5.5-chat',
          stream: false,
          messages: apiMessages.map(m => ({
              sender_type: m.role === 'user' ? 'USER' : 'BOT',
              sender_name: m.role === 'user' ? 'Visitor' : 'Galaxy Guide',
              text: m.content
          })),
          bot_setting: [
              {
                  bot_name: "Galaxy Guide",
                  content: systemPrompt
              }
          ],
          reply_constraints: {
              sender_type: "BOT",
              sender_name: "Galaxy Guide"
          }
        })
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json({
          role: 'assistant',
          content: `The galaxy databanks are taking too long to respond (timeout). Elizabeth's portfolio features ${allProjects.length} projects! Try exploring the 3D scene or ask me a simpler question.`
        })
      }
      throw fetchError
    }
    clearTimeout(timeoutId)

    if (!response.ok) {
        const errorText = await response.text()
        console.error('MiniMax API Error:', response.status, errorText)
        // Return a helpful fallback instead of throwing
        return NextResponse.json({
          role: 'assistant',
          content: `I'm having trouble connecting to the galaxy databanks (API Error ${response.status}). Elizabeth's portfolio features ${allProjects.length} projects across ${galaxies.length} galactic sectors! Try asking me about specific technologies like React, AI, or TypeScript.`
        })
    }

    const data = await response.json()

    // MiniMax response format parsing - handle multiple possible formats
    // Log which format was matched for debugging
    let formatUsed = 'fallback'
    let replyContent: string

    if (data.choices?.[0]?.messages?.[0]?.text) {
      replyContent = data.choices[0].messages[0].text
      formatUsed = 'MiniMax v2'
    } else if (data.choices?.[0]?.message?.content) {
      replyContent = data.choices[0].message.content
      formatUsed = 'OpenAI-style'
    } else if (data.reply) {
      replyContent = data.reply
      formatUsed = 'simple reply'
    } else if (data.choices?.[0]?.text) {
      replyContent = data.choices[0].text
      formatUsed = 'alternative'
    } else {
      replyContent = "I'm here to help you explore Elizabeth's portfolio! Ask me about her projects, skills, or technologies."
      console.warn('MiniMax API: No recognized response format, using fallback. Response keys:', Object.keys(data))
    }

    if (formatUsed !== 'fallback' && process.env.NODE_ENV === 'development') {
      console.log(`MiniMax API response format: ${formatUsed}`)
    }

    return NextResponse.json({ role: 'assistant', content: replyContent })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
