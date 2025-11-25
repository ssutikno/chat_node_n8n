# n8n Chat UI

A standalone, ChatGPT-like chat application designed to provide a modern and intuitive user interface for interacting with n8n workflows. This project was built to replace the native n8n chat trigger with a more flexible and user-friendly alternative.

## Features

- **Modern UI/UX**: A clean, responsive design inspired by ChatGPT.
- **Server-Side History**: Fetches chat history from your n8n backend for persistent, secure conversations.
- **Light & Dark Mode**: Switch themes based on your preference.
- **Markdown Rendering**: Renders bot responses formatted in Markdown.
- **Chart & Graph Display**: Visualize data by rendering bar charts directly in the chat interface.
- **Typing Indicators**: Visual feedback while the bot is processing a response.

## Technology Stack

- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charting**: ECharts
- **HTTP Client**: Fetch API

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/)
- An n8n instance with a data store (e.g., a database like SQLite or PostgreSQL) connected.

### Installation

1.  **Clone the repository and navigate into the project directory:**
    ```sh
    git clone <repository_url>
    cd chat-ui
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

## Configuration

The application is configured using environment variables.

1.  **Create a `.env` file:**
    Copy the example file to create your local configuration:
    ```sh
    cp .env.example .env
    ```

2.  **Set Environment Variables:**
    Open the `.env` file and set the following variables:
    - `VITE_N8N_WEBHOOK_URL`: The URL for your main n8n chat workflow.
    - `VITE_N8N_GET_HISTORY_URL`: The URL for the n8n workflow that retrieves chat history.
    ```env
    VITE_N8N_WEBHOOK_URL="https://your-n8n.instance.com/webhook/chat"
    VITE_N8N_GET_HISTORY_URL="https://your-n8n.instance.com/webhook/get-history"
    ```

## Running the Application

Once the configuration is set, you can run the development server:

```sh
npm run dev
```

This will start the application, and you can view it in your browser at the URL provided in your terminal (usually `http://localhost:5173`).

## Chat History Architecture

This application relies on **your n8n backend** to store and retrieve chat history. The frontend only stores the `sessionId` in the browser. You are responsible for creating two workflows:

### 1. Main Chat Workflow (Saving Messages)

Your main chat workflow, triggered by `VITE_N8N_WEBHOOK_URL`, must be updated to **save both the user's message and the bot's response** to a persistent data store (e.g., a database).

-   The workflow receives the `sessionId`, `message`, and `timestamp` from the chat UI.
-   After processing and generating a response, use a database node (e.g., SQLite, Postgres) to insert the user's message and the bot's response, linking them to the `sessionId`.

### 2. Get History Workflow

You must create a **second workflow** triggered by `VITE_N8N_GET_HISTORY_URL` to fetch the conversation history.

-   **Method**: `GET`
-   **URL Structure**: The frontend will call `.../get-history?sessionId=<session_id>`.
-   **Action**: The workflow should use the `sessionId` from the query parameter to look up all messages for that session in your database.
-   **Response**: The workflow must return a JSON object containing a `messages` array. The messages should be sorted by timestamp.

**Expected JSON Response from the Get History Workflow:**
```json
{
  "messages": [
    {
      "id": "1",
      "text": "Hello",
      "sender": "user",
      "timestamp": "2025-11-25T10:30:00Z"
    },
    {
      "id": "2",
      "text": "Hi there! Welcome back.",
      "sender": "bot",
      "timestamp": "2025-11-25T10:30:01Z"
    }
  ]
}
```

## API Specification

### Request from Chat UI to Main Workflow

The chat UI sends the following JSON payload to your `VITE_N8N_WEBHOOK_URL`:

```json
{
  "sessionId": "session_1678886400000",
  "message": "User's message text",
  "timestamp": "2025-11-25T10:30:00Z"
}
```

### Response from Main Workflow to Chat UI

Your workflow must return a JSON object.

#### Standard Text Response
```json
{
  "response": "This is a plain text response from the bot."
}
```

#### Chart Response
```json
{
  "response": "Here is a chart of recent activity:",
  "chartData": {
    "type": "bar",
    "labels": ["Mon", "Tue", "Wed"],
    "datasets": [{ "label": "Interactions", "data": [65, 59, 80] }]
  }
}
```

## Customization

You can customize the appearance of the chat UI by modifying `tailwind.config.js` and re-running the development server.

## Build for Production

To create a production build, run:
```sh
npm run build
```
This command generates a `dist` folder with optimized assets for deployment.
