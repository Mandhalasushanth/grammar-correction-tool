import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const response = await fetch("https://api.languagetoolplus.com/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        text: text,
        language: "en-US"
      })
    });

    const result = await response.json();
    let corrected = text;

    if (result.matches) {
      result.matches.forEach(match => {
        if (match.replacements && match.replacements.length > 0) {
          corrected = corrected.replace(match.context.text, match.replacements[0].value);
        }
      });
    }

    res.status(200).json({ corrected });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}