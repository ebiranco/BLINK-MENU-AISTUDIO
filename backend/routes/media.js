// backend/routes/media.js
const express = require('express');
const router = express.Router();
const { GoogleGenAI, Modality, Type } = require('@google/genai');

// Ensure API_KEY is loaded from the root .env file via the main server entry point
if (!process.env.API_KEY) {
  console.error('CRITICAL: API_KEY is not defined in the environment.');
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Endpoint to generate text descriptions
router.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    res.json({ text: response.text });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Failed to generate text from AI.' });
  }
});

// Endpoint for the AI Photography Studio (re-imagining an image)
router.post('/generate-image', async (req, res) => {
  const { base64Image, mimeType, prompt } = req.body;
  if (!base64Image || !mimeType || !prompt) {
    return res.status(400).json({ error: 'Image data, mime type, and prompt are required.' });
  }

  try {
    const imagePart = {
      inlineData: { data: base64Image, mimeType },
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return res.json({
          base64Image: part.inlineData.data,
          mimeType: part.inlineData.mimeType
        });
      }
    }
    res.status(500).json({ error: 'AI did not return an image. Please refine your prompt.' });

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image from AI.' });
  }
});

// Endpoint for the AI Video Studio
router.post('/generate-video', async (req, res) => {
    const { base64Image, mimeType, prompt } = req.body;
    if (!base64Image || !mimeType || !prompt) {
        return res.status(400).json({ error: 'Image data, mime type, and prompt are required.' });
    }

    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt,
            image: { imageBytes: base64Image, mimeType },
            config: { numberOfVideos: 1 }
        });
        
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            res.json({ videoUrl: `${downloadLink}&key=${process.env.API_KEY}` });
        } else {
            throw new Error("Video generation completed but no URL was returned.");
        }

    } catch (error) {
        console.error('Error generating video:', error);
        res.status(500).json({ error: 'Failed to generate video from AI.' });
    }
});


// Endpoint for Esm Famil AI opponent
router.post('/esm-famil-ai', async (req, res) => {
    const { letter } = req.body;
    if (!letter) {
        return res.status(400).json({ error: 'Starting letter is required.' });
    }

    try {
        const prompt = `You are playing the Persian word game 'Esm Famil'. The starting letter is '${letter}'. Provide a single, valid, common Persian answer for each category.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    family: { type: Type.STRING },
                    city: { type: Type.STRING },
                    country: { type: Type.STRING },
                    animal: { type: Type.STRING },
                    food: { type: Type.STRING },
                    object: { type: Type.STRING },
                }
              }
            }
        });

        res.json(JSON.parse(response.text));
    } catch (error) {
        console.error('Esm Famil AI Error:', error);
        res.status(500).json({ error: 'AI opponent failed to generate answers.' });
    }
});

module.exports = router;
