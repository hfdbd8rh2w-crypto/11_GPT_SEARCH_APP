require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

app.post("/api/search", async (req, res) => {
  const query = (req.body?.query || "").trim();
  if (!query) {
    return res.status(400).json({ error: "Missing query text." });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Answer succinctly: ${query}`,
    });

    let answer = response.output_text;
    if (!answer && Array.isArray(response.output)) {
      const first = response.output.find(o => o?.content?.[0]?.text);
      answer = first?.content?.[0]?.text;
    }

    res.json({ answer: answer || "No answer returned from the model." });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Something went wrong talking to GPT." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});