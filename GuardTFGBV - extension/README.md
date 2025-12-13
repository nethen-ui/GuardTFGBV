# GuardTFGBV Browser Extension

## Setup Instructions

### 1. Configure Website URL (Optional)

Open `popup.js` and replace the placeholder with your hosted website URL:
\`\`\`javascript
const WEBSITE_URL = "YOUR_WEBSITE_URL_HERE"
\`\`\`

This is where users will be redirected when they click the "Report This Content" button.

### 2. Install Extension in Chrome/Edge

1. Open Chrome or Edge browser
2. Navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `extension` folder from your project
6. The extension icon should appear in your toolbar

### 3. Get Your Groq API Key

1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up or log in to your Groq account
3. Create a new API key
4. Copy the API key

### 4. Configure the Extension

1. Click the GuardTFGBV extension icon in your toolbar
2. Enter your Groq API key in the setup screen
3. Click "Save API Key"
4. The extension is now ready to use!

### 5. Use the Extension

#### Chat Mode (Default)
- Ask questions about TFGBV
- Get information about staying safe online
- Learn how to report incidents
- The AI will detect concerning content and offer to help you report it

#### Text Analysis Mode
- Switch to "Text Analysis" tab
- Paste any text you want to analyze
- Click "Analyze Text"
- Get instant feedback on whether the text contains potential TFGBV
- Report button appears if TFGBV is detected

## Features

- **AI Chatbot**: Interactive assistant specialized in TFGBV awareness
- **Text Analysis**: Analyze clipboard text for potential TFGBV content
- **Secure API Storage**: Your API key is stored locally in your browser
- **Report Integration**: Direct links to report incidents on the website
- **Beautiful UI**: Matches the GuardTFGBV website aesthetic with Sentient fonts

## How It Works

The extension uses your personal Groq API key to analyze content:
1. **User Input**: You either chat with the AI or paste text to analyze
2. **Groq API**: Your text is sent to Groq's AI model for analysis
3. **TFGBV Detection**: The AI identifies potential gender-based violence content
4. **Results**: Clear feedback with option to report if needed

## Security

- Your API key is stored securely in Chrome's local storage
- API keys are never exposed in the extension code
- All API calls are made server-side through Groq's secure endpoints
- No data is stored or sent to third parties

## Troubleshooting

- **"API key not configured"**: Make sure you entered your Groq API key in the setup screen
- **"Analysis failed"**: Check your internet connection and API key validity
- **Settings button**: Click the gear icon to change your API key
- Check the browser console (F12) for detailed error messages if issues persist

## Tips

- The chatbot remembers conversation context within a session
- Text analysis works best with clear, complete sentences
- You can switch between modes anytime without losing your settings
- Get a free Groq API key at [console.groq.com](https://console.groq.com)
