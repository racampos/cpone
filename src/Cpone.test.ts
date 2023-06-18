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
  Bool,
} from 'snarkyjs';

// The public key of our trusted data provider
const ORACLE_PUBLIC_KEY =
  'B62qqVT16fNj4nAkCApWUKyr4YVxuunbUSuXfM4gRVDKveEmjsSNWVS';

// Temporary hardcoded nftId of the NFT we want to endorse
const NFT_ID = '1202256962';

// Temporary hardcoded endorserId of the endorser's Tweeter handle
const ENDORSER_ID = '2997990243';

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
    expect(oraclePublicKey).toEqual(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
  });

  // describe('actual API requests', () => {
  //   it('emits an `id` event containing the users id if their credit score is above 700 and the provided signature is valid', async () => {
  //     const zkAppInstance = new Cpone(zkAppAddress);
  //     await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

  //     const response = await fetch(
  //       'https://mina-credit-score-signer-pe3eh.ondigitalocean.app/user/1'
  //     );
  //     const data = await response.json();

  //     const id = Field(data.data.id);
  //     const creditScore = Field(data.data.creditScore);
  //     const signature = Signature.fromJSON(data.signature);

  //     const txn = await Mina.transaction(deployerAccount, () => {
  //       zkAppInstance.verify(
  //         id,
  //         creditScore,
  //         signature ?? fail('something is wrong with the signature')
  //       );
  //     });
  //     await txn.prove();
  //     await txn.send();

  //     const events = await zkAppInstance.fetchEvents();
  //     const verifiedEventValue = events[0].event.toFields(null)[0];
  //     expect(verifiedEventValue).toEqual(id);
  //   });

  //   it('throws an error if the credit score is below 700 even if the provided signature is valid', async () => {
  //     const zkAppInstance = new Cpone(zkAppAddress);
  //     await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

  //     const response = await fetch(
  //       'https://mina-credit-score-signer-pe3eh.ondigitalocean.app/user/2'
  //     );
  //     const data = await response.json();

  //     const id = Field(data.data.id);
  //     const creditScore = Field(data.data.creditScore);
  //     const signature = Signature.fromJSON(data.signature);

  //     expect(async () => {
  //       await Mina.transaction(deployerAccount, () => {
  //         zkAppInstance.verify(
  //           id,
  //           creditScore,
  //           signature ?? fail('something is wrong with the signature')
  //         );
  //       });
  //     }).rejects;
  //   });
  // });

  describe('hardcoded values', () => {
    it('emits a `verified` event containing the endorser ID and sets the onchain flag isEndorsed to true IF both the NFT ID and the endorser ID match what was commited onchain and the provided signature is valid', async () => {
      const zkAppInstance = new Cpone(zkAppAddress);
      await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

      const nftId = Field(NFT_ID);
      const endorserId = Field(ENDORSER_ID);
      const signature = Signature.fromJSON({
        r: '22900154421352084806490148755130528752716915378930728573979866650583085896462',
        s: '693972796235833492516587997912196771331837622489830548312138773072096180842',
      });

      const txn = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.verify(
          nftId,
          endorserId,
          signature ?? fail('something is wrong with the signature')
        );
      });
      await txn.prove();
      await txn.send();

      //Check for emmited events
      const events = await zkAppInstance.fetchEvents();
      const verifiedEventValue = events[0].event.data.toFields(null)[0];
      expect(verifiedEventValue).toEqual(endorserId);

      // Check for onchain flag
      const isEndorsed = zkAppInstance.isEndorsed.get();
      expect(isEndorsed).toEqual(Bool(true));
    });

    // it('throws an error if the credit score is below 700 even if the provided signature is valid', async () => {
    //   const zkAppInstance = new Cpone(zkAppAddress);
    //   await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

    //   const id = Field(2);
    //   const creditScore = Field(536);
    //   const signature = Signature.fromJSON({
    //     r: '22900154421352084806490148755130528752716915378930728573979866650583085896462',
    //     s: '693972796235833492516587997912196771331837622489830548312138773072096180842'
    //   });

    //   expect(async () => {
    //     await Mina.transaction(deployerAccount, () => {
    //       zkAppInstance.verify(
    //         id,
    //         creditScore,
    //         signature ?? fail('something is wrong with the signature')
    //       );
    //     });
    //   }).rejects;
    // });

    // it('throws an error if the credit score is above 700 and the provided signature is invalid', async () => {
    //   const zkAppInstance = new Cpone(zkAppAddress);
    //   await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

    //   const id = Field(1);
    //   const creditScore = Field(787);
    //   const signature = Signature.fromJSON({
    //     r:
    //       '26545513748775911233424851469484096799413741017006352456100547880447752952428',
    //     s:
    //       '7381406986124079327199694038222605261248869991738054485116460354242251864564',
    //   });

    //   expect(async () => {
    //     await Mina.transaction(deployerAccount, () => {
    //       zkAppInstance.verify(
    //         id,
    //         creditScore,
    //         signature ?? fail('something is wrong with the signature')
    //       );
    //     });
    //   }).rejects;
    // });
  });
});
