# *GuardTFGBV*
GuardTFGBV is a comprehensive platform for raising awareness, detecting, and reporting technology-facilitated gender-based violence.

*Empowering users to recognize, respond, and report digital abuse against women and girls.*


**Table of Contents**

[1. Project Overview](#project-overview)

[2. Features](#features)

[3. Demo](#demo)

[4. Installation](#installation)

[5. Usage](#usage)

[6. Technologies Used](#techologies-used)

=====================================================================================

**Project Overview**

GuardTFGBV is an integrated platform designed to educate, simulate, detect, and report text-based harassment, coercion, and abusive content against women and girls online.

It consists of:
- Website: Focused on awareness and training.
- Browser Extension: Focused on real-time detection and guidance.

This project aims to empower users to safely navigate digital spaces, respond confidently to abuse, and report incidents responsibly.

======================================================================================

**Features**

1. *Website*

- AI Awareness Chatbot: A large language model (LLM) that answers all questions related to TFGBV, providing guidance and information.

- Text Simulation: Interactive scenarios where users practice responding to harassment. The system evaluates responses and provides awareness feedback.

- Reporting Section: Secure form to report incidents to authorities or partner organizations. Reporter identity is optional.

- Informative Home Page: Includes descriptions, definitions, types of TFGBV, and an educational video.

2. *Browser Extension*

- AI-Powered LLM: Analyze suspicious text or ask questions for real-time guidance.

- TFGBV Detector: Detects abuse in text, suggests safe responses, and provides a one-click link to reporting.

- Seamless Integration: Downloadable via the website for easy access.
  
====================================================================================

**Installation**

1. Clone into the repository or download the zip file
   
   ```bash
   git clone https://github.com/nethen-ui/GuardTFGBV
   
2. Open your IDE or terminal on the folder
   
   ```bash
   cd GuardTFGBV

3. Install Node.js (if not installed yet)
   
   - For Windows
     
   ```powershell
   winget install OpenJS.NodeJS.LTS
   ```
   - For Linux
     
   ```bash
   sudo apt update
   sudo apt install nodejs npm -y
   
4. Install all the packages in the project
   
   ```bash
   npm install --legacy-peer-deps

5. Run the program
   
   ```bash
   npm run dev

6. Open the website on your local host
   
   - Your localhost might look like:
     
     ```bash
     http://localhost:3000

-------------------------------------------------------------------------------

*To install the extension, you can use the "Download Extension" button on the top right corner of the website, or you can download it directly with the link below:*

After downloading the browser extension, 

1. Go to chrome
2. Open up Extensions > Manage Extensions
3. Turn in the Developer Mode switch on the top right corner
4. Use the Load Unpacked button on the top left corner
5. Choose the file you downloaded

===================================================================================

**Usage**

- Ask the chatbot about TFGBV.
- Practice responses in the simulation section.
- Paste suspicious text into the extension for real-time detection.
- Report incidents directly through the website form.

===================================================================================

**Technologies Used**

- Next.js - React framework
- Groq Cloud API - for real time analysis and LLM
- EmailJS - for email based reporting system (no server required)
- Chrome extension API - for browser extension

===================================================================================

**Thank You!**
