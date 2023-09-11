import { Arrays, Base58, MockVM, StringBytes, System, Crypto, Base64 } from "../index";
import { chain, protocol, authority, error, system_calls } from '@koinos/proto-as';

import * as TestObject from "./test";

const mockAccount = Base58.decode('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe');
const mockAccount2 = Base58.decode('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqE');
const mockId = Arrays.fromHexString("0x1220d15a1c2ea198178ae860c1284a7ec929e7804b15651b9f4303dc1fc6a8eefd27");
const mockStr = 'Hello World!';
const mockStrBytes = StringBytes.stringToBytes(mockStr);

describe('SystemCalls', () => {
  beforeEach(() => {
    MockVM.reset();
  });

  it('should get the chain id', () => {
    const chainId = mockAccount;

    MockVM.setChainId(chainId);

    expect(Arrays.equal(System.getChainId(), chainId)).toBe(true);
  });

  it('should get the head info', () => {
    const setHeadInfo = new chain.head_info();
    setHeadInfo.head_block_time = 123456789;
    setHeadInfo.last_irreversible_block = 3;

    MockVM.setHeadInfo(setHeadInfo);

    const getHeadInfo = System.getHeadInfo();

    expect(getHeadInfo.head_block_time).toBe(setHeadInfo.head_block_time);
    expect(getHeadInfo.last_irreversible_block).toBe(setHeadInfo.last_irreversible_block);
  });

  it('should get the transaction', () => {
    let setTransaction = new protocol.transaction(mockId);

    MockVM.setTransaction(setTransaction);

    const getTransaction = System.getTransaction();

    expect(Arrays.equal(getTransaction.id, setTransaction.id)).toBe(true);
  });

  it('should get the transaction field', () => {
    let setTransaction = new protocol.transaction(mockId);

    MockVM.setTransaction(setTransaction);

    const getTransaction = System.getTransactionField('id');

    expect(Arrays.equal(getTransaction!.bytes_value, setTransaction.id)).toBe(true);
  });

  it('should get the operation', () => {
    let setOperation = new protocol.operation();
    setOperation.set_system_contract = new protocol.set_system_contract_operation(mockAccount, true);

    MockVM.setOperation(setOperation);

    const getOperation = System.getOperation();

    expect(Arrays.equal(getOperation.set_system_contract!.contract_id, setOperation.set_system_contract!.contract_id)).toBe(true);
    expect(getOperation.set_system_contract!.system_contract).toBe(true);
  });

  it('should get the block', () => {
    let setBlock = new protocol.block(mockId);

    MockVM.setBlock(setBlock);

    const getBlock = System.getBlock();

    expect(Arrays.equal(getBlock.id, setBlock.id)).toBe(true);
  });

  it('should get the block field', () => {
    let setBlock = new protocol.block(mockId);

    MockVM.setBlock(setBlock);

    const getBlock = System.getBlockField('id');

    expect(getBlock).not.toBeNull();
    expect(Arrays.equal(getBlock!.bytes_value, setBlock.id)).toBe(true);
  });

  it('should get the last irreversible block', () => {
    const setLastIrreversibleBlock = 987654321;
    MockVM.setLastIrreversibleBlock(setLastIrreversibleBlock);

    const getLastIrreversibleBlock = System.getLastIrreversibleBlock();

    expect(getLastIrreversibleBlock).toBe(setLastIrreversibleBlock);
  });

  it('should require authorities', () => {
    const auth1 = new MockVM.MockAuthority(authority.authorization_type.contract_call, mockAccount, true);
    const auth2 = new MockVM.MockAuthority(authority.authorization_type.contract_upload, mockAccount, false);
    const auth3 = new MockVM.MockAuthority(authority.authorization_type.contract_upload, mockAccount2, true);

    MockVM.setAuthorities([auth1, auth2, auth3]);

    // the System.requireAuthority that will fail will revert the database's VM, so we need to commit the transaction
    // this will backup the database
    MockVM.commitTransaction();

    expect(() => {
      System.requireAuthority(authority.authorization_type.contract_call, mockAccount);
    }).not.toThrow();

    expect(() => {
      System.requireAuthority(authority.authorization_type.contract_upload, mockAccount2);
    }).not.toThrow();

    expect(() => {
      // will print "account 1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe has not authorized action"
      System.requireAuthority(authority.authorization_type.contract_upload, mockAccount);
    }).toThrow();

    expect(() => {
      // will print "account 1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe has not authorized action"
      System.requireAuthority(authority.authorization_type.transaction_application, mockAccount);
    }).toThrow();
  });

  it('should log', () => {
    System.log(mockStr);

    const logs = MockVM.getLogs();

    expect(logs[0]).toBe(mockStr);
  });

  it('should emit an event', () => {
    const eventName = mockStr;
    const eventData = StringBytes.stringToBytes(eventName);
    const impacted = [mockAccount];
    System.event(eventName, eventData, impacted);

    const events = MockVM.getEvents();

    events[0].impacted.forEach(imp => {
      System.log(Base58.encode(imp));
    });

    expect(events[0].name).toBe(mockStr);
    expect(Arrays.equal(events[0].data, eventData)).toBe(true);
    expect(Arrays.equal(events[0].impacted[0], mockAccount)).toBe(true);
  });

  it('should hash', () => {
    const expectedSha1 = Arrays.fromHexString('0x12142ef7bde608ce5404e97d5f042f95f89f1c232871');
    const sha1 = System.hash(Crypto.multicodec.sha1, mockStrBytes);

    expect(sha1).not.toBeNull();
    if (sha1) {
      expect(Arrays.equal(sha1, expectedSha1)).toBe(true);
    }

    const expectedSha256 = Arrays.fromHexString('0x12207f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
    const sha256 = System.hash(Crypto.multicodec.sha2_256, mockStrBytes);

    expect(sha256).not.toBeNull();
    if (sha256) {
      expect(Arrays.equal(sha256, expectedSha256)).toBe(true);
    }

    const expectedSha512 = Arrays.fromHexString('0x1240861844d6704e8573fec34d967e20bcfef3d424cf48be04e6dc08f2bd58c729743371015ead891cc3cf1c9d34b49264b510751b1ff9e537937bc46b5d6ff4ecc8');
    const sha512 = System.hash(Crypto.multicodec.sha2_512, mockStrBytes);

    expect(sha512).not.toBeNull();
    if (sha512) {
      expect(Arrays.equal(sha512, expectedSha512)).toBe(true);
    }

    const expectedRipemd160 = Arrays.fromHexString('0x12148476ee4631b9b30ac2754b0ee0c47e161d3f724c');
    const ripemd160 = System.hash(Crypto.multicodec.ripemd_160, mockStrBytes);

    expect(ripemd160).not.toBeNull();
    if (ripemd160) {
      expect(Arrays.equal(ripemd160, expectedRipemd160)).toBe(true);
    }

    const expectedKeccak256 = Arrays.fromHexString('0x12203ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0');
    const keccak256 = System.hash(Crypto.multicodec.keccak_256, mockStrBytes);

    expect(keccak256).not.toBeNull();
    if (keccak256) {
      expect(Arrays.equal(keccak256, expectedKeccak256)).toBe(true);
    }

    expect(() => {
      System.hash(-1, mockStrBytes);
    }).toThrow();

    expect(MockVM.getExitCode()).toBe(error.error_code.unknown_hash_code);
  });

  it('should recover a public key', () => {
    const message = 'hello-world';
    const signatureData = Base64.decode('IHhJwlD7P-o6x7L38den1MnumUhnYmNhTZhIUQQhezvEMf7rx89NbIIioNCIQSk1PQYdQ9mOI4-rDYiwO2pLvM4=');
    const digest = System.hash(Crypto.multicodec.sha2_256, StringBytes.stringToBytes(message));
    const recoveredKey = System.recoverPublicKey(signatureData, digest!);
    const addr = Crypto.addressFromPublicKey(recoveredKey!);

    expect(Base58.encode(addr)).toBe('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe');

    expect(() => {
      System.recoverPublicKey(Base64.decode('IHhJwlD7P-o6x7L38den1MnumUhnYmNhTZhIUQQhezvEMf7rx89NbIIioNCIQSk1PQYdQ9mOI4-rDYiwO2pLvM4='), System.hash(Crypto.multicodec.sha2_256, StringBytes.stringToBytes(message))!, -1);
    }).toThrow();

    expect(MockVM.getExitCode()).toBe(error.error_code.unknown_dsa);
  });

  it('should verify a signature', () => {
    const message = 'hello-world';
    const signatureData = Base64.decode('IHhJwlD7P-o6x7L38den1MnumUhnYmNhTZhIUQQhezvEMf7rx89NbIIioNCIQSk1PQYdQ9mOI4-rDYiwO2pLvM4=');
    let digest = System.hash(Crypto.multicodec.sha2_256, StringBytes.stringToBytes(message));
    const recoveredKey = System.recoverPublicKey(signatureData, digest!);

    let verify = System.verifySignature(recoveredKey!, signatureData, digest!);

    expect(verify).toBe(true);

    digest = System.hash(Crypto.multicodec.sha2_256, StringBytes.stringToBytes('message'));
    verify = System.verifySignature(recoveredKey!, signatureData, digest!);

    expect(verify).toBe(false);
  });

  it('should should call a contract', () => {
    const callRes1 = mockAccount;
    const callRes2 = mockAccount2;

    MockVM.setCallContractResults([
      new system_calls.exit_arguments(0, new chain.result(callRes1)),
      new system_calls.exit_arguments(0, new chain.result(callRes2))
    ]);


    let callRes = System.call(mockAccount, 1, new Uint8Array(0));

    expect(callRes.code).toBe(0);
    expect(Arrays.equal(callRes.res.object, mockAccount)).toBe(true);

    callRes = System.call(mockAccount, 1, new Uint8Array(0));

    expect(callRes.code).toBe(0);
    expect(Arrays.equal(callRes.res.object, mockAccount2)).toBe(true);
  });

  it('should get the contract arguments', () => {
    const setEntryPoint = 0xc3ab8ff1;
    MockVM.setEntryPoint(0xc3ab8ff1);
    MockVM.setContractArguments(mockAccount);

    const getContractArgs = System.getArguments();

    expect(Arrays.equal(getContractArgs.args, mockAccount)).toBe(true);
    expect(getContractArgs.entry_point).toBe(setEntryPoint);
  });

  it('should get the contract id', () => {
    MockVM.setContractId(mockAccount);

    const getContractId = System.getContractId();

    expect(Arrays.equal(getContractId, mockAccount)).toBe(true);
  });

  it('should get the head info', () => {
    const setHeadInfo = new chain.head_info();
    setHeadInfo.head_block_time = 123456789;
    setHeadInfo.last_irreversible_block = 3;

    MockVM.setHeadInfo(setHeadInfo);

    const getHeadInfo = System.getHeadInfo();

    expect(getHeadInfo.head_block_time).toBe(setHeadInfo.head_block_time);
    expect(getHeadInfo.last_irreversible_block).toBe(setHeadInfo.last_irreversible_block);
  });

  it('should get the caller', () => {
    const setCallerData = new chain.caller_data(mockAccount, chain.privilege.user_mode);

    MockVM.setCaller(setCallerData);

    const getCallerData = System.getCaller();

    expect(getCallerData.caller_privilege).toBe(setCallerData.caller_privilege);
    expect(Arrays.equal(getCallerData.caller, mockAccount)).toBe(true);
  });

  it('should exit a contract', () => {
    expect(() => {
      System.exit(0);
    }).toThrow();

    expect(MockVM.getExitCode()).toBe(0);

    const messageA = "my message A";

    expect(() => {
      System.exit(-2, StringBytes.stringToBytes(messageA));
    }).toThrow();

    expect(MockVM.getExitCode()).toBe(-2);
    expect(MockVM.getErrorMessage()).toBe(messageA);

    const messageB = "my message B";

    expect(() => {
      System.fail(messageB);
    }).toThrow();

    expect(MockVM.getExitCode()).toBe(-1);
    expect(MockVM.getErrorMessage()).toBe(messageB);

    const messageC = "my message C";

    expect(() => {
      System.revert(messageC);
    }).toThrow();

    expect(MockVM.getExitCode()).toBe(1);
    expect(MockVM.getErrorMessage()).toBe(messageC);
  });

  it('should put and get bytes', () => {
    const objSpace = new chain.object_space(false, mockAccount, 1);

    System.putBytes(objSpace, 'testKey1', StringBytes.stringToBytes('testValue1'));

    let bytes = System.getBytes(objSpace, 'testKey1');

    expect(bytes).not.toBeNull();
    expect(StringBytes.bytesToString(bytes)).toBe('testValue1');

    const contractSpace2 = new chain.object_space(false, mockAccount, 2);
    System.putBytes(contractSpace2, StringBytes.stringToBytes('testKey'), StringBytes.stringToBytes('testValue2'));

    bytes = System.getBytes(contractSpace2, 'testKey');

    expect(bytes).not.toBeNull();
    expect(StringBytes.bytesToString(bytes)).toBe('testValue2');

    bytes = System.getBytes(contractSpace2, StringBytes.stringToBytes('testKey'));

    expect(bytes).not.toBeNull();
    expect(StringBytes.bytesToString(bytes)).toBe('testValue2');

    bytes = System.getBytes(contractSpace2, StringBytes.stringToBytes('testKey2'));

    expect(bytes).toBeNull();

    System.putBytes(objSpace, 'testKey3', StringBytes.stringToBytes('testValue3'));
    System.putBytes(objSpace, 'testKey2', StringBytes.stringToBytes('testValue2'));

    let obj = System.getPrevBytes(objSpace, 'testKey2');
    expect(obj).not.toBeNull();
    expect(StringBytes.bytesToString(obj!.key)).toBe('testKey1');
    expect(StringBytes.bytesToString(obj!.value)).toBe('testValue1');

    obj = System.getPrevBytes(objSpace, 'testKey1');
    expect(obj).toBeNull();

    obj = System.getNextBytes(objSpace, 'testKey2');
    expect(obj).not.toBeNull();
    expect(StringBytes.bytesToString(obj!.key)).toBe('testKey3');
    expect(StringBytes.bytesToString(obj!.value)).toBe('testValue3');

    obj = System.getNextBytes(objSpace, 'testKey3');
    expect(obj).toBeNull();
  });

  it('should put and get objects', () => {
    const objSpace = new chain.object_space(false, mockAccount, 1);
    let obj = new TestObject.test_object(300);

    System.putObject<string, TestObject.test_object>(objSpace, 'key3', obj, TestObject.test_object.encode);
    obj.value = 100;
    System.putObject<string, TestObject.test_object>(objSpace, 'key1', obj, TestObject.test_object.encode);
    obj.value = 200;
    System.putObject<string, TestObject.test_object>(objSpace, 'key2', obj, TestObject.test_object.encode);

    const obj1 = System.getObject<string, TestObject.test_object>(objSpace, 'key2', TestObject.test_object.decode);

    expect(obj1).not.toBeNull();
    expect(obj1!.value).toBe(200);

    let obj2 = System.getNextObject<string, TestObject.test_object>(objSpace, 'key2', TestObject.test_object.decode);

    expect(obj2).not.toBeNull();
    expect(obj2!.value.value).toBe(300);
    expect(StringBytes.bytesToString(obj2!.key)).toBe('key3');

    obj2 = System.getPrevObject<string, TestObject.test_object>(objSpace, 'key2', TestObject.test_object.decode);

    expect(obj2).not.toBeNull();
    expect(obj2!.value.value).toBe(100);
    expect(StringBytes.bytesToString(obj2!.key)).toBe('key1');

    obj2 = System.getPrevObject<string, TestObject.test_object>(objSpace, 'key1', TestObject.test_object.decode);

    expect(obj2).toBeNull();

    obj2 = System.getNextObject<string, TestObject.test_object>(objSpace, 'key3', TestObject.test_object.decode);

    expect(obj2).toBeNull();
  });
});
