import React, { useState, useEffect } from 'react';
import { MenuItem, MenuCategory, Language } from '../types';
import { t } from '../utils/translations';
import AITextGenerator from './AITextGenerator';
import AIImageGenerator from './AIImageGenerator';

interface MenuItemFormProps {
    item: MenuItem | null;
    restaurantId: string;
    onClose: () => void;
    onSave: (item: Omit<MenuItem, 'id' | 'restaurantId'>) => void;
    categories: MenuCategory[];
    language: Language;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, restaurantId, onClose, onSave, categories, language }) => {
    const [nameEn, setNameEn] = useState('');
    const [nameFa, setNameFa] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionFa, setDescriptionFa] = useState('');
    const [price, setPrice] = useState(0);
    const [prepTime, setPrepTime] = useState(10);
    const [imageUrl, setImageUrl] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [allergensEn, setAllergensEn] = useState('');
    const [allergensFa, setAllergensFa] = useState('');

    const [isAiTextOpen, setIsAiTextOpen] = useState(false);
    const [aiTextTarget, setAiTextTarget] = useState<'en' | 'fa' | null>(null);
    const [isAiImageOpen, setIsAiImageOpen] = useState(false);

    useEffect(() => {
        if (item) {
            setNameEn(item.name.en);
            setNameFa(item.name.fa);
            setDescriptionEn(item.description.en);
            setDescriptionFa(item.description.fa);
            setPrice(item.price);
            setPrepTime(item.prepTime);
            setImageUrl(item.imageUrl);
            setIsFavorite(item.isFavorite);
            setCategoryId(item.categoryId);
            setAllergensEn(item.allergens.map(a => a.en).join(', '));
            setAllergensFa(item.allergens.map(a => a.fa).join(', '));
        } else {
            // Reset for new item
            setNameEn('');
            setNameFa('');
            setDescriptionEn('');
            setDescriptionFa('');
            setPrice(0);
            setPrepTime(10);
            setImageUrl('');
            setIsFavorite(false);
            setCategoryId(categories.length > 0 ? categories[0].id : '');
            setAllergensEn('');
            setAllergensFa('');
        }
    }, [item, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newItemData = {
            name: { en: nameEn, fa: nameFa },
            description: { en: descriptionEn, fa: descriptionFa },
            price: Number(price),
            prepTime: Number(prepTime),
            imageUrl,
            allergens: allergensEn.split(',').map((en, i) => ({
                en: en.trim(),
                fa: allergensFa.split(',')[i]?.trim() || en.trim()
            })).filter(a => a.en),
            isFavorite,
            categoryId,
        };
        onSave(newItemData);
    };

    const handleOpenAIText = (lang: 'en' | 'fa') => {
        setAiTextTarget(lang);
        setIsAiTextOpen(true);
    };

    const handleGeneratedText = (text: string) => {
        if (aiTextTarget === 'en') {
            setDescriptionEn(text);
        } else if (aiTextTarget === 'fa') {
            setDescriptionFa(text);
        }
    };
    
    const isRtl = language === 'fa';

    return (
        <>
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()} dir={isRtl ? 'rtl' : 'ltr'}>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">{item ? t('editItem', language) : t('addNewItem', language)}</h2>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t('englishName', language)}</label>
                                    <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} className="form-input" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t('persianName', language)}</label>
                                    <input type="text" value={nameFa} onChange={e => setNameFa(e.target.value)} className="form-input" required dir="rtl" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('englishDescription', language)}</label>
                                <div className="relative">
                                    <textarea value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} rows={3} className="form-input pr-24" />
                                    <button type="button" onClick={() => handleOpenAIText('en')} className={`ai-button ${isRtl ? 'left-2' : 'right-2'}`}>{t('generateWithAI', language)}</button>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">{t('persianDescription', language)}</label>
                                 <div className="relative">
                                    <textarea value={descriptionFa} onChange={e => setDescriptionFa(e.target.value)} rows={3} className="form-input pl-24" dir="rtl" />
                                    <button type="button" onClick={() => handleOpenAIText('fa')} className={`ai-button ${isRtl ? 'left-2' : 'right-2'}`}>{t('generateWithAI', language)}</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700">{t('price', language)}</label>
                                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="form-input" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t('preparationTime', language)}</label>
                                    <input type="number" value={prepTime} onChange={e => setPrepTime(Number(e.target.value))} className="form-input" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t('category', language)}</label>
                                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="form-input" required>
                                        <option value="" disabled>Select a category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name[language]}</option>)}
                                    </select>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">{t('imageUrl', language)}</label>
                                <div className="flex gap-2">
                                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="form-input" />
                                    <button type="button" onClick={() => setIsAiImageOpen(true)} className="flex-shrink-0 bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600">{t('generateWithAI', language)}</button>
                                </div>
                                {imageUrl && <img src={imageUrl} alt="preview" className="mt-2 h-24 w-24 object-cover rounded-md"/>}
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t('englishAllergens', language)}</label>
                                    <input type="text" value={allergensEn} onChange={e => setAllergensEn(e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t('persianAllergens', language)}</label>
                                    <input type="text" value={allergensFa} onChange={e => setAllergensFa(e.target.value)} className="form-input" dir="rtl" />
                                </div>
                            </div>
                             <div className="flex items-center">
                                <input type="checkbox" id="isFavorite" checked={isFavorite} onChange={e => setIsFavorite(e.target.checked)} className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                                <label htmlFor="isFavorite" className={`block text-sm text-gray-900 ${isRtl ? 'mr-2' : 'ml-2'}`}>{t('isFavorite', language)}</label>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300">{t('cancel', language)}</button>
                            <button type="submit" className="bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-purple-700">{t('saveChanges', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
            {isAiTextOpen && (
                <AITextGenerator 
                    onClose={() => setIsAiTextOpen(false)} 
                    language={language}
                    onGenerate={handleGeneratedText}
                    context={`Generate a short, appetizing menu description for ${nameEn || nameFa}${aiTextTarget === 'fa' ? ' in Persian' : ''}.`}
                />
            )}
            {isAiImageOpen && (
                 <AIImageGenerator 
                    onClose={() => setIsAiImageOpen(false)} 
                    language={language}
                    onGenerate={setImageUrl}
                    context={`A professional, cinematic food photograph of ${nameEn || nameFa} on a restaurant table.`}
                />
            )}
        </>
    );
};

export default MenuItemForm;
