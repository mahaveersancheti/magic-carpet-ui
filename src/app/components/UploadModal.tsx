import { useState } from "react";

export const UploadModal = ({
    isOpen,
    onClose,
    onUpload,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
  }) => {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    
  
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFile(e.dataTransfer.files[0]);
      }
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleSubmit = () => {
      if (file) {
        onUpload(file);
        setFile(null);
        onClose();
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
  
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-4">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Upload Document
          </h3>
  
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-4 block">
              cloud_upload
            </span>
            <p className="text-foreground mb-4">
              Drag & drop your file here, or click to select
            </p>
            <label className="cursor-pointer">
              <span className="inline-block px-6 py-3 bg-[#1B7FE6] text-white rounded-full font-medium hover:bg-[#176cc3] transition">
                Choose File
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              />
            </label>
          </div>
  
          {/* Selected File Preview */}
          {file && (
            <div className="border border-gray-200 mt-4 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-500">
                description
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          )}
  
          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-full border border-gray-300 text-foreground font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!file}
              className="flex-1 h-12 rounded-full bg-[#1B7FE6] text-white font-medium hover:bg-[#176cc3] disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-lg"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  }