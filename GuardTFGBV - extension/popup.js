const STORAGE_KEY = "guardtfgbv_api_key"
const WEBSITE_URL = "YOUR_WEBSITE_URL_HERE"
let apiKey = ""
let currentMode = "chat"
let chatHistory = []

document.addEventListener("DOMContentLoaded", async () => {
  await loadApiKey()
  setupEventListeners()

  if (apiKey) {
    showView("mainView")
    displayWelcomeMessage()
  } else {
    showView("setupView")
  }
})

async function loadApiKey() {
  const result = await window.chrome.storage.local.get(STORAGE_KEY)
  apiKey = result[STORAGE_KEY] || ""
}

async function saveApiKey(key) {
  await window.chrome.storage.local.set({ [STORAGE_KEY]: key })
  apiKey = key
}

function setupEventListeners() {
  document.getElementById("saveApiKeyBtn").addEventListener("click", handleSaveApiKey)
  document.getElementById("chatModeBtn").addEventListener("click", () => switchMode("chat"))
  document.getElementById("analyzeModeBtn").addEventListener("click", () => switchMode("analyze"))
  document.getElementById("sendChatBtn").addEventListener("click", handleSendChat)
  document.getElementById("chatInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendChat()
    }
  })
  document.getElementById("analyzeTextBtn").addEventListener("click", handleAnalyzeText)
  document.getElementById("settingsBtn").addEventListener("click", () => {
    showView("setupView")
  })
}

async function handleSaveApiKey() {
  const input = document.getElementById("apiKeyInput")
  const key = input.value.trim()

  if (!key) {
    alert("Please enter a valid API key")
    return
  }

  await saveApiKey(key)
  showView("mainView")
  displayWelcomeMessage()
  input.value = ""
}

function showView(viewId) {
  document.querySelectorAll(".content").forEach((view) => {
    view.classList.add("hidden")
  })
  document.getElementById(viewId).classList.remove("hidden")
}

function switchMode(mode) {
  currentMode = mode

  document.querySelectorAll(".mode-button").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll(".mode-content").forEach((content) => content.classList.add("hidden"))

  if (mode === "chat") {
    document.getElementById("chatModeBtn").classList.add("active")
    document.getElementById("chatMode").classList.remove("hidden")
  } else {
    document.getElementById("analyzeModeBtn").classList.add("active")
    document.getElementById("analyzeMode").classList.remove("hidden")
  }
}

function displayWelcomeMessage() {
  const messagesDiv = document.getElementById("chatMessages")
  messagesDiv.innerHTML = ""
  chatHistory = []

  const welcomeMsg = createMessageElement(
    "Hello! I'm Guard AI, your TFGBV awareness assistant. Ask me anything about Technology Facilitated Gender-Based Violence, how to stay safe online, or how to report incidents.",
    "assistant",
  )
  messagesDiv.appendChild(welcomeMsg)
}

async function handleSendChat() {
  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message) return

  const messagesDiv = document.getElementById("chatMessages")
  const sendBtn = document.getElementById("sendChatBtn")

  const userMsg = createMessageElement(message, "user")
  messagesDiv.appendChild(userMsg)
  messagesDiv.scrollTop = messagesDiv.scrollHeight

  chatHistory.push({ role: "user", content: message })
  input.value = ""
  input.style.height = "auto"
  sendBtn.disabled = true

  const loadingMsg = createMessageElement("Thinking<span class='loading-dots'></span>", "assistant")
  messagesDiv.appendChild(loadingMsg)
  messagesDiv.scrollTop = messagesDiv.scrollHeight

  try {
    const response = await callGroqAPI(chatHistory, false)
    messagesDiv.removeChild(loadingMsg)

    const assistantMsg = createMessageElement(response.content, "assistant", response.isTFGBV)
    messagesDiv.appendChild(assistantMsg)

    chatHistory.push({ role: "assistant", content: response.content })
    messagesDiv.scrollTop = messagesDiv.scrollHeight
  } catch (error) {
    messagesDiv.removeChild(loadingMsg)
    const errorMsg = createMessageElement(
      "Sorry, I encountered an error. Please check your API key and try again.",
      "assistant",
    )
    messagesDiv.appendChild(errorMsg)
  } finally {
    sendBtn.disabled = false
  }
}

async function handleAnalyzeText() {
  const textarea = document.getElementById("analyzeInput")
  const text = textarea.value.trim()
  const analyzeBtn = document.getElementById("analyzeTextBtn")
  const resultDiv = document.getElementById("analysisResult")

  if (!text) {
    alert("Please paste some text to analyze")
    return
  }

  analyzeBtn.disabled = true
  analyzeBtn.textContent = "Analyzing..."
  resultDiv.classList.add("hidden")

  try {
    const response = await callGroqAPI([{ role: "user", content: text }], true)

    const formattedContent = response.content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>")

    resultDiv.innerHTML = `
      <div class="result-badge ${response.isTFGBV ? "danger" : "safe"}">
        ${response.isTFGBV ? "⚠️ TFGBV Detected" : "✓ Content Appears Safe"}
      </div>
      <div class="result-text">${formattedContent}</div>
      ${response.isTFGBV ? `<button class="report-button" id="reportBtnAnalyze">Report This Content</button>` : ""}
    `

    resultDiv.classList.remove("hidden")

    if (response.isTFGBV) {
      document.getElementById("reportBtnAnalyze").addEventListener("click", () => {
        window.chrome.tabs.create({ url: WEBSITE_URL })
      })
    }
  } catch (error) {
    resultDiv.innerHTML = `
      <div class="result-badge danger">Error</div>
      <div class="result-text">Failed to analyze text. Please check your API key and try again.</div>
    `
    resultDiv.classList.remove("hidden")
  } finally {
    analyzeBtn.disabled = false
    analyzeBtn.textContent = "Analyze Text"
  }
}

async function callGroqAPI(messages, isAnalysis) {
  const systemPrompt = isAnalysis
    ? "You are an AI assistant specialized in detecting Technology Facilitated Gender-Based Violence (TFGBV). Analyze the provided text and determine if it contains TFGBV content such as harassment, threats, cyberstalking, non-consensual sharing of intimate images, or other forms of digital abuse targeting someone based on their gender. Format your response with clear headings using **bold** for key points and organize with bullet points where appropriate. Provide a structured, easy-to-read analysis."
    : "You are Guard AI, a helpful assistant specialized in Technology Facilitated Gender-Based Violence (TFGBV) awareness. You help users understand TFGBV, stay safe online, and know how to report incidents. Be empathetic, informative, and supportive. Format your responses with clear structure using **bold** for key terms and organize information with bullet points for easy reading."

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    throw new Error("API request failed")
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  const isTFGBV =
    content.toLowerCase().includes("tfgbv") ||
    content.toLowerCase().includes("harassment") ||
    content.toLowerCase().includes("threat") ||
    content.toLowerCase().includes("abuse") ||
    content.toLowerCase().includes("violence") ||
    content.toLowerCase().includes("detected") ||
    content.toLowerCase().includes("harmful")

  return { content, isTFGBV }
}

function createMessageElement(text, type, isTFGBV = false) {
  const msgDiv = document.createElement("div")
  msgDiv.className = "chat-message"

  const contentDiv = document.createElement("div")
  contentDiv.className = `message-${type}`
  if (isTFGBV && type === "assistant") {
    contentDiv.classList.add("tfgbv-warning")
  }

  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^### (.*$)/gim, "<h4>$1</h4>")
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>")

  contentDiv.innerHTML = formattedText

  msgDiv.appendChild(contentDiv)
  return msgDiv
}
