import { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { XIcon } from 'lucide-react';

import Button from '../Button';

function TrailerModal({ url, onClose }) {

    const modalRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.focus();
        }
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm 
            transition-all duration-300"
            onClick={onClose}
            tabIndex={-1}
            ref={modalRef}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="animate-fadeIn relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                rounded-2xl shadow-2xl pt-3 pb-6 px-6 md:pt-4 md:pb-8 md:px-8 scale-95 md:scale-100 transition-transform 
                duration-300 min-w-[400px] max-w-[98vw] w-[900px] max-h-[95vh] flex flex-col items-center justify-center"
            >
                
                <div className="flex items-center justify-between w-full mb-2">
                    <p className="text-xl md:text-2xl font-medium">Trailer</p>
                    <Button
                        onClick={onClose}
                        className="hover:scale-110 p-2"
                    >
                        <XIcon className="w-6 h-6" />
                    </Button>
                </div>

                <div className="w-full max-w-[900px] aspect-video bg-black flex items-center justify-center 
                rounded-xl overflow-hidden shadow-lg mx-auto">
                    <ReactPlayer
                        src={url}
                        controls
                        playing
                        width="100%" height="100%"
                        className="bg-black"
                    />
                </div>

            </div>

            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95);}
                    to { opacity: 1; transform: scale(1);}
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s cubic-bezier(0.4,0,0.2,1);
                }
            `}</style>
        </div>
    );
}

export default TrailerModal;