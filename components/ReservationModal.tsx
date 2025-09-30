import React, { useState } from 'react';
import { Language, Reservation } from '../types';
import { t } from '../utils/translations';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    // FIX: Changed onSubmit prop type to match the object being passed. `restaurantId` is not available here.
    onSubmit: (reservation: Omit<Reservation, 'id' | 'restaurantId'>) => void;
    language: Language;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, onSubmit, language }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [guests, setGuests] = useState(2);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('19:00');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            alert(language === 'fa' ? 'لطفاً نام و شماره تلفن را وارد کنید.' : 'Please enter your name and phone number.');
            return;
        }
        onSubmit({ name, phone, guests, date, time });
    };

    if (!isOpen) return null;
    const isRtl = language === 'fa';

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={onClose}
        >
          <div 
            className="bg-white rounded-lg overflow-hidden shadow-2xl max-w-md w-full m-4"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t('reserveTable', language)}</h2>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('yourName', language)}</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('phoneNumber', language)}</label>
                        <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">{t('numberOfGuests', language)}</label>
                            <input type="number" id="guests" value={guests} onChange={e => setGuests(parseInt(e.target.value, 10))} min="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">{t('selectDate', language)}</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">{t('selectTime', language)}</label>
                            <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end">
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105">
                        {t('confirmReservation', language)}
                    </button>
                </div>
            </form>
          </div>
        </div>
    );
};

export default ReservationModal;