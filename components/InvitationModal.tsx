import React from 'react';
import { Language, GameInvite } from '../types';
import { t } from '../utils/translations';

interface InvitationModalProps {
    invite: GameInvite;
    onAccept: () => void;
    onDecline: () => void;
    language: Language;
}

const InvitationModal: React.FC<InvitationModalProps> = ({ invite, onAccept, onDecline, language }) => {

    return (
        <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex justify-center items-end sm:items-center p-4">
            <div className="bg-white border-t-4 border-purple-500 rounded-lg shadow-2xl p-6 text-gray-800 max-w-sm w-full animate-slide-up">
                <div className="text-center">
                    <h3 className="font-bold text-lg">{t('invitationFrom', language)}</h3>
                    <p className="text-2xl font-semibold my-2 text-purple-700">{invite.from.name}</p>
                    <p className="text-gray-600">{t('wantsToPlay', language)}</p>
                    <p className="text-sm text-gray-500 mt-2">({t('esmFamil_setTimer', language)}: {invite.settings.timer}{t('esmFamil_seconds', language)})</p>
                </div>
                <div className="flex gap-4 mt-6">
                    <button onClick={onDecline} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full">
                        {t('decline', language)}
                    </button>
                     <button onClick={onAccept} className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">
                        {t('accept', language)}
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default InvitationModal;