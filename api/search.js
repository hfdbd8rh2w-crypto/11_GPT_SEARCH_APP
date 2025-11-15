const OpenAI = require("openai");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const query = (req.body?.query || "").trim();
  if (!query) {
    return res.status(400).json({ error: "Missing query text." });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Answer succinctly: ${query}` }
      ],
    });

    const answer = response.choices[0]?.message?.content || "No answer returned from the model.";
    res.status(200).json({ answer });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Something went wrong talking to GPT." });
  }
};

