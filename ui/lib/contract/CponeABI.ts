import { parseAbi, narrow } from 'abitype';

import json from './CponeContract.json';

export const bytecode = `0x${json.deployedBytecode}` as `0x${string}`;

const abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_uri',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_fromTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_toTokenId',
        type: 'uint256',
      },
    ],
    name: 'BatchMetadataUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'MetadataUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'NFTMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const CponeContract = {
  abi: [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'approved',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'ApprovalForAll',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: '_fromTokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_toTokenId',
          type: 'uint256',
        },
      ],
      name: 'BatchMetadataUpdate',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: '_tokenId',
          type: 'uint256',
        },
      ],
      name: 'MetadataUpdate',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'NFTMinted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'getApproved',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'operator', type: 'address' },
      ],
      name: 'isApprovedForAll',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'ownerOf',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'string', name: 'uri', type: 'string' },
      ],
      name: 'safeMint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'operator', type: 'address' },
        { internalType: 'bool', name: 'approved', type: 'bool' },
      ],
      name: 'setApprovalForAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  byecode:
    '0x60806040523480156200001157600080fd5b50604080518082018252600581526443706f6e6560d81b60208083019182528351808501909452600384526243504f60e81b9084015281519192916200005a91600091620000e9565b50805162000070906001906020840190620000e9565b5050506200008d620000876200009360201b60201c565b62000097565b620001cc565b3390565b600780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620000f7906200018f565b90600052602060002090601f0160209004810192826200011b576000855562000166565b82601f106200013657805160ff191683800117855562000166565b8280016001018555821562000166579182015b828111156200016657825182559160200191906001019062000149565b506200017492915062000178565b5090565b5b8082111562000174576000815560010162000179565b600181811c90821680620001a457607f821691505b60208210811415620001c657634e487b7160e01b600052602260045260246000fd5b50919050565b61187980620001dc6000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c8063715018a6116100a2578063b88d4fde11610071578063b88d4fde1461021b578063c87b56dd1461022e578063d204c45e14610241578063e985e9c514610254578063f2fde38b1461029057600080fd5b8063715018a6146101e75780638da5cb5b146101ef57806395d89b4114610200578063a22cb4651461020857600080fd5b806323b872dd116100de57806323b872dd1461018d57806342842e0e146101a05780636352211e146101b357806370a08231146101c657600080fd5b806301ffc9a71461011057806306fdde0314610138578063081812fc1461014d578063095ea7b314610178575b600080fd5b61012361011e366004611384565b6102a3565b60405190151581526020015b60405180910390f35b6101406102b4565b60405161012f91906113f9565b61016061015b36600461140c565b610346565b6040516001600160a01b03909116815260200161012f565b61018b610186366004611441565b61036d565b005b61018b61019b36600461146b565b610488565b61018b6101ae36600461146b565b6104b9565b6101606101c136600461140c565b6104d4565b6101d96101d43660046114a7565b610534565b60405190815260200161012f565b61018b6105ba565b6007546001600160a01b0316610160565b6101406105ce565b61018b6102163660046114c2565b6105dd565b61018b61022936600461158a565b6105ec565b61014061023c36600461140c565b610624565b61018b61024f366004611606565b61062f565b610123610262366004611668565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b61018b61029e3660046114a7565b6106a6565b60006102ae8261071f565b92915050565b6060600080546102c39061169b565b80601f01602080910402602001604051908101604052809291908181526020018280546102ef9061169b565b801561033c5780601f106103115761010080835404028352916020019161033c565b820191906000526020600020905b81548152906001019060200180831161031f57829003601f168201915b5050505050905090565b600061035182610744565b506000908152600460205260409020546001600160a01b031690565b6000610378826104d4565b9050806001600160a01b0316836001600160a01b031614156103eb5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b038216148061040757506104078133610262565b6104795760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c00000060648201526084016103e2565b61048383836107a3565b505050565b6104923382610811565b6104ae5760405162461bcd60e51b81526004016103e2906116d6565b610483838383610890565b610483838383604051806020016040528060008152506105ec565b6000818152600260205260408120546001600160a01b0316806102ae5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016103e2565b60006001600160a01b03821661059e5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b60648201526084016103e2565b506001600160a01b031660009081526003602052604090205490565b6105c26109f4565b6105cc6000610a4e565b565b6060600180546102c39061169b565b6105e8338383610aa0565b5050565b6105f63383610811565b6106125760405162461bcd60e51b81526004016103e2906116d6565b61061e84848484610b6f565b50505050565b60606102ae82610ba2565b600061063a60085490565b905061064a600880546001019055565b6106548382610cc8565b61065e8183610ce2565b826001600160a01b03167f4cc0a9c4a99ddc700de1af2c9f916a7cbfdb71f14801ccff94061ad1ef8a80408260405161069991815260200190565b60405180910390a2505050565b6106ae6109f4565b6001600160a01b0381166107135760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016103e2565b61071c81610a4e565b50565b60006001600160e01b03198216632483248360e11b14806102ae57506102ae82610db4565b6000818152600260205260409020546001600160a01b031661071c5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016103e2565b600081815260046020526040902080546001600160a01b0319166001600160a01b03841690811790915581906107d8826104d4565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60008061081d836104d4565b9050806001600160a01b0316846001600160a01b0316148061086457506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b806108885750836001600160a01b031661087d84610346565b6001600160a01b0316145b949350505050565b826001600160a01b03166108a3826104d4565b6001600160a01b0316146108c95760405162461bcd60e51b81526004016103e290611723565b6001600160a01b03821661092b5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016103e2565b826001600160a01b031661093e826104d4565b6001600160a01b0316146109645760405162461bcd60e51b81526004016103e290611723565b600081815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6007546001600160a01b031633146105cc5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103e2565b600780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b816001600160a01b0316836001600160a01b03161415610b025760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016103e2565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b610b7a848484610890565b610b8684848484610e04565b61061e5760405162461bcd60e51b81526004016103e290611768565b6060610bad82610744565b60008281526006602052604081208054610bc69061169b565b80601f0160208091040260200160405190810160405280929190818152602001828054610bf29061169b565b8015610c3f5780601f10610c1457610100808354040283529160200191610c3f565b820191906000526020600020905b815481529060010190602001808311610c2257829003601f168201915b505050505090506000610c7a60408051808201909152601581527468747470733a2f2f697066732e696f2f697066732f60581b602082015290565b9050805160001415610c8d575092915050565b815115610cbf578082604051602001610ca79291906117ba565b60405160208183030381529060405292505050919050565b61088884610f11565b6105e8828260405180602001604052806000815250610fa2565b6000828152600260205260409020546001600160a01b0316610d5d5760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b60648201526084016103e2565b60008281526006602090815260409091208251610d7c928401906112d5565b506040518281527ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce79060200160405180910390a15050565b60006001600160e01b031982166380ac58cd60e01b1480610de557506001600160e01b03198216635b5e139f60e01b145b806102ae57506301ffc9a760e01b6001600160e01b03198316146102ae565b60006001600160a01b0384163b15610f0657604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610e489033908990889088906004016117e9565b602060405180830381600087803b158015610e6257600080fd5b505af1925050508015610e92575060408051601f3d908101601f19168201909252610e8f91810190611826565b60015b610eec573d808015610ec0576040519150601f19603f3d011682016040523d82523d6000602084013e610ec5565b606091505b508051610ee45760405162461bcd60e51b81526004016103e290611768565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610888565b506001949350505050565b6060610f1c82610744565b6000610f5060408051808201909152601581527468747470733a2f2f697066732e696f2f697066732f60581b602082015290565b90506000815111610f705760405180602001604052806000815250610f9b565b80610f7a84610fd5565b604051602001610f8b9291906117ba565b6040516020818303038152906040525b9392505050565b610fac8383611072565b610fb96000848484610e04565b6104835760405162461bcd60e51b81526004016103e290611768565b60606000610fe2836111fd565b600101905060008167ffffffffffffffff811115611002576110026114fe565b6040519080825280601f01601f19166020018201604052801561102c576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a85049450846110655761106a565b611036565b509392505050565b6001600160a01b0382166110c85760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016103e2565b6000818152600260205260409020546001600160a01b03161561112d5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016103e2565b6000818152600260205260409020546001600160a01b0316156111925760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016103e2565b6001600160a01b038216600081815260036020908152604080832080546001019055848352600290915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b831061123c5772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310611268576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc10000831061128657662386f26fc10000830492506010015b6305f5e100831061129e576305f5e100830492506008015b61271083106112b257612710830492506004015b606483106112c4576064830492506002015b600a83106102ae5760010192915050565b8280546112e19061169b565b90600052602060002090601f0160209004810192826113035760008555611349565b82601f1061131c57805160ff1916838001178555611349565b82800160010185558215611349579182015b8281111561134957825182559160200191906001019061132e565b50611355929150611359565b5090565b5b80821115611355576000815560010161135a565b6001600160e01b03198116811461071c57600080fd5b60006020828403121561139657600080fd5b8135610f9b8161136e565b60005b838110156113bc5781810151838201526020016113a4565b8381111561061e5750506000910152565b600081518084526113e58160208601602086016113a1565b601f01601f19169290920160200192915050565b602081526000610f9b60208301846113cd565b60006020828403121561141e57600080fd5b5035919050565b80356001600160a01b038116811461143c57600080fd5b919050565b6000806040838503121561145457600080fd5b61145d83611425565b946020939093013593505050565b60008060006060848603121561148057600080fd5b61148984611425565b925061149760208501611425565b9150604084013590509250925092565b6000602082840312156114b957600080fd5b610f9b82611425565b600080604083850312156114d557600080fd5b6114de83611425565b9150602083013580151581146114f357600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff8084111561152f5761152f6114fe565b604051601f8501601f19908116603f01168101908282118183101715611557576115576114fe565b8160405280935085815286868601111561157057600080fd5b858560208301376000602087830101525050509392505050565b600080600080608085870312156115a057600080fd5b6115a985611425565b93506115b760208601611425565b925060408501359150606085013567ffffffffffffffff8111156115da57600080fd5b8501601f810187136115eb57600080fd5b6115fa87823560208401611514565b91505092959194509250565b6000806040838503121561161957600080fd5b61162283611425565b9150602083013567ffffffffffffffff81111561163e57600080fd5b8301601f8101851361164f57600080fd5b61165e85823560208401611514565b9150509250929050565b6000806040838503121561167b57600080fd5b61168483611425565b915061169260208401611425565b90509250929050565b600181811c908216806116af57607f821691505b602082108114156116d057634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b600083516117cc8184602088016113a1565b8351908301906117e08183602088016113a1565b01949350505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061181c908301846113cd565b9695505050505050565b60006020828403121561183857600080fd5b8151610f9b8161136e56fea2646970667358221220b5ec5097ed065ad913112ef090e6e624cd3cf448c616b6836ce4954a29a1b46264736f6c63430008090033',
} as const;

export const CponeAbi = narrow(abi);
