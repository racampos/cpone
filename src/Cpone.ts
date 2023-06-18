import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PublicKey,
  Signature,
  PrivateKey,
  Bool,
} from 'snarkyjs';

// The public key of our trusted data provider
const ORACLE_PUBLIC_KEY =
  'B62qqVT16fNj4nAkCApWUKyr4YVxuunbUSuXfM4gRVDKveEmjsSNWVS';

// Temporary hardcoded nftId of the NFT we want to endorse
const NFT_ID = '1202256962';

// Temporary hardcoded endorserId of the endorser's Tweeter handle
const ENDORSER_ID = '2997990243';

export class Cpone extends SmartContract {
  // Define contract state
  @state(PublicKey) oraclePublicKey = State<PublicKey>();
  @state(Field) nftId = State<Field>();
  @state(Field) endorserId = State<Field>();
  @state(Bool) isEndorsed = State<Bool>();

  // Define contract events
  events = {
    verified: Field,
  };

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method init(zkappKey: PrivateKey) {
    super.init(zkappKey);
    // Initialize contract state
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    this.nftId.set(Field(NFT_ID));
    this.endorserId.set(Field(ENDORSER_ID));
    // Specify that caller should include signature with tx instead of proof Is this necessary
    this.requireSignature();
  }

  @method verify(
    oracleNftId: Field,
    oracleEndorserId: Field,
    signature: Signature
  ) {
    // Get the oracle public key from the contract state
    const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(oraclePublicKey);

    // Get the NFT ID from the contract state
    const onchainNftId = this.nftId.get();
    this.nftId.assertEquals(onchainNftId);

    // Get the endorser's Twitter handle from the contract state
    const onchainEndorserId = this.endorserId.get();
    this.endorserId.assertEquals(onchainEndorserId);

    // Evaluate whether the signature is valid for the provided data
    const validSignature = signature.verify(oraclePublicKey, [
      Field(NFT_ID),
      Field(ENDORSER_ID),
    ]);
    validSignature.assertTrue();

    // Evaluate whether the NFT ID from the oracle corresponds to the one commited onchain
    this.nftId.assertEquals(oracleNftId);

    // Evaluate whether the endorser ID from the oracle corresponds to the one commited onchain
    this.endorserId.assertEquals(oracleEndorserId);

    // Set the onchain flag to true
    this.isEndorsed.set(Bool(true));

    // Emit an event containing the verified endorser's ID
    this.emitEvent('verified', oracleEndorserId);
  }
}
