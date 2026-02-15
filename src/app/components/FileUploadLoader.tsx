"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";

interface FileUploadLoaderProps {
  isVisible: boolean;
  title?: string;
  fileName: string;
  totalSizeMB?: number;
  onClose: () => void;
  onComplete?: () => void;
  isSuccessManuallyControlled?: boolean;
  isSuccess?: boolean;
}

export const FileUploadLoader: React.FC<FileUploadLoaderProps> = ({
  isVisible,
  title = "Uploading File...",
  fileName,
  totalSizeMB = 52.4,
  onClose,
  onComplete,
  isSuccessManuallyControlled = false,
  isSuccess = false,
}) => {
  const [currentSize, setCurrentSize] = useState(0);
  const [percent, setPercent] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      setCurrentSize(0);
      setPercent(0);
      setShowSuccess(false);

      const interval = setInterval(() => {
        setCurrentSize((prev) => {
          const next = prev + Math.random() * 2.5;
          if (next >= totalSizeMB) {
            clearInterval(interval);
            return totalSizeMB;
          }
          return next;
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      // Small delay before unmounting to allow for exit animations if any
      const timeout = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, totalSizeMB]);

  useEffect(() => {
    const p = (currentSize / totalSizeMB) * 100;
    setPercent(Math.floor(p));

    if (currentSize >= totalSizeMB && !isSuccessManuallyControlled) {
      setTimeout(() => {
        setShowSuccess(true);
        if (onComplete) onComplete();
      }, 500);
    }
  }, [currentSize, totalSizeMB, isSuccessManuallyControlled, onComplete]);

  useEffect(() => {
    if (isSuccessManuallyControlled && isSuccess) {
      setPercent(100);
      setCurrentSize(totalSizeMB);
      setShowSuccess(true);
      if (onComplete) onComplete();
    }
  }, [isSuccess, isSuccessManuallyControlled, onComplete, totalSizeMB]);

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white w-[450px] p-8 rounded-2xl shadow-2xl text-center transform transition-all duration-300 relative ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {showSuccess && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div id="uploadHeader">
          {showSuccess ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Complete!
              </h3>
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 mb-6 truncate px-4">
                {fileName}
              </p>
            </>
          )}
        </div>

        {!showSuccess && (
          <div id="uploadBody" className="animate-in fade-in duration-300">
            <div className="w-full h-3.5 bg-gray-100 rounded-full relative overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-400 ease-out relative"
                style={{ width: `${percent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
            </div>

            <div className="flex justify-between text-sm font-semibold text-gray-600 mb-8">
              <span>{percent}%</span>
              <span>
                {totalSizeMB > 0.1
                  ? `${currentSize.toFixed(1)} MB / ${totalSizeMB.toFixed(1)} MB`
                  : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};
