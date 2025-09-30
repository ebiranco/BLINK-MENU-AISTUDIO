import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';
import { GoogleGenAI } from '@google/genai';

interface AITextGeneratorProps {
  onClose: () => void;
  language: Language;
  onGenerate?: (text: string) => void;
  context?: string;
}

const AITextGenerator: React.FC<AITextGeneratorProps> = ({ onClose, language, onGenerate, context }) => {
  const [prompt, setPrompt] = useState(context || '');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError('');
    setGeneratedText('');

    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text;
      setGeneratedText(text);

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseText = () => {
    if (onGenerate && generatedText) {
      onGenerate(generatedText);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{t('generateWithAI', language)}</h2>
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
                placeholder="e.g., Generate a delicious description for a pepperoni pizza"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? t('generating', language) : t('generateWithAI', language)}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {generatedText && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h3 className="font-semibold mb-2">{t('aiGeneratedText', language)}</h3>
                <p>{generatedText}</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300">
              {t('cancel', language)}
            </button>
            <button 
              type="button" 
              onClick={handleUseText}
              disabled={!generatedText}
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
            >
              {t('aiUseThisText', language)}
            </button>
          </div>
      </div>
    </div>
  );
};

export default AITextGenerator;
