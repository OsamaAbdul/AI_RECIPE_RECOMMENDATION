export async function getRecipeFromMistral(ingredients, onChunkReceived) {
    console.log('Environment variables:', import.meta.env);
    const apiKey = process.env.REACT_APP_API_KEY;
    const url = 'https://api.aimlapi.com/v1/chat/completions';
  
    if (!apiKey) {
      console.error('VITE_API_KEY is not defined. Please check your .env file.');
      throw new Error('API key is missing. Please configure VITE_API_KEY in your .env file.');
    }
    console.log('Starting streaming request...');
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a skilled chef. Create a detailed recipe using the provided ingredients.',
            },
            {
              role: 'user',
              content: `Generate a recipe using these ingredients: ${ingredients.join(', ')}. Include a title, ingredients list, and step-by-step instructions.`,
            },
          ],
          max_tokens: 500,
          stream: true,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`API error! Status: ${response.status}`);
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let jsonBuffer = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
        console.log('Raw chunk:', chunk);
  
        jsonBuffer += chunk;
        const lines = jsonBuffer.split('\n');
  
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '');
            if (data === '[DONE]') continue;
  
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                accumulatedContent += content;
                onChunkReceived(accumulatedContent);
              }
            } catch (e) {
              console.error('Error parsing line:', line, e);
            }
          }
        }
        jsonBuffer = lines[lines.length - 1];
      }
  
      if (jsonBuffer.trim().startsWith('data: ')) {
        const data = jsonBuffer.replace('data: ', '');
        if (data !== '[DONE]') {
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              accumulatedContent += content;
              onChunkReceived(accumulatedContent);
            }
          } catch (e) {
            console.error('Error parsing final buffer:', jsonBuffer, e);
          }
        }
      }
  
      if (!accumulatedContent) {
        console.warn('No content received in stream. Falling back to non-streaming...');
        return await getNonStreamingRecipe(ingredients);
      }
  
      return accumulatedContent;
    } catch (error) {
      console.error('Streaming failed:', error);
      throw error;
    }
  }
  
  // Non-streaming fallback
  async function getNonStreamingRecipe(ingredients) {
    const apiKey = process.env.REACT_APP_API_KEY;
    const url = 'https://api.aimlapi.com/v1/chat/completions';
  
    if (!apiKey) {
      throw new Error('VITE_API_KEY is not defined in .env');
    }
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a skilled chef. Create a detailed recipe using the provided ingredients.',
            },
            {
              role: 'user',
              content: `Generate a recipe using these ingredients: ${ingredients.join(', ')}. Include a title, ingredients list, and step-by-step instructions. Also give it a human-like fancy write ups`,
            },
          ],
          max_tokens: 500,
          stream: false,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`API error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Non-streaming response:', data);
      return data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Non-streaming error: ${error.message}`);
    }
  }