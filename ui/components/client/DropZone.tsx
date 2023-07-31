'use client';
import React, { useCallback, useState, Fragment } from 'react';
import { useDropzone } from 'react-dropzone';
import { Transition } from '@headlessui/react';

import { DropZoneImage } from '@/components/server';
import { ConfirmImage, MetadataForm } from '@/components/client';

export default function DropZone() {
  const [confirmedImage, setConfirmedImage] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // still need to configure error handling
  const onDrop = useCallback((acceptedFile: File[]) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImageUrl(reader.result as string);
      setShowConfirmation(true);
    };
    reader.readAsDataURL(acceptedFile[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { 'image/png': [], 'image/jpeg': [] },
  });

  return (
    <Fragment>
      <Transition.Root show={!confirmedImage} as={Fragment}>
        <Transition.Child
          enter="ease-out duration-700"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="ease-out duration-300 absolute"
          leaveFrom="opacity-100 translate-y-full translate-x-0 "
          leaveTo="opacity-0 translate-y-0 translate-x-full"
          className="w-5/12 p-8 rounded shadow-md z-50 bg-white "
        >
          <div {...getRootProps()} className="relative z-10 ">
            <div className="absolute inset-0 bg-opacity-50 border-2 border-black border-opacity-20 rounded-lg flex items-center justify-center p-2">
              <input {...getInputProps()} />
              <p className="text-black text-center">
                Drag 'n' drop image here, or click to select image
              </p>
            </div>
            <DropZoneImage />
          </div>
        </Transition.Child>
      </Transition.Root>
      <MetadataForm
        selectedImageUrl={selectedImageUrl}
        confirmedImage={confirmedImage}
      />
      <ConfirmImage
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        setConfirmedImage={setConfirmedImage}
        imageUrl={selectedImageUrl}
      />
    </Fragment>
  );
}
