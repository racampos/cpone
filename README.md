# CPoNE - Cryptographic Proof of NFT Endorsement

This is a Mina zkApp for the CPoNE project, a zero-knowledge proof application on the Mina blockchain. It allows a zkApp to consume data from a trusted oracle that retrieves data from Twitter, and verifies its authenticity.

## How it works

Mina smart contracts run off-chain and provide a way to prove computations on private data without revealing the data itself. This is achieved through zero-knowledge proofs. When the smart contract consumes data from a 3rd party source like Twitter, it's important to ensure the data is authentic and came from the expected source.

An [oracle](https://github.com/racampos/cpone-oracle) fetches data from Twitter, signs it using a Mina-compatible private key, and then returns the data, signature, and public key associated with our private key. The zkApp can then use this to verify the authenticity of the data.

## Design

The smart contract contains on-chain state variables: `oraclePublicKey`, `nftHash`, `endorserHash`, and `isEndorsed`. The `oraclePublicKey` stores the public key of our trusted data provider. The `nftHash` and `endorserHash` are Poseidon hashes of the SHA256 hash retrieved from the body of the endorser's tweet and of the Twitter handle respectively. The `isEndorsed` is a boolean flag that's set to true when the `verify` function on the zkApp is run and successfully validates that the data retrieved from the oracle matches the data on-chain.

## Setup & Usage

Make sure to have Node.js and npm installed.

Clone this repository and then install the dependencies:

```sh
git clone https://github.com/racampos/cpone.git
cd cpone
npm install
```

To build the project, run:

`npm run build`

You can run the tests with:

`npm run test`

## Future work

Our current system relies on trusting the oracle. A potential improvement would be to implement a cryptographic scheme to ensure the authenticity and integrity of the data fetched from Twitter. This would involve a system that can generate an unforgeable commitment of the TLS session data, verify that this data is authentically from the Twitter server, while preserving the security and privacy assumptions of TLS.
See the section on Future Work in the [cpone-oracle](https://github.com/racampos/cpone-oracle/blob/main/README.md) repository.

License

This project is licensed under the [Apache-2.0](LICENSE) License.