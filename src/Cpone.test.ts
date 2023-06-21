import { Cpone } from './Cpone';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  Signature,
  CircuitString,
  Poseidon,
  Bool,
} from 'snarkyjs';

import crypto from 'crypto';

const endorserUsername = 'mathy782';

const ORACLE_PRIVATE_KEY =
  'EKFFxwgToyjnBTCKs5p8f2v2XnmS86yJJ4yso3iR5WZ97F7ooSE1';
const privKey = PrivateKey.fromBase58(ORACLE_PRIVATE_KEY);
const pubKey = privKey.toPublicKey();

// Temporary hardcoded metadata of the NFT we want to endorse
const nftMetadata =
  '{"image":"ipfs://QmWbSfKjzMC5A8mgc15TLVEpQBFS4dsDD4LgZNwBsi2VAg","attributes":[{"trait_type":"Clothes","value":"Biker Vest"},{"trait_type":"Eyes","value":"3d"},{"trait_type":"Fur","value":"White"},{"trait_type":"Mouth","value":"Phoneme Wah"},{"trait_type":"Hat","value":"Commie Hat"},{"trait_type":"Background","value":"Yellow"}]}';
const nftSha256Hash = crypto.createHash('sha256');
nftSha256Hash.update(nftMetadata);
const nftHashCS = CircuitString.fromString(nftSha256Hash.digest('hex'));
const nftHash = Poseidon.hash(nftHashCS.toFields());

// Temporary hardcoded endorserId of the endorser's Tweeter handle
const endorserCS = CircuitString.fromString(endorserUsername);
const endorserHash = Poseidon.hash(endorserCS.toFields());

let proofsEnabled = false;
function createLocalBlockchain() {
  const Local = Mina.LocalBlockchain({ proofsEnabled });
  Mina.setActiveInstance(Local);
  return Local.testAccounts[0].privateKey;
}

async function localDeploy(
  zkAppInstance: Cpone,
  zkAppPrivatekey: PrivateKey,
  deployerAccount: PrivateKey
) {
  const txn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy({ zkappKey: zkAppPrivatekey });
    zkAppInstance.init(zkAppPrivatekey);
    zkAppInstance.customInit(nftHash, endorserHash);
  });
  await txn.prove();
  txn.sign([zkAppPrivatekey]);
  await txn.send();
}

describe('Cpone', () => {
  let deployerAccount: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey;

  beforeAll(async () => {
    await isReady;
    if (proofsEnabled) Cpone.compile();
  });

  beforeEach(async () => {
    deployerAccount = createLocalBlockchain();
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
  });

  afterAll(async () => {
    // `shutdown()` internally calls `process.exit()` which will exit the running Jest process early.
    // Specifying a timeout of 0 is a workaround to defer `shutdown()` until Jest is done running all tests.
    // This should be fixed with https://github.com/MinaProtocol/mina/issues/10943
    setTimeout(shutdown, 0);
  });

  it('generates and deploys the `Cpone` smart contract', async () => {
    const zkAppInstance = new Cpone(zkAppAddress);
    await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);
    const oraclePublicKey = zkAppInstance.oraclePublicKey.get();
    expect(oraclePublicKey).toEqual(pubKey);
  });

  describe('actual API requests', () => {
    it('emits a `verified` event containing the endorser hash and sets the onchain flag isEndorsed to true IF both the NFT ID and the endorser ID match what was commited onchain and the provided signature is valid', async () => {
      const zkAppInstance = new Cpone(zkAppAddress);
      await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

      const response = await fetch(
        `https://cpone-oracle-aa6cba0bb20a.herokuapp.com/getLatestTweet/${endorserUsername}`
      );
      const data = await response.json();

      const nftHash = Field(data.signedData.nftPoseidonHash);
      const endorserHash = Field(data.signedData.endorserHash);

      const signature = Signature.fromJSON(data.signature);

      const txn = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.verify(
          nftHash,
          endorserHash,
          signature ?? fail('something is wrong with the signature')
        );
      });
      await txn.prove();
      await txn.send();

      //Check for emmited events
      const events = await zkAppInstance.fetchEvents();
      const verifiedEventValue = events[0].event.data.toFields(null)[0];
      expect(verifiedEventValue).toEqual(endorserHash);

      // Check for onchain flag
      const isEndorsed = zkAppInstance.isEndorsed.get();
      expect(isEndorsed).toEqual(Bool(true));
    });
  });

  describe('hardcoded values', () => {
    it('emits a `verified` event containing the endorser hash and sets the onchain flag isEndorsed to true IF both the NFT ID and the endorser ID match what was commited onchain and the provided signature is valid', async () => {
      const zkAppInstance = new Cpone(zkAppAddress);
      await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

      const signature = Signature.create(privKey, [nftHash, endorserHash]);

      const txn = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.verify(
          nftHash,
          endorserHash,
          signature ?? fail('something is wrong with the signature')
        );
      });
      await txn.prove();
      await txn.send();

      //Check for emmited events
      const events = await zkAppInstance.fetchEvents();
      const verifiedEventValue = events[0].event.data.toFields(null)[0];
      expect(verifiedEventValue).toEqual(endorserHash);

      // Check for onchain flag
      const isEndorsed = zkAppInstance.isEndorsed.get();
      expect(isEndorsed).toEqual(Bool(true));
    });

    it('throws an error if the NFT ID and endorser Hash are correct but the provided signature is invalid', async () => {
      const zkAppInstance = new Cpone(zkAppAddress);
      await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

      const incorrectNftHash = Poseidon.hash([Field(123)]);
      const signature = Signature.create(privKey, [
        incorrectNftHash,
        endorserHash,
      ]);

      expect(async () => {
        await Mina.transaction(deployerAccount, () => {
          zkAppInstance.verify(
            nftHash,
            endorserHash,
            signature ?? fail('something is wrong with the signature')
          );
        });
      }).rejects;
    });
  });
});
