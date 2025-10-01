import React, { useState } from 'react';
import { Language, StylePreset } from '../types';
import { t } from '../utils/translations';
import { GoogleGenAI, Modality } from '@google/genai';
import { PREVIEW_IMAGE } from './ai-image-previews';

interface AIStudioProps {
    language: Language;
    restaurantId: string;
}

const stylePresets: StylePreset[] = [
    { key: 'top_down_wood', name: {en: 'Top-down Rustic', fa: 'روستیک از بالا'}, previewImage: PREVIEW_IMAGE, prompt: 'A professional food photograph from a top-down angle, on a rustic wood background, with natural lighting.', angle: 'top_down', lighting: 'natural', background: 'wood' },
    { key: '45_degree_marble', name: {en: 'Elegant Marble', fa: 'مرمر شیک'}, previewImage: PREVIEW_IMAGE, prompt: 'A 45-degree angle professional food photograph, on a clean white marble surface, with soft studio lighting.', angle: '45_degree', lighting: 'studio', background: 'marble' },
    { key: 'eye_level_dark', name: {en: 'Dramatic Dark', fa: 'تیره دراماتیک'}, previewImage: PREVIEW_IMAGE, prompt: 'An eye-level professional food photograph on a dark, moody background with dramatic side lighting.', angle: 'eye_level', lighting: 'dramatic', background: 'dark' },
    { key: 'close_up_bright', name: {en: 'Vibrant Close-up', fa: 'کلوزآپ پرانرژی'}, previewImage: PREVIEW_IMAGE, prompt: 'A vibrant, detailed close-up food photograph with bright, even lighting, and a soft-focus background.', angle: 'close_up', lighting: 'soft_bright', background: 'solid_color' }
];

const AIStudio: React.FC<AIStudioProps> = ({ language, restaurantId }) => {
    const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState('');
    const [selectedPreset, setSelectedPreset] = useState<StylePreset>(stylePresets[0]);
    const [sceneDetails, setSceneDetails] = useState('');
    const [copied, setCopied] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
                setGeneratedImage(null); // Clear previous generation
                setGeneratedVideoUrl(null);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleGenerateImage = async () => {
        if (!uploadedImage) {
            setError(t('uploadProductPhotoDesc', language));
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedImage(null);
        setLoadingMessage(t('generating', language));

        try {
            // FIX: API Key must be read from process.env as per guidelines
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `Re-imagine this dish in a new setting based on the following style: ${selectedPreset.prompt}. ${sceneDetails}. Do not add text or logos.`;
            const imagePart = {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: uploadedImage.split(',')[1]
                },
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: [ imagePart, { text: fullPrompt } ] },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
            });

            let imageFound = false;
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                const base64ImageBytes = part.inlineData.data;
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                setGeneratedImage(imageUrl);
                imageFound = true;
                break;
              }
            }
            if (!imageFound) {
                 setError('AI could not generate an image from the prompt. Please try again.');
            }

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateVideo = async () => {
        if (!uploadedImage) {
            setError(t('uploadProductPhotoDesc', language));
            return;
        }
        setIsLoading(true);
        setGeneratedVideoUrl(null);
        setError('');
        
        try {
            // FIX: API Key must be read from process.env as per guidelines
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            setLoadingMessage(t('videoStatus1', language));

            let operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: `A short, cinematic, 10-second video ad for a food dish. ${sceneDetails}`,
                image: {
                    imageBytes: uploadedImage.split(',')[1],
                    mimeType: 'image/jpeg'
                },
                config: { numberOfVideos: 1 }
            });
            
            setLoadingMessage(t('videoStatus2', language));
            
            while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 10000));
              setLoadingMessage(t('videoStatus3', language));
              operation = await ai.operations.getVideosOperation({operation: operation});
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                setGeneratedVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
            } else {
                throw new Error("Video generation completed but no URL was returned.");
            }
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred during video generation.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const copyToClipboard = () => {
        if(generatedImage) {
            navigator.clipboard.writeText(generatedImage);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-4xl font-extrabold mb-2 text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{t('blinkCreativeHub', language)}</h2>
                    <p className="text-gray-200">{t('studioDescription', language)}</p>
                </div>
                <div className="bg-gray-700 p-1 rounded-lg flex items-center">
                    <button onClick={() => setActiveTab('photo')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'photo' ? 'bg-gray-900' : 'hover:bg-gray-800'}`}>{t('photographyStudio', language)}</button>
                    <button onClick={() => setActiveTab('video')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'video' ? 'bg-gray-900' : 'hover:bg-gray-800'}`}>{t('videoStudio', language)}</button>
                </div>
            </div>

            {activeTab === 'photo' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="bg-white/80 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg space-y-6">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{t('uploadProductPhoto', language)}</h3>
                            <p className="text-sm text-gray-600 mb-2">{t('uploadProductPhotoDesc', language)}</p>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"/>
                        </div>
                         <div>
                             <h3 className="font-bold text-lg text-gray-800">{t('stylePreset', language)}</h3>
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                                 {stylePresets.map(preset => (
                                    <button key={preset.key} onClick={() => setSelectedPreset(preset)} className={`p-2 rounded-md border-2 transition-all ${selectedPreset.key === preset.key ? 'border-purple-500 scale-105' : 'border-transparent hover:border-gray-300'}`}>
                                        <img src={preset.previewImage} alt={preset.name[language]} className="w-full h-16 object-cover rounded"/>
                                        <span className="text-xs font-semibold mt-1 block text-gray-700">{preset.name[language]}</span>
                                    </button>
                                 ))}
                             </div>
                         </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{t('sceneDetails', language)}</h3>
                             <input type="text" value={sceneDetails} onChange={e => setSceneDetails(e.target.value)} placeholder={t('sceneDetailsPlaceholder', language)} className="form-input mt-1 w-full"/>
                        </div>

                        <button onClick={handleGenerateImage} disabled={isLoading || !uploadedImage} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100">
                             {isLoading ? loadingMessage : t('generateImage', language)}
                        </button>
                    </div>
                     <div className="bg-white/80 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[400px]">
                        <div className="grid grid-cols-2 gap-4 w-full h-full items-center">
                            <div className="text-center">
                                <h4 className="font-semibold text-gray-700 mb-2">Original</h4>
                                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                    {uploadedImage ? <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" /> : <p className="text-sm text-gray-500">Upload an image</p>}
                                </div>
                            </div>
                             <div className="text-center">
                                <h4 className="font-semibold text-gray-700 mb-2">{t('aiGeneratedImage', language)}</h4>
                                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                                    {isLoading && <div className="animate-pulse bg-gray-300 w-full h-full"></div>}
                                    {!isLoading && generatedImage ? <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" /> : !isLoading && <p className="text-sm text-gray-500">Result will appear here</p>}
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                        {generatedImage && (
                            <button onClick={copyToClipboard} className="mt-4 bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-600 transition-colors w-full">
                                {copied ? t('copied', language) : t('copyUrl', language)}
                            </button>
                        )}
                     </div>
                </div>
            )}
             {activeTab === 'video' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/80 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg space-y-6">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{t('uploadProductPhoto', language)}</h3>
                            <p className="text-sm text-gray-600 mb-2">{t('videoStudioDescription', language)}</p>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"/>
                        </div>
                        <div>
                             <h3 className="font-bold text-lg text-gray-800">{t('sceneDetails', language)}</h3>
                             <textarea value={sceneDetails} onChange={e => setSceneDetails(e.target.value)} rows={3} placeholder={t('textOverlayPlaceholder', language)} className="form-input mt-1 w-full"/>
                        </div>
                         <button onClick={handleGenerateVideo} disabled={isLoading || !uploadedImage} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100">
                             {isLoading ? loadingMessage : t('generate10sVideo', language)}
                        </button>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[400px]">
                        {isLoading && (
                            <div className="text-center">
                                <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                                <p className="mt-4 font-semibold text-gray-700">{loadingMessage || t('generatingVideo', language)}</p>
                            </div>
                        )}
                        {!isLoading && generatedVideoUrl && (
                             <div className="w-full">
                                <video src={generatedVideoUrl} controls autoPlay loop className="w-full rounded-lg"></video>
                                <a href={generatedVideoUrl} download="blink-ai-video.mp4" className="block text-center mt-4 bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-600 transition-colors w-full">
                                    {t('downloadVideo', language)}
                                </a>
                             </div>
                        )}
                         {!isLoading && !generatedVideoUrl && (
                             <div className="text-center text-gray-600">
                                 <h4 className="font-bold text-lg">{t('videoGuideTitle', language)}</h4>
                                 <p className="text-sm mt-2">{t('videoGuideDesc', language)}</p>
                             </div>
                         )}
                         {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIStudio;
