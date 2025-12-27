"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export type GuideStep = {
    targetId: string;
    title: string;
    description: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
};

interface UserGuideProps {
    steps: GuideStep[];
    isOpen: boolean;
    onClose: () => void;
    onComplete?: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ steps, isOpen, onClose, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            updateTargetRect();
            window.addEventListener('resize', updateTargetRect);
            window.addEventListener('scroll', updateTargetRect);
        }
        return () => {
            window.removeEventListener('resize', updateTargetRect);
            window.removeEventListener('scroll', updateTargetRect);
        };
    }, [isOpen, currentStep]);

    const updateTargetRect = () => {
        if (!isOpen) return;
        setIsCalculating(true);
        // Small delay to allow for rendering/scrolling
        setTimeout(() => {
            const target = document.getElementById(steps[currentStep].targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTargetRect(target.getBoundingClientRect());
            } else {
                setTargetRect(null);
            }
            setIsCalculating(false);
        }, 100);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
            if (onComplete) onComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (!isOpen) return null;

    const step = steps[currentStep];
    const rect = targetRect;

    // Default positioning logic
    let cardStyle: React.CSSProperties = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    if (rect) {
        // Basic positioning logic - can be enhanced
        const placement = step.placement || 'bottom';
        const offset = 16;

        if (placement === 'bottom') {
            cardStyle = { top: rect.bottom + offset, left: rect.left + rect.width / 2, transform: 'translateX(-50%)' };
        } else if (placement === 'top') {
            cardStyle = { top: rect.top - offset, left: rect.left + rect.width / 2, transform: 'translateX(-50%) translateY(-100%)' };
        } else if (placement === 'left') {
            cardStyle = { top: rect.top + rect.height / 2, left: rect.left - offset, transform: 'translate(-100%, -50%)' };
        } else if (placement === 'right') {
            cardStyle = { top: rect.top + rect.height / 2, left: rect.right + offset, transform: 'translate(0, -50%)' };
        }

        // Boundary checks
        const CARD_WIDTH = 320; // w-80
        const CARD_HEIGHT = 250; // Approx height
        const PADDING = 20;

        // X-Axis Check
        if (cardStyle.left) {
            let leftVal = cardStyle.left as number;

            // If centered (translateX(-50%))
            if (cardStyle.transform?.includes('translateX(-50%)')) {
                if (leftVal - CARD_WIDTH / 2 < PADDING) {
                    cardStyle.left = PADDING + CARD_WIDTH / 2;
                } else if (leftVal + CARD_WIDTH / 2 > window.innerWidth - PADDING) {
                    cardStyle.left = window.innerWidth - PADDING - CARD_WIDTH / 2;
                }
            }
            // If left-aligned (translate(-100%, ...))
            else if (cardStyle.transform?.includes('translate(-100%')) {
                if (leftVal - CARD_WIDTH < PADDING) {
                    cardStyle.left = PADDING + CARD_WIDTH;
                }
            }
            // If right-aligned (translate(0, ...))
            else if (cardStyle.transform?.includes('translate(0')) {
                if (leftVal + CARD_WIDTH > window.innerWidth - PADDING) {
                    cardStyle.left = window.innerWidth - PADDING - CARD_WIDTH;
                }
            }
        }

        if (cardStyle.top && (cardStyle.top as number) < PADDING) cardStyle.top = PADDING;
        // Add more placements if needed

        // Boundary checks (basic)
        if (cardStyle.top && (cardStyle.top as number) < 0) cardStyle.top = 20;
    }

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* Backdrop with SVG mask/clip-path could be used here for a "hole", using simple borders for now or just overlay elements */}
            {/* Using a simpler approach: Dark overlay with a transparent hole (simulated via box-shadow hack or SVG) */}

            {/* Full screen backdrop */}
            <div className="absolute inset-0 bg-black/50 transition-all duration-500" />

            {/* Spotlight Element (High z-index to sit above backdrop, but we actually want to 'cut out' the backdrop) 
                Alternative: Simply highlight the target by giving it a high z-index? 
                Better: Use a massive box-shadow on a transparent div that matches the target's position.
            */}
            {rect && (
                <div
                    className="absolute transition-all duration-500 ease-in-out pointer-events-none rounded-xl border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
                    style={{
                        top: rect.top - 4,
                        left: rect.left - 4,
                        width: rect.width + 8,
                        height: rect.height + 8,
                    }}
                />
            )}

            {/* Guide Card */}
            <div
                className="absolute w-80 bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300"
                style={rect ? cardStyle : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                            {currentStep + 1}
                        </span>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`text-sm font-medium transition ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                        {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
