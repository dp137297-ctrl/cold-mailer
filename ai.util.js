const OPENROUTER_API_URL =
  "https://openrouter.ai/api/v1/chat/completions";

export const extractWithNvidia = async (prompt, imageData = null) => {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is missing. Check your .env file."
    );
  }

  const content = [{ type: "text", text: prompt }];

  if (imageData) {
    content.push({
      type: "image_url",
      image_url: { url: imageData },
    });
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        messages: [{ role: "user", content }],
        temperature: 0.2,
        max_tokens: 2000,
        stream: false,
      }),
      signal: AbortSignal.timeout(120000),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        `OpenRouter request failed (${response.status}): ${JSON.stringify(result)}`
      );
    }

    const responseContent = result.choices?.[0]?.message?.content;
    if (typeof responseContent !== "string") {
      throw new Error("OpenRouter response did not contain message content");
    }
    return responseContent;
  } catch (error) {
    console.error("OpenRouter request error:", error.message);
    throw error;
  }
};
