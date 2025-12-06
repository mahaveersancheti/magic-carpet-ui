'use client';
import { Toaster, useToasterStore, toast } from 'react-hot-toast';
import { useEffect } from 'react';

const ToasterProvider = () => {
    const { toasts } = useToasterStore();

    useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= 1) // Only allow 1 visible
            .forEach((t) => toast.dismiss(t.id));
    }, [toasts]);

    return <Toaster />;
}

export default ToasterProvider;
