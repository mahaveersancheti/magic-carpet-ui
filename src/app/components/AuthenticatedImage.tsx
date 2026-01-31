"use client";

import React, { useEffect, useState } from 'react';
import { api } from '../services/apiService';
import { Loader2 } from 'lucide-react';

interface AuthenticatedImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
}

export const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({ src, alt, className, placeholder = '/Image-not-found.png' }) => {
    const [imageSrc, setImageSrc] = useState<string>(placeholder);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let objectUrl: string | null = null;

        const fetchImage = async () => {
            if (!src || src === placeholder) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // We use axios directly via our api helper but we need blob response
                // Since apiService.ts 'get' returns T, we might need a custom call if it doesn't support blob easily
                // or we can use the download method and adapt it.
                // Actually, let's use the api.get but we might need to cast or adjust.

                const response = await fetch(src, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.status === 404) {
                    setImageSrc(placeholder);
                    setLoading(false);
                    return;
                }

                if (!response.ok) throw new Error('Failed to fetch image');

                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);
                setImageSrc(objectUrl);
            } catch (error) {
                console.error('Error loading authenticated image:', error);
                setImageSrc(placeholder);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src, placeholder]);

    if (loading) {
        return (
            <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            onError={() => setImageSrc(placeholder)}
        />
    );
};
