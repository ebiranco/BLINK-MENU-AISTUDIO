import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';
import { GoogleGenAI } from '@google/genai';

interface AIImageGeneratorProps {
  onClose: () => void;
  language: Language;
  onGenerate: (imageUrl: string) => void;
  context?: string;
}

const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({ onClose, language, onGenerate, context }) => {
  const [prompt, setPrompt] = useState(context || 'A delicious looking pepperoni pizza on a wooden table');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError('');
    setGeneratedImage(null);

    try {
      if (!window.APP_CONFIG?.API_KEY) {
        throw new Error("API_KEY is not configured. Please run the setup script.");
      }
      const ai = new GoogleGenAI({ apiKey: window.APP_CONFIG.API_KEY });
      
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        }
      });
      
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      setGeneratedImage(imageUrl);

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseImage = () => {
    if (onGenerate && generatedImage) {
      onGenerate(generatedImage);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{t('generateWithAI', language)} Image</h2>
             <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">{t('aiprompt', language)}</label>
              <textarea
                id="prompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g., A delicious pepperoni pizza"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? t('generating', language) : t('generateImage', language)}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {generatedImage && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h3 className="font-semibold mb-2">{t('aiGeneratedImage', language)}</h3>
                <img src={generatedImage} alt="Generated" className="w-full h-auto rounded-md"/>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300">
              {t('cancel', language)}
            </button>
            <button 
              type="button" 
              onClick={handleUseImage}
              disabled={!generatedImage}
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
            >
              Use This Image
            </button>
          </div>
      </div>
    </div>
  );
};

export default AIImageGenerator;