'use client';
import { Fragment, useEffect, useState } from 'react';
import { Transition, Menu } from '@headlessui/react';
import { cn } from '@/lib/utils';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function ConnectWallet() {
  const { connector, isConnected, address } = useAccount();
  const [userAddress, setUserAddress] = useState('');
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setUserAddress(`${address?.slice(0, 6)}...`);
  }, [isConnected]);

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex max-w-xs items-center rounded-lg p-2 px-4 bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2">
          <span className="sr-only">Wallet</span>
          <p className="">{isConnected ? userAddress : 'Connect'}</p>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {!isConnected ? (
            <Fragment>
              {connectors
                .filter((x) => x.ready && x.id !== connector?.id)
                .map((item) => (
                  <Menu.Item key={item.id}>
                    {({ active }) => (
                      <a
                        className={cn(
                          active ? 'bg-gray-100 mr-0 cursor-pointer' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        )}
                        onClick={() => connect({ connector: item })}
                      >
                        {item.name}
                        {isLoading &&
                          item.id === pendingConnector?.id &&
                          ' connecting...'}
                      </a>
                    )}
                  </Menu.Item>
                ))}
            </Fragment>
          ) : (
            <Fragment>
              <Menu.Item key="disconnect">
                {({ active }) => (
                  <a
                    className={cn(
                      active ? 'bg-gray-100 mr-0 cursor-pointer' : '',
                      'block px-4 py-2 text-sm text-gray-700'
                    )}
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </a>
                )}
              </Menu.Item>
            </Fragment>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
