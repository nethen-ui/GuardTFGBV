const API_KEY = ""
const chrome = window.chrome
const Tesseract = require("tesseract.js")

importScripts("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js")

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CAPTURE_SCREENSHOT") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      sendResponse({ dataUrl })
    })
    return true
  }

  if (message.type === "EXTRACT_TEXT_FROM_IMAGE") {
    extractTextFromImage(message.imageData)
      .then((text) => {
        chrome.runtime.sendMessage({
          type: "SCREENSHOT_CAPTURED",
          text: text,
        })
      })
      .catch((error) => {
        console.error("OCR failed:", error)
        chrome.runtime.sendMessage({
          type: "SCREENSHOT_CAPTURED",
          text: "Error extracting text from image",
        })
      })
    return true
  }

  if (message.type === "ANALYZE_TEXT") {
    analyzeWithGroq(message.text)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ error: error.message }))
    return true
  }
})

async function extractTextFromImage(imageData) {
  const {
    data: { text },
  } = await Tesseract.recognize(imageData, "eng", {
    logger: (m) => console.log(m),
  })
  return text.trim()
}

async function analyzeWithGroq(text) {
  if (!API_KEY || API_KEY === "") {
    throw new Error("API key not configured")
  }

  const prompt = `You are an AI assistant specialized in detecting Technology Facilitated Gender-Based Violence (TFGBV). Analyze the following text and determine if it contains TFGBV content such as harassment, threats, cyberstalking, non-consensual sharing of intimate images, or other forms of digital abuse targeting someone based on their gender.

Text to analyze: "${text}"

Respond in JSON format with:
{
  "isTFGBV": true or false,
  "analysis": "Brief explanation of your findings"
}`

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in identifying Technology Facilitated Gender-Based Violence. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    throw new Error("API request failed")
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  try {
    return JSON.parse(content)
  } catch (e) {
    return {
      isTFGBV: false,
      analysis: "Unable to parse analysis result",
    }
  }
}
