'use client';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';

interface MetaDataFormProps {
  confirmedImage: boolean;
  selectedImageUrl: string;
}

export default function MetadataForm({
  confirmedImage,
  selectedImageUrl,
}: MetaDataFormProps) {
  return (
    <Transition.Root show={confirmedImage} as={Fragment}>
      <Transition.Child
        as="div"
        enter="ease-out duration-300 max-w-5xl"
        enterFrom="opacity-0 -translate-x-full"
        enterTo="opacity-100 translate-x-0"
        leave="ease-in duration-300"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 translate-x-full"
        className="w-full mt-4"
      >
        <div className="flex flex-row">
          <div className="flex w-1/2 items-center justify-center">
            <img src={selectedImageUrl} alt="selected image" className="" />
          </div>
          <div className="w-1/2">
            <div className="flex flex-col items-center justify-center p-4 ">
              <div className="w-full max-w-2xl p-8 rounded shadow-md z-50 bg-white">
                <form className="flex flex-col gap-y-6">
                  <div className="relative">
                    <label
                      htmlFor="title"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-2"
                      placeholder="Mina Cohort #1"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="creator"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Creator
                    </label>
                    <input
                      type="text"
                      name="creator"
                      id="creator"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-2"
                      placeholder="cpone"
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="description"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Description
                    </label>
                    <textarea
                      rows={3}
                      name="description"
                      id="description"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-2"
                      defaultValue={''}
                      placeholder="My first NFT on Mina!"
                    />
                  </div>

                  <button
                    type="submit"
                    className="block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Submit for endorsement
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Transition.Child>
    </Transition.Root>
  );
}
