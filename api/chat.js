export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const { messages } = req.body;

    const lastMessage =
      messages[messages.length - 1]?.content || '';

    const prompt = `
You are NeuroShield, a helpful ADHD and dyslexia friendly AI assistant.

Keep answers:
- Short
- Clear
- Friendly
- Easy to read

User: ${lastMessage}
`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data);

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a response.';

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}