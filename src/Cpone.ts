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

export class Cpone extends SmartContract {
  // Define contract state
  @state(PublicKey) oraclePublicKey = State<PublicKey>();
  @state(Field) nftHash = State<Field>();
  @state(Field) endorserHash = State<Field>();
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

  // TODO: See how to pass custom paramters to init() function. We need to pass nftHash and endorserHash as parameters.
  @method init(zkappKey: PrivateKey) {
    super.init(zkappKey);
    // Initialize contract state
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    // Specify that caller should include signature with tx instead of proof. TODO: Is this necessary?
    this.requireSignature();
  }

  // Temporary second init method used to initialize nftHash and endorserHash.
  @method customInit(nftHash: Field, endorserHash: Field) {
    this.nftHash.set(nftHash);
    this.endorserHash.set(endorserHash);
  }

  @method verify(
    oracleNftHash: Field,
    oracleEndorserHash: Field,
    signature: Signature
  ) {
    // Get the oracle public key from the contract state
    const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(oraclePublicKey);

    // Get the NFT Hash from the contract state
    const onchainNftHash = this.nftHash.get();
    this.nftHash.assertEquals(onchainNftHash);

    // Get the endorser's Twitter handle from the contract state
    const onchainEndorserHash = this.endorserHash.get();
    this.endorserHash.assertEquals(onchainEndorserHash);

    // Evaluate whether the signature is valid for the provided data
    const validSignature = signature.verify(oraclePublicKey, [
      oracleNftHash,
      oracleEndorserHash,
    ]);
    validSignature.assertTrue();

    // Evaluate whether the NFT ID from the oracle corresponds to the one commited onchain
    onchainNftHash.assertEquals(oracleNftHash);

    // Evaluate whether the endorser ID from the oracle corresponds to the one commited onchain
    onchainEndorserHash.assertEquals(oracleEndorserHash);

    // Set the onchain flag to true
    this.isEndorsed.set(Bool(true));

    // Emit an event containing the verified endorser's ID
    this.emitEvent('verified', oracleEndorserHash);
  }
}
