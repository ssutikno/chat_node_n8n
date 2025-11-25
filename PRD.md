# Product Requirements Document (PRD) - v1.1
## Chat System App - n8n Chat Trigger Replacement

---

## 1. Executive Summary

### 1.1 Product Overview
A standalone chat system application designed to replace the native n8n chat trigger, providing a ChatGPT-like user interface for seamless conversational interactions with n8n workflows. This version introduces server-side history and data visualization capabilities.

### 1.2 Product Vision
Create an intuitive, modern chat interface that bridges end-users and n8n automation workflows, offering a familiar ChatGPT-style experience while maintaining full integration with n8n's powerful automation capabilities.

### 1.3 Target Users
- Business users interacting with automated workflows
- Customer support teams using n8n for chatbot automation
- Developers testing n8n chat workflows
- End-users requiring conversational interfaces for business processes

---

## 2. Problem Statement

### 2.1 Current Pain Points
- n8n's native chat trigger has limited UI customization and a dated interface.
- Lack of secure, persistent chat history across sessions.
- Inability to visualize data within the chat interface.

### 2.2 Solution
A dedicated chat application with:
- A modern, ChatGPT-inspired UI/UX.
- Secure, server-side chat history managed by n8n.
- Support for rendering charts and graphs.
- Full n8n workflow integration and customizable appearance.

---

## 3. Product Goals & Success Metrics

### 3.1 Goals
1. Provide a production-ready, secure alternative to the n8n chat trigger.
2. Deliver a ChatGPT-like user experience with persistent history.
3. Enable data visualization through charts within the conversation.
4. Ensure seamless integration with n8n workflows.

### 3.2 Success Metrics
- User adoption rate > 80% among target users.
- Average response time < 2 seconds.
- User satisfaction score > 4.5/5.
- Flawless history retrieval and message persistence.
- 99.9% uptime SLA for the chat interface.

---

## 4. Functional Requirements

### 4.1 User Interface
- **Main Chat Area**: Displays messages, charts, and loading indicators.
- **Message Display**: Renders user and bot messages, Markdown content, and charts.
- **Visual Design**: Includes a light/dark mode toggle and a responsive layout.
- **Message Input**: A multi-line, auto-resizing text area for composing messages.

### 4.2 Chat Functionality

#### 4.2.1 Core Features
- Send text messages to a primary n8n workflow.
- Receive and display text, Markdown, and chart responses.
- Load and display conversation history on startup.
- Real-time feedback with typing indicators.

#### 4.2.2 Session Management
- **Server-Side History**: The chat history is no longer stored in the browser. It is fetched from a dedicated n8n workflow on application load.
- **Persistent Session ID**: A unique `sessionId` is generated and stored in the browser's `localStorage` to identify the conversation. This ID is used to fetch the correct history.

#### 4.2.3 Message Types Support
- Plain text
- Markdown formatted text
- **Charts and Graphs**: Renders bar charts (with support for other types).
- Error messages with distinct styling.

### 4.3 n8n Integration
- **Two-Webhook System**: The application interacts with two separate n8n webhooks:
    1.  A `POST` webhook for sending messages and receiving responses.
    2.  A `GET` webhook for retrieving chat history.
- **Data Exchange**: The frontend sends a `sessionId` with every request. The n8n backend is responsible for all data storage operations.

---

## 6. Technical Architecture

### 6.1 Technology Stack

#### 6.1.1 Frontend
- **Framework**: React (with Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charting**: ECharts
- **HTTP Client**: Fetch API

#### 6.1.2 Backend (n8n)
- **Workflows**: Two required n8n workflows (one for chat, one for history).
- **Data Store**: A persistent data store (e.g., SQLite, PostgreSQL, Airtable) connected to the n8n instance to store chat messages.

### 6.2 Architecture Overview
The architecture now relies on the n8n instance to act as the backend for business logic and persistence.

```
┌──────────────┐   1. GET /history?sessionId=...   ┌──────────────────┐
│              ├──────────────────────────────────►│ n8n Get History  │
│              │                                  │ Workflow         │
│   Chat UI    │   2. Returns Message History     └─────────┬──────────┘
│ (React)      ├◄───────────────────────────────────────────┤
│              │                                  ┌─────────▼──────────┐
│              │   3. POST /chat (sends message)  │   Data Store     │
│              ├──────────────────────────────────►│ (e.g., Database) │
│              │                                  └─────────▲──────────┘
└───────┬──────┘   4. Returns Bot Response        ┌─────────┴──────────┐
        │        ◄────────────────────────────────┤ n8n Main Chat    │
        └─────────────────────────────────────────►│ Workflow         │
           (User interacts with UI)               └──────────────────┘
```

### 6.3 Data Flow
1.  App loads, reads `sessionId` from `localStorage`.
2.  Frontend calls the `get-history` n8n webhook with the `sessionId`.
3.  The n8n history workflow fetches messages from the data store and returns them.
4.  The chat UI displays the history.
5.  User sends a new message.
6.  Frontend sends the message and `sessionId` to the main n8n chat webhook.
7.  The main n8n workflow processes the message, generates a response, and saves both the user message and bot response to the data store.
8.  The workflow returns the bot's response to the UI.

---

## 9. API Specifications

### 9.1 Send Message to n8n

- **Endpoint**: Configured via `VITE_N8N_WEBHOOK_URL`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "sessionId": "session_1678886400000",
    "message": "User's message text",
    "timestamp": "2025-11-25T10:30:00Z"
  }
  ```

### 9.2 Get History from n8n

- **Endpoint**: Configured via `VITE_N8N_GET_HISTORY_URL`
- **Method**: `GET`
- **Query Parameters**: `?sessionId=<session_id>`
- **Success Response (200 OK)**:
  ```json
  {
    "messages": [
      { "id": "1", "text": "Hello", "sender": "user", "timestamp": "..." },
      { "id": "2", "text": "Hi!", "sender": "bot", "timestamp": "..." }
    ]
  }
  ```

### 9.3 Response from Main n8n Workflow

Your main workflow must return a JSON object.

#### 9.3.1 Standard Text Response
```json
{
  "response": "This is a plain text response from the bot."
}
```

#### 9.3.2 Chart Response
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

---

## 10. Deployment & Configuration

### 10.1 Deployment
- **Frontend**: Can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages).
- **Backend**: Requires an n8n instance with two configured workflows and a connected, persistent data store.

### 10.2 Environment Configuration
Create a `.env` file in the `chat-ui` directory with the following variables:
```env
# URL for the main n8n chat workflow
VITE_N8N_WEBHOOK_URL="https://your-n8n.instance.com/webhook/chat"

# URL for the n8n workflow that retrieves chat history
VITE_N8N_GET_HISTORY_URL="https://your-n8n.instance.com/webhook/get-history"
```

---
(Sections 11-15 remain largely unchanged)
---

## 16. Appendix

### 16.3 Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.1 | 2025-11-25 | AI Assistant | Implemented server-side history and chart functionality. Updated architecture to a two-webhook system. |
| 1.0 | 2025-11-25 | AI Assistant | Initial PRD creation. |

---

*This PRD is a living document and will be updated as requirements evolve.*
