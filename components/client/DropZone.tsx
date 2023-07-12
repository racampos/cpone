'use client';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { DropZoneImage } from '@/components/server';

export default function DropZone() {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="relative z-50 bg-white">
      <div className="absolute inset-0 bg-opacity-50 border-2 border-black border-opacity-20 rounded-lg flex items-center justify-center">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-black text-center">Drop the files here ...</p>
        ) : (
          <p className="text-black text-center">
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
        {/* <p className="text-black text-center">
          Drag your file here, or click to navigate to it
        </p> */}
      </div>
      <DropZoneImage />
    </div>
  );
}
