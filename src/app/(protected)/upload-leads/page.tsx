"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  fetchProfiles,
  uploadProfilesFromExcel,
} from "../../redux/slices/ProfileSlice";
import {
  ArrowLeft,
  UploadCloud,
  Download,
  FileSpreadsheet,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function UploadLeadsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { uploadLoading } = useSelector((state: RootState) => state.profiles);

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isDraggingExcel, setIsDraggingExcel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => router.push("/home");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingExcel(true);
  };

  const handleDragLeave = () => {
    setIsDraggingExcel(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingExcel(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
    // Reset input value so the same file can be re-selected
    e.target.value = "";
  };

  const validateAndSetFile = (file?: File) => {
    if (file) {
      // Only accept .xlsx
      if (!file.name.endsWith(".xlsx")) {
        toast.error("Please provide a valid Excel file (.xlsx)");
        return;
      }
      // Check if file is too small (headers-only files are typically under 5KB)
      if (file.size < 5000) {
        toast.error(
          "The file appears to be empty or contains only headers. Please add data rows before uploading.",
        );
        return;
      }
      setExcelFile(file);
    }
  };

  const handleUpload = async () => {
    if (!excelFile) return;
    try {
      setIsSubmitting(true);
      const response: any = await dispatch(uploadProfilesFromExcel(excelFile)).unwrap();

      if (response?.errors && response.errors.length > 0) {
        // Show errors and stay on the page
        const errorMessage = response.errors.join("\n");
        toast.error(errorMessage, {
          duration: 6000,
          style: {
            maxWidth: "500px",
            whiteSpace: "pre-line",
          },
        });
        
        // If some records were successful, we might want to refresh the profiles
        if (response.successCount > 0) {
          dispatch(fetchProfiles());
        }
        return;
      }

      toast.success("Leads imported successfully!");
      if (typeof dispatch !== "undefined") {
        dispatch(fetchProfiles());
      }
      router.push("/home");
    } catch (error: any) {
      toast.error(error.message || "Failed to import leads");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    try {
      // Download the template present in the public folder directly
      const link = document.createElement("a");
      link.href = "/add_lead_template.xlsx";
      link.setAttribute("download", "add_lead_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Template downloaded successfully");
    } catch (error) {
      toast.error("Failed to download template");
      console.error(error);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 pt-20 lg:pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              <span className="text-[#111318]">Import Leads</span>
            </h1>
            <p className="text-sm text-gray-500">
              Batch import your leads using an Excel spreadsheet.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!excelFile || uploadLoading || isSubmitting}
            className="flex-1 sm:flex-initial bg-[#0d59f2] text-white px-3 lg:px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-[#0d59f2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2"
          >
            {uploadLoading || isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Importing...
              </>
            ) : (
              "Import Leads"
            )}
          </button>
        </div>
      </header>
      <main className="max-w-[1280px] mx-auto px-6 py-8 bg-background-light min-h-screen">
        <div className="max-w-2xl mx-auto flex flex-col w-full space-y-6">
          {/* Step 1: Download Template */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111318]">
                  Download Template
                </h3>
                <p className="text-xs text-gray-500">
                  Ensure your data is structured correctly before uploading.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-bold transition-all flex items-center gap-2 w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              Download Format (.xlsx)
            </button>
          </div>

          {/* Step 2: Upload File */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111318]">
                  Upload Completed Template
                </h3>
                <p className="text-xs text-gray-500">
                  Strictly only .xlsx files are supported.
                </p>
              </div>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() =>
                !excelFile &&
                document.getElementById("excel-upload-page-input")?.click()
              }
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[220px] ${
                !excelFile ? "cursor-pointer" : ""
              } ${
                isDraggingExcel
                  ? "border-[#0d59f2] bg-blue-50/50 scale-[1.02]"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {excelFile ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-200 text-green-600">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <p className="text-base font-bold text-[#111318] mb-1">
                    {excelFile.name}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    {(excelFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExcelFile(null);
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Remove File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <UploadCloud className="w-8 h-8 text-[#0d59f2]" />
                  </div>
                  <p className="text-base font-bold text-[#111318] mb-2">
                    Click to browse or drag file here
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    Strictly .xlsx files only
                  </p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept=".xlsx"
                onChange={handleFileSelect}
                id="excel-upload-page-input"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
