'use client';
import { Fragment, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { useAccount } from 'wagmi';
import { CheckIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import crypto from 'crypto';
import { Poseidon, CircuitString } from 'snarkyjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { cn, formatDate } from '@/lib/utils';
import { CopyHash } from '@/components/client';

interface MetadataForm {
  title: string;
  author: string;
  description: string;
  endorser: string;
  date: string;
}

interface MetaDataFormProps {
  showMetadata: boolean;
  setShowMetadata: (show: boolean) => void;
  confirmedImage: boolean;
  setConfirmedImage: (confirmed: boolean) => void;
  selectedImageUrl: string;
  setSelectedImageUrl: (url: string) => void;
  showDropzone: boolean;
  setShowDropzone: (show: boolean) => void;
}

export default function MetadataForm({
  showMetadata,
  setShowMetadata,
  confirmedImage,
  setConfirmedImage,
  selectedImageUrl,
  setSelectedImageUrl,
  showDropzone,
  setShowDropzone,
}: MetaDataFormProps) {
  const [metadata, setMetadata] = useState<MetadataForm>({
    title: '',
    author: '',
    description: '',
    endorser: '@',
    date: '',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);
  const [loadingSubmission, setLoadingSubmission] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const { address, isConnected } = useAccount();

  const router = useRouter();

  const handleDate = (date: string) => {
    let input = date.replace(/[^0-9/]/g, '');
    if (
      (input.length === 2 || input.length === 5) &&
      input !== metadata.date.slice(0, metadata.date.length - 1)
    ) {
      input += '/';
    }
    setMetadata((prev) => ({
      ...prev,
      date: input.slice(0, 10),
    }));
  };

  const isValidDate = (date: string) => {
    const regex = /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

    const isValid = regex.test(date);

    return isValid;
  };

  const checkEndorser = (endorser: string) => {
    const regex = /^@(\w){1,15}$/;
    const isValid = regex.test(endorser);

    return isValid;
  };

  const handleValidationCheck: () => boolean = () => {
    const passed = Object.entries(metadata).every(([name, value]) => {
      switch (name) {
        case 'title':
          return value !== '';
        case 'author':
          return value !== '';
        case 'description':
          return value !== '';
        case 'endorser':
          return value !== '@' && checkEndorser(value);
        case 'date':
          return value !== '' && isValidDate(value);
      }
    });
    console.log(passed);
    console.log(metadata);

    return passed;
  };

  const handleMetadata = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidSubmission = handleValidationCheck();

    if (!isValidSubmission) {
      setShake(true);
      setTimeout(() => setShake(false), 560);
      return;
    }

    setShowMetadata(false);
    setLoadingSubmission(true);

    const res = await fetch('/api/submit-nft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...metadata,
        endorser: metadata.endorser.slice(1),
        address: address as string,
        imageUrl: selectedImageUrl,
      }),
    });

    console.log(res);

    if (res.ok) {
      const { nftHash } = await res.json();
      setHash(nftHash);
      setShowConfirmation(true);
      setSubmissionSuccess(true);
    }
    setLoadingSubmission(false); // need to do something for error
  };

  const handleResetForm = () => {
    setShowDropzone(true);
    setShowMetadata(false);
    setShowConfirmation(false);
    setSubmissionSuccess(false);
    setConfirmedImage(false);
    setSelectedImageUrl('');

    setMetadata({
      title: '',
      author: '',
      description: '',
      endorser: '@',
      date: '',
    });
  };

  if (loadingSubmission) {
    return (
      <Transition.Root show={loadingSubmission} as={Fragment}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300 max-w-5xl"
          enterFrom="opacity-0 -translate-x-full"
          enterTo="opacity-100 translate-x-0"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-full"
          className="w-full mt-10"
        >
          <div className="flex flex-col w-full h-full items-center gap-y-4">
            <div className="animate-pulse">
              <svg className="animate-spin h-24 w-24" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            </div>
            <p className="text-lg text-center text-black">
              Sending your submission
            </p>
          </div>
        </Transition.Child>
      </Transition.Root>
    );
  }

  if (showConfirmation) {
    return (
      <Transition.Root show={showConfirmation} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => router.push('/collection')}
        >
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all my-8 w-full max-w-md p-6">
                  <Fragment>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        NFT added to collection! Time to get it endorsed.
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Copy the hash below and send it to your endorser. Once
                          they have endorsed the NFT by tweeting out the hash,
                          you can then mint the NFT and add it to your
                          collection.
                        </p>
                      </div>
                    </div>
                  </Fragment>
                  {/* <div className="flex w-full"> */}
                  <div className="flex mt-5 sm:mt-6 justify-center">
                    <CopyHash hash={hash} />
                  </div>
                  <div className="flex gap-x-4 mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      onClick={handleResetForm}
                    >
                      Add another Image
                    </button>
                    <Link
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      // onClick={() => router.push('collection')}
                      href={'/collection'}
                    >
                      Take me to my collection
                    </Link>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  return (
    <Transition.Root show={showMetadata} as={Fragment}>
      <Transition.Child
        as="div"
        enter="ease-out duration-300 max-w-5xl"
        enterFrom="opacity-0 -translate-x-full"
        enterTo="opacity-100 translate-x-0"
        leave="ease-in duration-300"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 translate-x-full"
        className="flex flex-col w-full"
        afterLeave={() => {
          setLoadingSubmission(true); // FIX THIS
        }}
      >
        <div className="flex w-full items-start">
          <div className="flex rounded-full w-8 h-8 items-center content-center justify-center">
            <ArrowUturnLeftIcon
              className="h-3/4 w-3/4 text-gray-500 hover:cursor-pointer"
              onClick={handleResetForm}
            />
          </div>
        </div>

        <div className="flex">
          <div className="flex w-1/2 items-center justify-center">
            <img src={selectedImageUrl} alt="selected image" className="" />
          </div>
          <div className="w-1/2">
            <div className="flex flex-col items-center justify-center p-4 ">
              <div className="w-full max-w-2xl p-8 rounded shadow-md z-50 bg-white">
                <form
                  className="flex flex-col gap-y-6"
                  onSubmit={handleMetadata}
                >
                  {/* Title */}
                  <div className="relative">
                    <label
                      htmlFor="title"
                      className="absolute z-10 -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  ${cn(
                        shake && metadata.title === ''
                          ? 'animate-shake ring-red-300'
                          : 'ring-gray-300'
                      )} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-2`}
                      placeholder="Mina Cohort #1"
                      value={metadata.title}
                      onChange={(e) =>
                        setMetadata((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {/* Creator */}
                  <div className="relative">
                    <label
                      htmlFor="creator"
                      className="absolute z-10 -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Creator
                    </label>
                    <input
                      type="text"
                      name="creator"
                      id="creator"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${cn(
                        shake && metadata.author === ''
                          ? 'animate-shake ring-red-300'
                          : 'ring-gray-300'
                      )} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-2`}
                      placeholder="cpone"
                      onChange={(e) =>
                        setMetadata((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {/* Description */}
                  <div className="relative">
                    <label
                      htmlFor="description"
                      className="absolute z-10 -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Description
                    </label>
                    <textarea
                      rows={3}
                      name="description"
                      id="description"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${cn(
                        shake && metadata.description === ''
                          ? 'animate-shake ring-red-300'
                          : 'ring-gray-300'
                      )} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-2`}
                      placeholder="My first NFT on Mina!"
                      value={metadata.description}
                      onChange={(e) =>
                        setMetadata((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {/* Endorser Twitter Handle */}
                  <div className="relative">
                    <label
                      htmlFor="endorser"
                      className="absolute z-10 -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Endorser Twitter Handle
                    </label>
                    <input
                      type="text"
                      name="endorser"
                      id="endorser"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${cn(
                        shake && metadata.endorser === '@'
                          ? 'animate-shake ring-red-300'
                          : 'ring-gray-300'
                      )} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-2`}
                      placeholder="@MinaProtocol"
                      value={metadata.endorser}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value[0] !== '@') {
                          setMetadata((prev) => ({
                            ...prev,
                            endorser: '@' + e.target.value,
                          }));
                        } else {
                          setMetadata((prev) => ({
                            ...prev,
                            endorser: e.target.value,
                          }));
                        }
                      }}
                    />
                  </div>
                  {/* Date */}
                  <div className="relative">
                    <label
                      htmlFor="date"
                      className="absolute z-10 -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Date
                    </label>
                    <input
                      type="text"
                      name="date"
                      id="date"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${cn(
                        shake && !isValidDate(metadata.date)
                          ? 'animate-shake ring-red-300'
                          : 'ring-gray-300'
                      )} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-2`}
                      placeholder="12/01/2018"
                      value={metadata.date}
                      onChange={(e) => {
                        handleDate(e.target.value);
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className={cn(
                      isConnected
                        ? `block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full ${
                            shake
                              ? 'animate-shake bg-red-500 hover:bg-red-700'
                              : 'bg-indigo-500 hover:bg-indigo-700'
                          }`
                        : 'block bg-gray-400 text-white font-bold py-2 px-4 rounded-full'
                    )}
                    disabled={!isConnected}
                  >
                    {isConnected
                      ? shake
                        ? `Invalid input${
                            Object.values(metadata).filter(
                              (value) => value === '' || value === '@'
                            ).length > 1
                              ? 's'
                              : ''
                          }`
                        : 'Submit for endorsement'
                      : 'Connect Wallet'}
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
