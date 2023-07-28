'use client';
import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { useAccount } from 'wagmi';
import crypto from 'crypto';
import { Poseidon, CircuitString } from 'snarkyjs';

interface MetadataForm {
  title: string;
  author: string;
  description: string;
  endorser: string;
  date: string;
}

interface MetaDataFormProps {
  confirmedImage: boolean;
  selectedImageUrl: string;
}

export default function MetadataForm({
  confirmedImage,
  selectedImageUrl,
}: MetaDataFormProps) {
  // const [title, setTitle] = useState<string>('');
  // const [creator, setCreator] = useState<string>('');
  // const [description, setDescription] = useState<string>('');
  const [metadata, setMetadata] = useState<MetadataForm>({
    title: '',
    author: '',
    description: '',
    endorser: '@',
    date: '',
  });
  const [hash, setHash] = useState<string>('');
  const [endorserError, setEndorserError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const { address } = useAccount();

  const handleDate = (date: string) => {
    // the date string needs to be in the format MM/DD/YYYY
    // so we need to check that MM and DD are both 2 numbers long
    // check that YYYY is 4 numbers long
    const value = date
      // Remove all non-digit characters (except the first slash)
      .replace(/(?!^)-/g, '')
      // Add slash after 2 digits
      .replace(/(\d{2})/, '$1/')
      // Add second slash after 5 digits
      .replace(/(\d{2}\/\d{2})/, '$1/')
      // Trim to final length of 10
      .slice(0, 10);

    // setDate(value);
    setMetadata((prev) => ({
      ...prev,
      date: value,
    }));
  };

  const checkDate = (date: string) => {
    // the date string needs to be in the format MM/DD/YYYY
    // so we need to check that MM and DD are both 2 numbers long
    // check that YYYY is 4 numbers long, and the date can be any 4 digit year
    const regex = /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

    const isValid = regex.test(date);

    return isValid;
  };

  const checkEndorser = (endorser: string) => {
    // the endorser string needs to be a valid twitter handle
    // so we need to check if it starts with @ with regex
    // and if it has a length of 16 or less
    const regex = /^@(\w){1,15}$/;
    const isValid = regex.test(endorser);

    return isValid;
  };

  const handleMetadata = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    const data = await res.json();
  };

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
                <form
                  className="flex flex-col gap-y-6"
                  onSubmit={handleMetadata}
                >
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
                      onChange={(e) =>
                        setMetadata((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
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
                      onChange={(e) =>
                        setMetadata((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
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
                      onChange={(e) =>
                        setMetadata((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="endorser"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Endorser Twitter Handle
                    </label>
                    <input
                      type="text"
                      name="endorser"
                      id="endorser"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-2"
                      placeholder="@MinaProtocol"
                      value={metadata.endorser}
                      onChange={(e) => {
                        const isValid = checkEndorser(e.target.value);
                        const value = e.target.value;
                        setEndorserError(!isValid);
                        if (value[0] !== '@') {
                          // setInputValue('@' + value);
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
                  <div className="relative">
                    <label
                      htmlFor="date"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Date
                    </label>
                    <input
                      type="text"
                      name="date"
                      id="date"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-2"
                      placeholder="12/01/2018"
                      onChange={(e) => {
                        const isValid = checkDate(e.target.value);
                        handleDate(e.target.value);
                        setDateError(!isValid);
                        setMetadata((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }));
                      }}
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
