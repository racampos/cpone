var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Permissions,
  PublicKey,
  Signature,
  Bool,
} from 'snarkyjs';
// The public key of our trusted data provider
const ORACLE_PUBLIC_KEY =
  'B62qqVT16fNj4nAkCApWUKyr4YVxuunbUSuXfM4gRVDKveEmjsSNWVS';
export class Cpone extends SmartContract {
  constructor() {
    super(...arguments);
    // Define contract state
    this.oraclePublicKey = State();
    this.nftHash = State();
    this.endorserHash = State();
    this.isEndorsed = State();
    // Define contract events
    this.events = {
      verified: Field,
    };
  }
  deploy(args) {
    super.deploy(args);
    this.account.permissions.set({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }
  init() {
    super.init();
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    this.requireSignature();
  }
  setNftHash(nftHash) {
    this.isEndorsed.assertEquals(Bool(false));
    this.nftHash.set(nftHash);
  }
  setEndorserHash(endorserHash) {
    this.isEndorsed.assertEquals(Bool(false));
    this.endorserHash.set(endorserHash);
  }
  verify(oracleNftHash, oracleEndorserHash, signature) {
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
__decorate(
  [state(PublicKey), __metadata('design:type', Object)],
  Cpone.prototype,
  'oraclePublicKey',
  void 0
);
__decorate(
  [state(Field), __metadata('design:type', Object)],
  Cpone.prototype,
  'nftHash',
  void 0
);
__decorate(
  [state(Field), __metadata('design:type', Object)],
  Cpone.prototype,
  'endorserHash',
  void 0
);
__decorate(
  [state(Bool), __metadata('design:type', Object)],
  Cpone.prototype,
  'isEndorsed',
  void 0
);
__decorate(
  [
    method,
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  Cpone.prototype,
  'init',
  null
);
__decorate(
  [
    method,
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Field]),
    __metadata('design:returntype', void 0),
  ],
  Cpone.prototype,
  'setNftHash',
  null
);
__decorate(
  [
    method,
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Field]),
    __metadata('design:returntype', void 0),
  ],
  Cpone.prototype,
  'setEndorserHash',
  null
);
__decorate(
  [
    method,
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Field, Field, Signature]),
    __metadata('design:returntype', void 0),
  ],
  Cpone.prototype,
  'verify',
  null
);
//# sourceMappingURL=Cpone.js.map
