let selectionBox = null
let startX = 0
let startY = 0
let isSelecting = false

const chrome = window.chrome // Declare the chrome variable

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START_SELECTION") {
    initializeSelection()
  }
})

function initializeSelection() {
  const overlay = document.createElement("div")
  overlay.id = "guardtfgbv-overlay"
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    cursor: crosshair;
    z-index: 2147483646;
    backdrop-filter: blur(2px);
  `

  const instruction = document.createElement("div")
  instruction.id = "guardtfgbv-instruction"
  instruction.style.cssText = `
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    color: #fff;
    padding: 14px 28px;
    border-radius: 10px;
    font-family: "Sentient", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 15px;
    font-weight: 600;
    z-index: 2147483647;
    border: 2px solid #d4af37;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    letter-spacing: -0.01em;
  `
  instruction.textContent = "Click and drag to select area • Press ESC to cancel"

  selectionBox = document.createElement("div")
  selectionBox.id = "guardtfgbv-selection"
  selectionBox.style.cssText = `
    position: fixed;
    border: 3px solid #d4af37;
    background: rgba(212, 175, 55, 0.15);
    z-index: 2147483646;
    pointer-events: none;
    display: none;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
  `

  document.body.appendChild(overlay)
  document.body.appendChild(instruction)
  document.body.appendChild(selectionBox)

  overlay.addEventListener("mousedown", handleMouseDown)
  overlay.addEventListener("mousemove", handleMouseMove)
  overlay.addEventListener("mouseup", handleMouseUp)

  document.addEventListener("keydown", handleEscape)
}

function handleMouseDown(e) {
  isSelecting = true
  startX = e.clientX
  startY = e.clientY

  selectionBox.style.display = "block"
  selectionBox.style.left = startX + "px"
  selectionBox.style.top = startY + "px"
  selectionBox.style.width = "0px"
  selectionBox.style.height = "0px"
}

function handleMouseMove(e) {
  if (!isSelecting) return

  const currentX = e.clientX
  const currentY = e.clientY

  const left = Math.min(startX, currentX)
  const top = Math.min(startY, currentY)
  const width = Math.abs(currentX - startX)
  const height = Math.abs(currentY - startY)

  selectionBox.style.left = left + "px"
  selectionBox.style.top = top + "px"
  selectionBox.style.width = width + "px"
  selectionBox.style.height = height + "px"
}

async function handleMouseUp(e) {
  if (!isSelecting) return
  isSelecting = false

  const rect = selectionBox.getBoundingClientRect()

  if (rect.width < 10 || rect.height < 10) {
    cleanup()
    chrome.runtime.sendMessage({ type: "SELECTION_CANCELLED" })
    return
  }

  cleanup()

  try {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const screenshot = await chrome.runtime.sendMessage({
      type: "CAPTURE_SCREENSHOT",
      rect: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      },
    })

    if (screenshot && screenshot.dataUrl) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(
          img,
          rect.left * window.devicePixelRatio,
          rect.top * window.devicePixelRatio,
          rect.width * window.devicePixelRatio,
          rect.height * window.devicePixelRatio,
          0,
          0,
          rect.width,
          rect.height,
        )

        const croppedDataUrl = canvas.toDataURL("image/png")

        chrome.runtime.sendMessage({
          type: "EXTRACT_TEXT_FROM_IMAGE",
          imageData: croppedDataUrl,
        })
      }
      img.src = screenshot.dataUrl
    }
  } catch (error) {
    console.error("Screenshot capture failed:", error)
    chrome.runtime.sendMessage({ type: "SELECTION_CANCELLED" })
  }
}

function handleEscape(e) {
  if (e.key === "Escape") {
    cleanup()
    chrome.runtime.sendMessage({ type: "SELECTION_CANCELLED" })
  }
}

function cleanup() {
  const overlay = document.getElementById("guardtfgbv-overlay")
  const instruction = document.getElementById("guardtfgbv-instruction")
  const selection = document.getElementById("guardtfgbv-selection")

  if (overlay) overlay.remove()
  if (instruction) instruction.remove()
  if (selection) selection.remove()

  document.removeEventListener("keydown", handleEscape)
}
