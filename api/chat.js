export default async function handler(req, res) {
  try {
    const { messages } = req.body;

    const userMessage =
      messages[messages.length - 1]?.content || '';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userMessage,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({
        reply: data.error.message,
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      reply: reply || 'No response generated.',
    });

  } catch (error) {
    return res.status(500).json({
      reply: error.message,
    });
  }
}