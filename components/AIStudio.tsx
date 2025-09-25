import React, { useState, useEffect } from 'react';
import { Language, StylePreset } from '../types';
import { t } from '../utils/translations';
import { GoogleGenAI, Modality } from '@google/genai';
import { PREVIEW_IMAGE } from './ai-image-previews';


interface AIStudioProps {
  onClose: () => void;
  language: Language;
  onImageGenerated: (base64Image: string) => void;
  initialPrompt?: string;
}

const AIStudio: React.FC<AIStudioProps> = ({ onClose, language, onImageGenerated, initialPrompt }) => {
    const [prompt, setPrompt] = useState(initialPrompt || '');
    const [angle, setAngle] = useState('eye-level');
    const [lighting, setLighting] = useState('bright-clean');
    const [background, setBackground] = useState('light-wood');
    const [useOwnEnv, setUseOwnEnv] = useState(false);
    const [ownEnvImages, setOwnEnvImages] = useState<string[]>([]);
    
    const [presets, setPresets] = useState<StylePreset[]>([]);
    const [presetName, setPresetName] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedPresets = localStorage.getItem('blink-ai-presets');
            if (savedPresets) {
                setPresets(JSON.parse(savedPresets));
            }
        } catch (e) {
            console.error("Failed to load presets from localStorage", e);
        }
    }, []);

    const handleSavePreset = () => {
        if (!presetName.trim()) return;
        const newPreset: StylePreset = {
            name: presetName,
            settings: { prompt, angle, lighting, background }
        };
        const updatedPresets = [...presets, newPreset];
        setPresets(updatedPresets);
        localStorage.setItem('blink-ai-presets', JSON.stringify(updatedPresets));
        setPresetName('');
    };

    const handleLoadPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPreset = presets.find(p => p.name === e.target.value);
        if (selectedPreset) {
            const { settings } = selectedPreset;
            setPrompt(settings.prompt);
            setAngle(settings.angle);
            setLighting(settings.lighting);
            setBackground(settings.background);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 4);
            const readers = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });
            Promise.all(readers).then(setOwnEnvImages);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError(language === 'fa' ? 'لطفا نام آیتم غذایی را وارد کنید.' : 'Please enter a food item name.');
            return;
        }
        if (useOwnEnv && ownEnvImages.length === 0) {
            setError(language === 'fa' ? 'لطفا حداقل یک عکس از رستوران خود آپلود کنید.' : 'Please upload at least one photo of your restaurant.');
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedImage(null);

        try {
             if (!process.env.API_KEY) {
                throw new Error("API_KEY environment variable not set.");
             }
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
             
             let imageUrl = '';

             if (useOwnEnv) {
                // In-context generation
                const restaurantImageBase64 = ownEnvImages[0].split(',')[1];
                const mimeType = ownEnvImages[0].substring(ownEnvImages[0].indexOf(':') + 1, ownEnvImages[0].indexOf(';'));
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image-preview',
                    contents: {
                      parts: [
                        { inlineData: { data: restaurantImageBase64, mimeType: mimeType } },
                        { text: `Add a professionally photographed '${prompt}' to this scene. Match the lighting and style.` },
                      ],
                    },
                    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
                });
                
                const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
                if (imagePart?.inlineData) {
                    imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
                } else {
                    throw new Error(language === 'fa' ? 'هوش مصنوعی نتوانست تصویری در محیط ارائه شده ایجاد کند.' : "AI could not generate an image in the provided environment.");
                }

             } else {
                // Standard text-to-image generation
                const fullPrompt = `Professional food photography of ${prompt}. Style: ${t(lighting as any, 'en')}, camera angle: ${t(angle as any, 'en')}, on a ${t(background as any, 'en')} background.`;
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: fullPrompt,
                    config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
                });
                
                if (response.generatedImages?.[0]?.image?.imageBytes) {
                    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                    imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                } else {
                    throw new Error(language === 'fa' ? 'هوش مصنوعی نتوانست از این دستور تصویری تولید کند.' : "AI could not generate an image from the prompt.");
                }
             }
             setGeneratedImage(imageUrl);

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseImage = () => {
        if (generatedImage) {
            onImageGenerated(generatedImage);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={onClose} dir={language === 'fa' ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{t('aiImageStudio', language)}</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto">
                {/* Left Column: Controls */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('foodItemName', language)}</label>
                    <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('cameraAngle', language)}</label>
                      <select value={angle} onChange={e => setAngle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option value="eye-level">{t('eyeLevel', language)}</option>
                        <option value="top-down">{t('topDown', language)}</option>
                        <option value="forty-five-degree">{t('fortyFiveDegree', language)}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('lightingStyle', language)}</label>
                      <select value={lighting} onChange={e => setLighting(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option value="bright-clean">{t('brightAndClean', language)}</option>
                        <option value="moody-dramatic">{t('moodyAndDramatic', language)}</option>
                        <option value="natural-sunlight">{t('naturalSunlight', language)}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('background', language)}</label>
                    <select value={background} onChange={e => setBackground(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" disabled={useOwnEnv}>
                      <option value="light-wood">{t('lightWood', language)}</option>
                      <option value="dark-marble">{t('darkMarble', language)}</option>
                    </select>
                  </div>
                  
                  <div className="border-t pt-4 space-y-3">
                     <div className="flex items-center">
                        <input type="checkbox" id="useOwnEnv" checked={useOwnEnv} onChange={e => setUseOwnEnv(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                        <label htmlFor="useOwnEnv" className="mx-2 block text-sm font-medium text-gray-900">{t('useMyRestaurant', language)}</label>
                    </div>
                    {useOwnEnv && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">{t('uploadPhotos', language)}</label>
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mx-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                             <div className="mt-2 grid grid-cols-4 gap-2">
                                {ownEnvImages.map((src, i) => <img key={i} src={src} className="w-full h-16 object-cover rounded-md" alt={`upload preview ${i+1}`} />)}
                            </div>
                        </div>
                    )}
                  </div>
                  
                   <div className="border-t pt-4 space-y-3">
                     <h3 className="text-lg font-semibold">{t('presets', language)}</h3>
                     <select onChange={handleLoadPreset} className="block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option value="">{t('loadPreset', language)}</option>
                        {presets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                     </select>
                     <div className="flex gap-2">
                        <input type="text" value={presetName} onChange={e => setPresetName(e.target.value)} placeholder={t('presetName', language)} className="block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        <button onClick={handleSavePreset} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 whitespace-nowrap">{t('save', language)}</button>
                     </div>
                  </div>

                </div>
                {/* Right Column: Preview & Result */}
                <div className="flex flex-col gap-4">
                  <div className="flex-grow bg-gray-100 rounded-lg flex items-center justify-center p-4 relative overflow-hidden">
                    {isLoading ? (
                        <div className="text-center">
                            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <p className="mt-2 font-semibold">{t('generating', language)}</p>
                        </div>
                    ) : generatedImage ? (
                        <img src={generatedImage} alt="Generated food item" className="w-full h-full object-contain" />
                    ) : (
                        <div>
                            <img src={PREVIEW_IMAGE} alt="Preview" className="w-full h-full object-contain" />
                            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white bg-black/40 px-2 py-1 rounded-full">{t('preview', language)}</p>
                        </div>
                    )}
                  </div>
                   {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </div>
              </div>
              <div className="p-4 bg-gray-50 flex justify-end gap-3 mt-auto">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300">
                  {t('cancel', language)}
                </button>
                 <button type="button" onClick={handleUseImage} disabled={!generatedImage || isLoading} className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400">
                  {t('useThisImage', language)}
                </button>
                <button type="button" onClick={handleGenerate} disabled={isLoading} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400">
                  {isLoading ? t('generating', language) : t('generateImage', language)}
                </button>
              </div>
          </div>
        </div>
      );
};

export default AIStudio;