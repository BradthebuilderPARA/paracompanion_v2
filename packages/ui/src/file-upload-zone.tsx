import * as React from "react";
import { STRINGS } from "@paracompanion/strings";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  loading?: boolean;
  className?: string;
}

/**
 * FileUploadZone: Shared drag-and-drop component for My Docs.
 * Handles validation and visual feedback during upload.
 */
export function FileUploadZone({ onFilesSelected, loading, className }: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div 
      className={`relative w-full border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-12 text-center rounded-[4px]
        ${isDragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-outline-variant/20 bg-surface-container-low/50 hover:bg-surface-container-low'} 
        ${loading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload-input')?.click()}
    >
      <input 
        id="file-upload-input"
        type="file" 
        multiple 
        className="hidden" 
        onChange={handleFileInput}
        accept="application/pdf"
      />
      
      <div className="bg-surface-container-high/50 p-6 rounded-full mb-6">
        <span className={`material-symbols-outlined text-[48px] ${isDragActive ? 'text-primary scale-110' : 'text-outline-variant/60'} transition-transform duration-200`}>
          {loading ? 'sync' : 'upload_file'}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-headline font-extrabold text-xl text-on-surface tracking-tight">
          {loading ? 'Processing Document...' : STRINGS.MY_DOCS.UPLOAD_LABEL}
        </h3>
        <p className="text-sm font-medium text-on-surface-variant/60 max-w-[280px]">
          {STRINGS.MY_DOCS.UPLOAD_DRAG_DROP}
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          PDF ONLY
        </span>
        <span className="h-1 w-1 bg-outline/20 rounded-full"></span>
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">storage</span>
          {STRINGS.MY_DOCS.UPLOAD_MAX_SIZE}
        </span>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface/40 backdrop-blur-[2px] rounded-[4px]">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
