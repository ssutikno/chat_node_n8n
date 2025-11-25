import { useChatStore, Message } from '../store/chatStore';

const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
const n8nGetHistoryUrl = import.meta.env.VITE_N8N_GET_HISTORY_URL;

export const getHistoryFromN8n = async (sessionId: string): Promise<Message[]> => {
  if (!n8nGetHistoryUrl) {
    console.error('n8n get history URL is not configured.');
    // Return empty array but show an error in the chat?
    throw new Error('History URL is not configured.');
  }

  try {
    const url = new URL(n8nGetHistoryUrl);
    url.searchParams.append('sessionId', sessionId);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('Failed to get history from n8n:', error);
    return []; // Return empty array on error to prevent crash
  }
};

export const sendMessageToN8n = async (message: string): Promise<void> => {
  const { addMessage, setLoading, sessionId } = useChatStore.getState();

  if (!n8nWebhookUrl) {
    console.error('n8n webhook URL is not configured.');
    addMessage({
      id: `err_${Date.now()}`,
      text: 'Error: The n8n webhook URL is not configured. Please check the environment variables.',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId,
        message: message,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const botMessage: Message = {
      id: `bot_${Date.now()}`,
      text: data.response || '',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      chartData: data.chartData, // Include chartData if it exists
    };

    addMessage(botMessage);
  } catch (error) {
    console.error('Failed to send message to n8n:', error);
    const errorMessage: Message = {
      id: `err_${Date.now()}`,
      text: `Failed to get response from the bot. Please check the console for details.`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
    addMessage(errorMessage);
  } finally {
    setLoading(false);
  }
};
