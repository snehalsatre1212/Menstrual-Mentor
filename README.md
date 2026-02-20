# Menstrual Mentor
https://menstrual-mentor.onrender.com/

A full-stack application for cycle tracking and analysis, built without authentication for ease of use.

## Features
- **Dashboard**: View cycle predictions, average cycle length, mood and energy charts, and analysis history.
- **Log Cycle**: Enter start and end dates, mood, energy levels, symptoms, and flow intensity.
- **Analyze Text**: Get wellness guidance based on text input.
- **Analyze Voice**: Use your microphone to speak your symptoms and get analysis.
- **Analyze Image**: Upload an image to detect the dominant color and receive basic wellness guidance.
- **History**: View past analysis logs.

## Setup Instructions

1. Clone or fork this repository.
2. Ensure you have Node.js installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on `.env.example` and add your database URL.
   ```bash
   cp .env.example .env
   ```
5. Push the database schema:
   ```bash
   npm run db:push
   ```
6. Start the development server (frontend and backend):
   ```bash
   npm run dev
   ```
7. Open your browser to the local URL.

*Disclaimer: This app provides wellness guidance only and does not replace medical consultation.*
