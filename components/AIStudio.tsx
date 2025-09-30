import React, { useState, useRef, useEffect } from 'react';
import { Language, StylePreset, TranslatableString } from '../types';
import { t } from '../utils/translations';
import { GoogleGenAI, GenerateContentResponse, Modality, Part, Operation } from '@google/genai';
import { PREVIEW_IMAGE } from './ai-image-previews';

// --- Helper Functions ---
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

const imageToPart = async (file: File): Promise<Part> => {
    const base64Data = await fileToBase64(file);
    return {
        inlineData: {
            mimeType: file.type,
            data: base64Data,
        },
    };
};

// --- Data Definitions ---
const stylePresets: StylePreset[] = [
    { key: 'vibrant', name: { en: 'Vibrant & Bright', fa: 'شاد و روشن' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/vibrant-and-bright.jpg', prompt: 'vibrant, bright, clean, high-key lighting, fresh ingredients visible', angle: 'angle_45_degree', lighting: 'lighting_soft_bright', background: 'background_solid_color' },
    { key: 'moody', name: { en: 'Dark & Moody', fa: 'تیره و دراماتیک' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/dark-and-moody.jpg', prompt: 'dark, moody, dramatic lighting, rustic, cinematic', angle: 'angle_top_down', lighting: 'lighting_dramatic', background: 'background_wood' },
    { key: 'minimalist', name: { en: 'Minimalist & Modern', fa: 'مینیمال و مدرن' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/minimalist-and-modern.jpg', prompt: 'minimalist, modern, clean, geometric composition, ample negative space', angle: 'angle_eye_level', lighting: 'lighting_natural', background: 'background_solid_color' },
    { key: 'cozy', name: { en: 'Cozy & Rustic', fa: 'دنج و روستیک' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/cozy-and-rustic.jpg', prompt: 'cozy, rustic, warm tones, natural light, home-style', angle: 'angle_45_degree', lighting: 'lighting_natural', background: 'background_wood' },
    { key: 'gourmet', name: { en: 'Gourmet Magazine', fa: 'مجله آشپزی' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/gourmet-magazine.jpg', prompt: 'elegant, sophisticated, professional food magazine style, perfectly styled', angle: 'angle_eye_level', lighting: 'lighting_studio', background: 'background_marble' },
    { key: 'street', name: { en: 'Street Food', fa: 'غذای خیابانی' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/street-food.jpg', prompt: 'dynamic, action shot, slightly messy, authentic street food vibe', angle: 'angle_close_up', lighting: 'lighting_natural', background: 'background_urban' },
    { key: 'pastel', name: { en: 'Pastel Dreams', fa: 'رویای پاستلی' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/pastel-dreams.jpg', prompt: 'soft pastel colors, dreamy, whimsical, light and airy', angle: 'angle_top_down', lighting: 'lighting_soft_bright', background: 'background_solid_color' },
    { key: 'cinematic', name: { en: 'Cinematic', fa: 'سینمایی' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/cinematic.jpg', prompt: 'widescreen, cinematic color grading, epic feel, lens flare', angle: 'angle_eye_level', lighting: 'lighting_dramatic', background: 'background_dark' },
    { key: 'healthy', name: { en: 'Healthy & Fresh', fa: 'سالم و تازه' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/healthy-and-fresh.jpg', prompt: 'fresh ingredients, green tones, healthy, clean eating aesthetic', angle: 'angle_top_down', lighting: 'lighting_natural', background: 'background_wood' },
    { key: 'vintage', name: { en: 'Vintage Diner', fa: 'کافه قدیمی' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/vintage-diner.jpg', prompt: 'retro, 1950s diner style, checkered patterns, nostalgic', angle: 'angle_45_degree', lighting: 'lighting_studio', background: 'background_urban' },
    { key: 'luxury', name: { en: 'Luxury Fine Dining', fa: 'شام لوکس' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/luxury-fine-dining.jpg', prompt: 'luxurious, fine dining, elegant plating, rich textures, sophisticated', angle: 'angle_eye_level', lighting: 'lighting_dramatic', background: 'background_dark' },
    { key: 'picnic', name: { en: 'Summer Picnic', fa: 'پیک‌نیک تابستانی' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/summer-picnic.jpg', prompt: 'bright sunlight, outdoor picnic setting, checkered blanket, fresh', angle: 'angle_top_down', lighting: 'lighting_natural', background: 'background_grass' },
    { key: 'popart', name: { en: 'Pop Art', fa: 'پاپ آرت' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/pop-art.jpg', prompt: 'bold colors, pop art style, graphic, high contrast', angle: 'angle_eye_level', lighting: 'lighting_studio', background: 'background_solid_color' },
    { key: 'farm', name: { en: 'Farm to Table', fa: 'مزرعه تا میز' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/farm-to-table.jpg', prompt: 'fresh, organic, farm-to-table aesthetic, natural elements', angle: 'angle_45_degree', lighting: 'lighting_natural', background: 'background_wood' },
    { key: 'bw', name: { en: 'Black & White', fa: 'سیاه و سفید' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/black-and-white.jpg', prompt: 'monochrome, black and white, focus on texture and form, artistic', angle: 'angle_close_up', lighting: 'lighting_dramatic', background: 'background_dark' },
    { key: 'cyberpunk', name: { en: 'Cyberpunk Neon', fa: 'نئون سایبرپانک' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/cyberpunk-neon.jpg', prompt: 'neon lights, cyberpunk aesthetic, futuristic, glowing', angle: 'angle_eye_level', lighting: 'lighting_dramatic', background: 'background_urban' },
    { key: 'watercolor', name: { en: 'Watercolor Painting', fa: 'نقاشی آبرنگ' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/watercolor-painting.jpg', prompt: 'styled like a watercolor painting, soft edges, artistic', angle: 'angle_45_degree', lighting: 'lighting_soft_bright', background: 'background_solid_color' },
    { key: 'macro', name: { en: 'Macro Focus', fa: 'فوکوس ماکرو' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/macro-focus.jpg', prompt: 'extreme close-up, macro photography, shallow depth of field, detailed texture', angle: 'angle_close_up', lighting: 'lighting_natural', background: 'background_dark' },
    { key: 'holiday', name: { en: 'Holiday Feast', fa: 'ضیافت تعطیلات' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/holiday-feast.jpg', prompt: 'festive, holiday theme, warm and inviting, celebratory', angle: 'angle_top_down', lighting: 'lighting_soft_bright', background: 'background_dark' },
    { key: 'product', name: { en: 'Product on White', fa: 'محصول روی سفید' }, previewImage: 'https://storage.googleapis.com/maker-suite-media/short-prompts/product-on-white.jpg', prompt: 'clean product shot, on a pure white background, e-commerce style', angle: 'angle_eye_level', lighting: 'lighting_studio', background: 'background_solid_color' },
];

const photoOptions = {
    angles: [ { key: 'angle_top_down', translationKey: 'angle_top_down' }, { key: 'angle_45_degree', translationKey: 'angle_45_degree' }, { key: 'angle_eye_level', translationKey: 'angle_eye_level' }, { key: 'angle_close_up', translationKey: 'angle_close_up' } ],
    lightings: [ { key: 'lighting_natural', translationKey: 'lighting_natural' }, { key: 'lighting_studio', translationKey: 'lighting_studio' }, { key: 'lighting_dramatic', translationKey: 'lighting_dramatic' }, { key: 'lighting_soft_bright', translationKey: 'lighting_soft_bright' } ],
    backgrounds: [ { key: 'background_wood', translationKey: 'background_wood' }, { key: 'background_marble', translationKey: 'background_marble' }, { key: 'background_solid_color', translationKey: 'background_solid_color' }, { key: 'background_dark', translationKey: 'background_dark' }, { key: 'background_urban', translationKey: 'background_urban' }, { key: 'background_grass', translationKey: 'background_grass' } ],
};

const videoOptions = {
    purposes: [{ key: 'purpose_new_product', translationKey: 'purpose_new_product' }, { key: 'purpose_special_offer', translationKey: 'purpose_special_offer' }, { key: 'purpose_best_seller', translationKey: 'purpose_best_seller' }],
    styles: [
        { key: 'video_style_energetic', translationKey: 'video_style_energetic', preview: 'https://storage.googleapis.com/maker-suite-media/veo-demos/veo-style-energetic.mp4' },
        { key: 'video_style_elegant', translationKey: 'video_style_elegant', preview: 'https://storage.googleapis.com/maker-suite-media/veo-demos/veo-style-elegant.mp4' },
        { key: 'video_style_minimalist', translationKey: 'video_style_minimalist', preview: 'https://storage.googleapis.com/maker-suite-media/veo-demos/veo-style-minimalist.mp4' },
        { key: 'video_style_cinematic', translationKey: 'video_style_cinematic', preview: 'https://storage.googleapis.com/maker-suite-media/veo-demos/veo-style-cinematic.mp4' },
    ],
    motions: [{ key: 'motion_orbit', translationKey: 'motion_orbit' }, { key: 'motion_zoom_in', translationKey: 'motion_zoom_in' }, { key: 'motion_slow_pan', translationKey: 'motion_slow_pan' }, { key: 'motion_dolly', translationKey: 'motion_dolly' }],
};

const LoadingSpinner = () => (
    <div className="text-white text-center">
        <svg className="animate-spin h-10 w-10 text-white mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        {t('generating', 'en')}
    </div>
);

// --- Main Component ---
interface AIStudioProps {
  language: Language;
}

const AIStudio: React.FC<AIStudioProps> = ({ language }) => {
    const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');

    return (
        <div>
             <h2 className="text-4xl font-extrabold mb-2 text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{t('blinkCreativeHub', language)}</h2>
             <p className="text-gray-200 mb-6">{t('studioDescription', language)}</p>

            <div className="border-b border-white/20 mb-6">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('photo')} className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm ${activeTab === 'photo' ? 'border-purple-400 text-white' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'}`}>
                        {t('photographyStudio', language)}
                    </button>
                    <button onClick={() => setActiveTab('video')} className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm ${activeTab === 'video' ? 'border-purple-400 text-white' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'}`}>
                        {t('videoStudio', language)}
                    </button>
                </nav>
            </div>

            {activeTab === 'photo' && <PhotographyStudio language={language} />}
            {activeTab === 'video' && <VideoStudio language={language} />}
        </div>
    );
};

const GuidePoint: React.FC<{ titleKey: string, descKey: string, lang: Language }> = ({ titleKey, descKey, lang }) => (
    <div>
        <h4 className="font-bold text-purple-200">{t(titleKey, lang)}</h4>
        <p className="text-gray-300 text-sm">{t(descKey, lang)}</p>
    </div>
);

const PhotographyStudio: React.FC<{ language: Language }> = ({ language }) => {
    const [productImage, setProductImage] = useState<File | null>(null);
    const [environmentImages, setEnvironmentImages] = useState<File[]>([]);
    const [mode, setMode] = useState<'studio' | 'context'>('studio');
    
    const [activePreset, setActivePreset] = useState<StylePreset>(stylePresets[0]);
    const [angle, setAngle] = useState(stylePresets[0].angle);
    const [lighting, setLighting] = useState(stylePresets[0].lighting);
    const [background, setBackground] = useState(stylePresets[0].background);
    const [sceneDetails, setSceneDetails] = useState('');

    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [stylePreview, setStylePreview] = useState<string>(stylePresets[0].previewImage);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    
    const productInputRef = useRef<HTMLInputElement>(null);
    const envInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setAngle(activePreset.angle);
        setLighting(activePreset.lighting);
        setBackground(activePreset.background);
        setStylePreview(activePreset.previewImage);
    }, [activePreset]);
    
    const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProductImage(e.target.files[0]);
        }
    };
    
    const handleEnvImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 10);
            setEnvironmentImages(files);
        }
    };
    
    const constructPrompt = (): string => {
        const presetPrompt = activePreset.prompt;
        return `Recreate the food item from the uploaded photo in a new, highly realistic, professional food photography shot.
        Style: ${presetPrompt}.
        Angle: ${angle.replace('angle_','').replace('_',' ')}.
        Lighting: ${lighting.replace('lighting_','').replace('_',' ')}.
        Background: ${background.replace('background_','').replace('_',' ')}.
        Details: ${sceneDetails || 'None'}.
        The final image should be a photorealistic masterpiece.`;
    };

    const handleGenerateImage = async () => {
        if (!productImage) {
            setError(language === 'fa' ? 'لطفا ابتدا عکس محصول را آپلود کنید.' : 'Please upload a product photo first.');
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedImage(null);

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY environment variable not set.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const parts: Part[] = [await imageToPart(productImage)];
            let promptText = '';

            if (mode === 'studio') {
                promptText = constructPrompt();
                parts.push({ text: promptText });
            } else { // context mode
                if (environmentImages.length === 0) {
                     setError(language === 'fa' ? 'لطفا حداقل یک عکس از محیط آپلود کنید.' : 'Please upload at least one environment photo.');
                     setIsLoading(false);
                     return;
                }
                for(const img of environmentImages) parts.push(await imageToPart(img));
                promptText = `Take the food item from the first image and realistically place it into the environment shown in the subsequent images. Match the lighting, shadows, and perspective perfectly.`;
                parts.push({ text: promptText });
            }

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: parts },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
            });
            
            const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
            if (imagePart && imagePart.inlineData) {
                const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
                setGeneratedImage(imageUrl);
            } else {
                throw new Error('No image was generated by the model.');
            }

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
     const handleCopyToClipboard = () => {
        if (generatedImage) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg space-y-5 self-start h-full">
                <div className="text-center p-4 border-2 border-dashed border-gray-400 rounded-lg">
                    <h3 className="font-bold text-white">{t('uploadProductPhoto', language)}</h3>
                    <p className="text-sm text-gray-300 mb-2">{t('uploadProductPhotoDesc', language)}</p>
                    <button onClick={() => productInputRef.current?.click()} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">{productImage ? productImage.name : 'Select Image'}</button>
                    <input type="file" ref={productInputRef} onChange={handleProductImageChange} accept="image/*" className="hidden"/>
                </div>
                
                <div className="flex bg-black/20 rounded-lg p-1">
                    <button onClick={() => setMode('studio')} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors ${mode === 'studio' ? 'bg-purple-600 text-white' : 'text-gray-200'}`}>{t('studioShotMode', language)}</button>
                    <button onClick={() => setMode('context')} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors ${mode === 'context' ? 'bg-purple-600 text-white' : 'text-gray-200'}`}>{t('inContextMode', language)}</button>
                </div>

                <div className={`space-y-4 ${!productImage ? 'opacity-50 pointer-events-none' : ''}`}>
                     {mode === 'studio' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-white mb-2">{t('stylePreset', language)}</label>
                                <div className="flex overflow-x-auto space-x-3 pb-2 -mx-6 px-6">
                                    {stylePresets.map(preset => (
                                        <button 
                                            key={preset.key} 
                                            onClick={() => setActivePreset(preset)} 
                                            className={`flex-shrink-0 w-24 text-center group transition-all duration-200 ${activePreset.key === preset.key ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} 
                                            title={preset.name[language]}
                                        >
                                            <div className={`aspect-square rounded-lg transition-all border-2 overflow-hidden ${activePreset.key === preset.key ? 'border-purple-500 ring-2 ring-purple-500' : 'border-transparent group-hover:border-gray-400'}`}>
                                                <img 
                                                    src={preset.previewImage} 
                                                    alt={preset.name[language]} 
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <span className={`block mt-1 text-xs text-white truncate transition-colors ${activePreset.key === preset.key ? 'font-semibold text-purple-300' : 'text-gray-300'}`}>
                                                {preset.name[language]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div className="grid grid-cols-3 gap-3">
                                 <div>
                                     <label className="block text-sm font-medium text-gray-300">{t('angle', language)}</label>
                                     <select value={angle} onChange={e => setAngle(e.target.value)} className="mt-1 w-full p-2 bg-white/80 border-gray-300 rounded-md text-gray-800">
                                         {photoOptions.angles.map(o => <option key={o.key} value={o.key}>{t(o.translationKey, language)}</option>)}
                                     </select>
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium text-gray-300">{t('lighting', language)}</label>
                                     <select value={lighting} onChange={e => setLighting(e.target.value)} className="mt-1 w-full p-2 bg-white/80 border-gray-300 rounded-md text-gray-800">
                                         {photoOptions.lightings.map(o => <option key={o.key} value={o.key}>{t(o.translationKey, language)}</option>)}
                                     </select>
                                 </div>
                                  <div>
                                     <label className="block text-sm font-medium text-gray-300">{t('background', language)}</label>
                                     <select value={background} onChange={e => setBackground(e.target.value)} className="mt-1 w-full p-2 bg-white/80 border-gray-300 rounded-md text-gray-800">
                                         {photoOptions.backgrounds.map(o => <option key={o.key} value={o.key}>{t(o.translationKey, language)}</option>)}
                                     </select>
                                 </div>
                             </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">{t('sceneDetails', language)}</label>
                                <input type="text" value={sceneDetails} onChange={e => setSceneDetails(e.target.value)} placeholder={t('sceneDetailsPlaceholder', language)} className="mt-1 w-full p-2 bg-white/80 border-gray-300 rounded-md text-gray-800"/>
                            </div>
                        </div>
                     ) : (
                        <div className="text-center p-4 border-2 border-dashed border-gray-400 rounded-lg">
                            <h3 className="font-bold text-white">{t('uploadEnvironmentPhotos', language)}</h3>
                            <p className="text-sm text-gray-300 mb-2">{t('uploadEnvironmentPhotosDesc', language)}</p>
                            <button onClick={() => envInputRef.current?.click()} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">{environmentImages.length > 0 ? `${environmentImages.length} images selected` : 'Select Images'}</button>
                            <input type="file" ref={envInputRef} onChange={handleEnvImageChange} accept="image/*" multiple className="hidden"/>
                        </div>
                     )}
                     <button onClick={handleGenerateImage} disabled={isLoading || !productImage} className="w-full btn-animated-gradient bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-5 rounded-lg text-lg disabled:opacity-50">
                         {t('generateImage', language)}
                     </button>
                </div>
                <div className="mt-auto bg-black/20 p-4 rounded-lg space-y-2 border border-white/10">
                    <h3 className="font-bold text-white text-lg">{t('photographyGuideTitle', language)}</h3>
                    <GuidePoint titleKey="guideBeSpecific" descKey="guideBeSpecificDesc" lang={language} />
                    <GuidePoint titleKey="guideSetTheScene" descKey="guideSetTheSceneDesc" lang={language} />
                </div>
            </div>
            
            <div className="lg:col-span-3">
                 <div className="aspect-square bg-black/30 rounded-lg shadow-2xl flex items-center justify-center p-4 sticky top-24">
                    {isLoading && <LoadingSpinner />}
                    {!isLoading && generatedImage && (
                        <div className="relative group w-full h-full">
                            <img src={generatedImage} alt={t('aiGeneratedImage', language)} className="rounded-md w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={handleCopyToClipboard} className="bg-white/80 text-black font-semibold py-2 px-4 rounded-full">{copied ? t('copied', language) : t('copyUrl', language)}</button>
                            </div>
                        </div>
                    )}
                    {!isLoading && !generatedImage && (
                        <img src={stylePreview || PREVIEW_IMAGE} alt="Style Preview" className="rounded-md w-full h-full object-cover"/>
                    )}
                 </div>
                 {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

const VideoStudio: React.FC<{ language: Language }> = ({ language }) => {
    const [productImage, setProductImage] = useState<File | null>(null);
    const [videoPurpose, setVideoPurpose] = useState(videoOptions.purposes[0].key);
    const [videoStyle, setVideoStyle] = useState(videoOptions.styles[0].key);
    const [cameraMotion, setCameraMotion] = useState(videoOptions.motions[0].key);
    const [textOverlay, setTextOverlay] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string>(videoOptions.styles[0].preview);
    const productInputRef = useRef<HTMLInputElement>(null);

    const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProductImage(e.target.files[0]);
            setVideoUrl(null);
            setError('');
        }
    };
    
    const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStyleKey = e.target.value;
        setVideoStyle(newStyleKey);
        const newStyle = videoOptions.styles.find(s => s.key === newStyleKey);
        if(newStyle) setVideoPreview(newStyle.preview);
    };

    const constructVideoPrompt = () => {
        return `Create a dynamic 10-second video teaser for a food product. Product Image: [Provided as input]. Purpose: ${videoPurpose}. Visual Style: ${videoStyle}. Camera Motion: ${cameraMotion}. Text Overlay: "${textOverlay}". The video should be high-energy, appetizing, and professional.`;
    };

    const handleGenerateVideo = async () => {
        if (!productImage) {
            setError(language === 'fa' ? 'لطفا ابتدا عکس محصول را آپلود کنید.' : 'Please upload a product photo first.');
            return;
        }
        setIsLoading(true);
        setError('');
        setVideoUrl(null);
        const messages = [t('videoStatus1', language), t('videoStatus2', language), t('videoStatus3', language)];
        let messageIndex = 0;
        setStatusMessage(messages[messageIndex]);
        const interval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            setStatusMessage(messages[messageIndex]);
        }, 5000);

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY environment variable not set.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = constructVideoPrompt();
            const imageBase64 = await fileToBase64(productImage);

            let operation: Operation<any> = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001', prompt,
                image: { imageBytes: imageBase64, mimeType: productImage.type },
                config: { numberOfVideos: 1 }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }
            
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                 const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                 const blob = await response.blob();
                 const objectUrl = URL.createObjectURL(blob);
                 setVideoUrl(objectUrl);
            } else {
                throw new Error("Video generation completed, but no download link was provided.");
            }

        } catch (e) {
             console.error(e);
             setError(e instanceof Error ? e.message : 'An unknown error occurred during video generation.');
        } finally {
            setIsLoading(false);
            clearInterval(interval);
            setStatusMessage('');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg space-y-6 self-start h-full">
                <div className="text-center p-4 border-2 border-dashed border-gray-400 rounded-lg">
                    <h3 className="font-bold text-white">{t('uploadProductPhoto', language)}</h3>
                    <p className="text-sm text-gray-300 mb-2">{t('videoStudioDescription', language)}</p>
                    <button onClick={() => productInputRef.current?.click()} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">{productImage ? productImage.name : 'Select Image'}</button>
                    <input type="file" ref={productInputRef} onChange={handleProductImageChange} accept="image/*" className="hidden"/>
                </div>
                 <div className={`space-y-4 ${!productImage ? 'opacity-50 pointer-events-none' : ''}`}>
                     <div>
                         <label className="block text-sm font-medium text-gray-300">{t('videoPurpose', language)}</label>
                         <select value={videoPurpose} onChange={e => setVideoPurpose(e.target.value)} className="mt-1 w-full p-2 bg-white/80 border-gray-300 rounded-md text-gray-800">
                            {videoOptions.purposes.map(o => <option key={o.key} value={o.key}>{t(o.translationKey, language)}</option>)}
                         </select>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-300">{t('videoStyle', language)}</label>
                         <select value={videoStyle} onChange={handleStyleChange} className="mt-1 w-full p-2 bg-white/80 border-gray-300 rounded-md text-gray-800">
                            {videoOptions.styles.map(o => <option key={o.key} value={o.key}>{t(o.translationKey, language)}</option>)}
                         </select>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-300">{t('cameraMotion', language)}</label>
                         <select value={cameraMotion} onChange={e => setCameraMotion(e.target.value)} className="mt-1 w-full p-2 bg-white/80 border-gray-300 rounded-md text-gray-800">
                             {videoOptions.motions.map(o => <option key={o.key} value={o.key}>{t(o.translationKey, language)}</option>)}
                         </select>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-300">{t('textOverlay', language)}</label>
                         <input type="text" value={textOverlay} onChange={e => setTextOverlay(e.target.value)} placeholder={t('textOverlayPlaceholder', language)} className="mt-1 w-full p-2 bg-white/80 border-gray-300 rounded-md text-gray-800"/>
                     </div>
                     <button onClick={handleGenerateVideo} disabled={isLoading || !productImage} className="w-full btn-animated-gradient bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-5 rounded-lg text-lg disabled:opacity-50">
                         {t('generate10sVideo', language)}
                     </button>
                 </div>
                 <div className="mt-auto bg-black/20 p-4 rounded-lg space-y-2 border border-white/10">
                    <h3 className="font-bold text-white text-lg">{t('videoGuideTitle', language)}</h3>
                    <p className="text-gray-300 text-sm">{t('videoGuideDesc', language)}</p>
                </div>
            </div>
             <div className="lg:col-span-3">
                <div className="aspect-video bg-black/30 rounded-lg shadow-2xl flex items-center justify-center p-4 sticky top-24">
                    {isLoading && (
                        <div className="text-white text-center">
                            <LoadingSpinner />
                            <p className="mt-2">{statusMessage || t('generatingVideo', language)}</p>
                        </div>
                    )}
                    {!isLoading && videoUrl && (
                        <video src={videoUrl} controls autoPlay loop className="w-full h-full rounded-md" />
                    )}
                     {!isLoading && !videoUrl && videoPreview && (
                        <video src={videoPreview} key={videoPreview} autoPlay loop muted playsInline className="w-full h-full rounded-md object-cover" />
                    )}
                </div>
                {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg mt-4 text-center">{error}</p>}
                {!isLoading && videoUrl && (
                    <div className="text-center mt-4">
                        <a href={videoUrl} download="blink-ai-video.mp4" className="inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">{t('downloadVideo', language)}</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIStudio;