import { useEffect } from 'react';

export default function useDialog(ref, onClose) {
    useEffect(() => {
        const previous = document.activeElement;
        const node = ref.current;
        const focusable = () => [...node.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select, textarea, [tabindex="0"]')];
        (node.querySelector('input') || focusable()[0])?.focus();
        const keydown = event => {
            if (event.key === 'Escape') onClose();
            if (event.key !== 'Tab') return;
            const items = focusable();
            if (!items.length) return;
            if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
            else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
        };
        node.addEventListener('keydown', keydown);
        return () => { node.removeEventListener('keydown', keydown); previous?.focus(); };
    }, [ref, onClose]);
}
