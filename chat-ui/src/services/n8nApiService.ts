import { useChatStore, Message } from '../store/chatStore';

const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
const n8nGetHistoryUrl = import.meta.env.VITE_N8N_GET_HISTORY_URL;

export const getHistoryFromN8n = async (conversationId: string): Promise<Message[]> => {
  if (!n8nGetHistoryUrl) {
    console.error('n8n get history URL is not configured.');
    // Return empty array but show an error in the chat?
    throw new Error('History URL is not configured.');
  }

  try {
    const url = new URL(n8nGetHistoryUrl);
    url.searchParams.append('sessionId', conversationId);

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
  const { addMessage, setLoading, activeConversationId, updateMessage } = useChatStore.getState();

  if (!activeConversationId) {
    console.error('Cannot send message, no active conversation.');
    return;
  }

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
        sessionId: activeConversationId,
        message: message,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    let isJson = false;

    // Handle JSON response (non-streaming)
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.clone().json();
        const botMessage: Message = {
          id: `bot_${Date.now()}`,
          text: data.response || '',
          sender: 'bot',
          timestamp: new Date().toISOString(),
          chartData: data.chartData,
        };
        addMessage(botMessage);
        isJson = true;
      } catch (e) {
        // This is expected if the response is a stream of JSON objects (NDJSON)
        // but the content-type is application/json. We'll fall back to stream processing.
        console.debug('Failed to parse strict JSON response, falling back to stream processing.');
      }
    } 
    
    // Handle Streaming response (text/plain, text/event-stream, etc.) or failed JSON
    if (!isJson) {
      const botMessageId = `bot_${Date.now()}`;
      const initialBotMessage: Message = {
        id: botMessageId,
        text: '',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      addMessage(initialBotMessage);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulatedText = '';
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
             const chunk = decoder.decode();
             if (chunk) buffer += chunk;
             if (buffer.length > 0) {
                 accumulatedText += buffer;
                 updateMessage(botMessageId, { text: accumulatedText });
             }
             break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          let processedIndex = 0;
          
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const startBrace = buffer.indexOf('{', processedIndex);
            
            if (startBrace === -1) {
                const remaining = buffer.substring(processedIndex);
                if (remaining.trim().length > 0 && !remaining.trimStart().startsWith('{')) {
                     accumulatedText += remaining;
                     processedIndex = buffer.length;
                }
                break;
            }
            
            if (startBrace > processedIndex) {
                const content = buffer.substring(processedIndex, startBrace);
                // If content is purely whitespace and contains a newline, treat it as a delimiter and skip it.
                // This prevents adding extra newlines between JSON objects in the stream.
                const isWhitespace = !content.trim();
                const hasNewline = content.includes('\n') || content.includes('\r');
                
                if (!isWhitespace || !hasNewline) {
                    accumulatedText += content;
                }
            }
            
            let braceCount = 0;
            let endBrace = -1;
            for (let i = startBrace; i < buffer.length; i++) {
                if (buffer[i] === '{') braceCount++;
                else if (buffer[i] === '}') braceCount--;
                
                if (braceCount === 0) {
                    endBrace = i;
                    break;
                }
            }
            
            if (endBrace !== -1) {
                const jsonStr = buffer.substring(startBrace, endBrace + 1);
                try {
                    const json = JSON.parse(jsonStr);
                    const text = json.response || json.text || json.output || json.message || json.content || json.answer || json.result || json.data || json.completion;
                    
                    if (text && typeof text === 'string') {
                        accumulatedText += text;
                    } else if (json.chartData) {
                        // Valid JSON with chart data but no text, do nothing to text
                    } else if (json.type === 'begin' || json.type === 'end') {
                        // Ignore n8n begin/end events
                    } else if (json.metadata && !text && !json.chartData) {
                        // Ignore metadata-only objects if they don't have text or chart data
                    } else {
                        // Fallback: if we can't identify the text field, show the raw JSON
                        // so the user isn't left with an empty message.
                        accumulatedText += jsonStr;
                    }
                    
                    if (json.chartData) {
                         updateMessage(botMessageId, { chartData: json.chartData });
                    }
                } catch (e) {
                    accumulatedText += jsonStr;
                }
                processedIndex = endBrace + 1;
            } else {
                break;
            }
          }
          
          if (processedIndex > 0) {
              buffer = buffer.substring(processedIndex);
          }
          
          updateMessage(botMessageId, { text: accumulatedText });
        }
      }
    }

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
