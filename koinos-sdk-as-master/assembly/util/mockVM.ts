import { Protobuf } from "as-proto";
import { System } from "../systemCalls";
import { system_calls, chain, protocol, authority, value } from '@koinos/proto-as';
import { StringBytes } from "./stringBytes";


export namespace MockVM {
  export const METADATA_SPACE = new chain.object_space(true);

  export class MockAuthority {
    autorization_type: authority.authorization_type;
    account: Uint8Array;
    authorized: bool;

    constructor(autorization_type: authority.authorization_type, account: Uint8Array, authorized: bool) {
      this.autorization_type = autorization_type;
      this.account = account;
      this.authorized = authorized;
    }
  }

  /**
    * Set entry point that will be used when calling System.getEntryPoint()
    * @param { u32 } entryPoint entry point to set
    * @example
    * ```ts
    * MockVM.setEntryPoint(0xc3ab8ff1);
    *
    * const entryPoint = System.getEntryPoint();
    * System.log('entryPoint: ' + entryPoint.toString());
    * ```
    */
  export function setEntryPoint(entryPoint: u32): void {
    const entryPointObj = new value.value_type();
    entryPointObj.int32_value = entryPoint;

    System.putObject(METADATA_SPACE, 'entry_point', entryPointObj, value.value_type.encode);
  }

  /**
    * Set contract arguments that will be used when calling System.getContractArguments()
    * @param { Uint8Array } contractArguments contract arguments to set
    * @example
    * ```ts
    * let contractArguments = StringBytes.stringToBytes('myArgs');
    * MockVM.setContractArguments(contractArguments);
    *
    * contractArguments = System.getContractArguments();
    * System.log('contractArguments: ' + (StringBytes.bytesToString(contractArguments)!));
    * ```
    */
  export function setContractArguments(contractArguments: Uint8Array): void {
    System.putBytes(METADATA_SPACE, 'contract_arguments', contractArguments);
  }

  /**
    * Set contract id that will be used when calling System.getContractArguments()
    * @param { Uint8Array } contractId contract id to set
    * @example
    * ```ts
    * let contractId = Base58.decode('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe');
    * MockVM.setContractId(contractId);
    *
    * contractId = System.getContractId();
    * System.log('contractId: ' + Base58.encode(contractId));
    * ```
    */
  export function setContractId(contractId: Uint8Array): void {
    System.putBytes(METADATA_SPACE, 'contract_id', contractId);
  }

  export function setChainId(chainId: Uint8Array): void {
    System.putBytes(METADATA_SPACE, 'chain_id', chainId);
  }

  /**
    * Set head info that will be used when calling System.getHeadInfo()
    * @param { chain.head_info } headInfo head info to set
    * @example
    * ```ts
    * let headInfo = new chain.head_info();
    * headInfo.head_block_time = 123456789;
    * headInfo.last_irreversible_block = 3;
    *
    * MockVM.setHeadInfo(headInfo);
    *
    * headInfo = System.getHeadInfo();
    * System.log('headInfo.head_block_time: ' + headInfo.head_block_time.toString());
    * ```
    */
  export function setHeadInfo(headInfo: chain.head_info): void {
    System.putObject(METADATA_SPACE, 'head_info', headInfo, chain.head_info.encode);
  }

  /**
    * Set entry point that will be used when calling System.getEntryPoint()
    * @param { u64 } lastIrreversibleBlock last irreversible block height to set
    * @example
    * ```ts
    * MockVM.setLastIrreversibleBlock(987654321);
    *
    * const lastIrreversibleBlock = System.getLastIrreversibleBlock();
    * System.log('lastIrreversibleBlock: ' + lastIrreversibleBlock.toString());
    * ```
    */
  export function setLastIrreversibleBlock(lastIrreversibleBlock: u64): void {
    const lastIrreversibleBlockObj = new value.value_type();
    lastIrreversibleBlockObj.uint64_value = lastIrreversibleBlock;

    System.putObject(METADATA_SPACE, 'last_irreversible_block', lastIrreversibleBlockObj, value.value_type.encode);
  }

  /**
    * Set caller data that will be used when calling System.getCaller()
    * @param { chain.caller_data } callerData caller data to set
    * @example
    * ```ts
    * let callerData = new chain.caller_data(Base58.decode('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe'), chain.privilege.user_mode);
    *
    * MockVM.setCaller(callerData);
    *
    * callerData = System.getCaller();
    *
    * System.log('callerData.caller_privilege: ' + callerData.caller_privilege.toString());
    * if (callerData.caller) {
    *   System.log('callerData.caller (b58): ' + Base58.encode(callerData.caller!));
    * }
    * ```
    */
  export function setCaller(callerData: chain.caller_data): void {
    System.putObject(METADATA_SPACE, 'caller', callerData, chain.caller_data.encode);
  }

  /**
    * Set transaction that will be used when calling System.getTransaction() and System.getTransactionField(...)
    * @param { protocol.transaction } transaction transaction to set
    * @example
    * ```ts
    * let transaction = new protocol.transaction();
    * transaction.id = StringBytes.stringToBytes("0x12345");
    *
    * MockVM.setTransaction(transaction);
    *
    * transaction = System.getTransaction();
    *
    * System.log("transaction.id: " + (StringBytes.bytesToString(transaction.id)));
    *
    * let txField = System.getTransactionField('id');
    * if (txField) {
    *   System.log("transaction.id: " + (StringBytes.bytesToString((txField.bytes_value) as Uint8Array) as string));
    * }
    * ```
    */
  export function setTransaction(transaction: protocol.transaction): void {
    System.putObject(METADATA_SPACE, 'transaction', transaction, protocol.transaction.encode);
  }

  /**
    * Set operation that will be used when calling System.getOperation()
    * @param { protocol.operation } operation operation to set
    * @example
    * ```ts
    * let setOperation = new protocol.operation();
    * setOperation.set_system_contract = new protocol.set_system_contract_operation(Base58.decode('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe'), true);
    *
    * MockVM.setOperation(setOperation);
    *
    * const getOperation = System.getOperation();
    * ...
    * ```
    */
  export function setOperation(operation: protocol.operation): void {
    System.putObject(METADATA_SPACE, 'operation', operation, protocol.operation.encode);
  }

  /**
    * Set block that will be used when calling System.getBlock() and System.getBlockField(...)
    * @param { protocol.block } block block to set
    * @example
    * ```ts
    * let block = new protocol.block();
    * block.id = StringBytes.stringToBytes("0x12345");
    *
    * MockVM.setBlock(block);
    *
    * block = System.getBlock();
    *
    * System.log("block.id: " + (StringBytes.bytesToString((block.id) as Uint8Array) as string));
    *
    * let blField = System.getBlockField('id');
    * if (blField) {
    *   System.log("block.id: " + (StringBytes.bytesToString((blField.bytes_value) as Uint8Array) as string));
    * }
    * ```
    */
  export function setBlock(block: protocol.block): void {
    System.putObject(METADATA_SPACE, 'block', block, protocol.block.encode);
  }

  /**
    * Set authorities that will be used when calling System.requireAuthority(...)
    * @param { MockAuthority[] } authorities authorities to set
    * @example
    * ```ts
    * const account = Base58.decode('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe');
    * const auth1 = new MockVM.MockAuthority(authority.authorization_type.contract_call, account, true);
    * const auth2 = new MockVM.MockAuthority(authority.authorization_type.contract_upload, account, false)
    *
    * MockVM.setAuthorities([auth1, auth2]);
    *
    * System.requireAuthority(authority.authorization_type.contract_call, account);
    * ```
    */
  export function setAuthorities(authorities: MockAuthority[]): void {
    const authoritiesListType = new value.list_type();

    for (let index = 0; index < authorities.length; index++) {
      const auth = authorities[index];

      const authorityValueType = new value.value_type();
      authorityValueType.bool_value = auth.authorized;
      authorityValueType.bytes_value = auth.account;
      authorityValueType.int32_value = auth.autorization_type;

      authoritiesListType.values.push(authorityValueType);
    }

    System.putObject(METADATA_SPACE, 'authority', authoritiesListType, value.list_type.encode);
  }

  /**
   * Set system authority that will be used when calling System.requireSystemAuthority(...)
   * @param { bool } authorized
   * ```ts
   * MockVM.setSystemAuthority(true);
   *
   * System.requireSystemAuthority();
   * ```
   */
  export function setSystemAuthority(authorized: bool): void {
    const systemAuthValueType = new value.value_type();
    systemAuthValueType.bool_value = authorized;

    System.putObject(METADATA_SPACE, 'system_authority', systemAuthValueType, value.value_type.encode);
  }

  /**
   * Set results that will be used when calling System.verifyVRFProof(...)
   * @param { Uint8Array[] } verifyVRFProofResults The results are FIFO, so the first System.verifyVRFPRoof(...) used in your code will use the first result you set in callContractResults, the second System.callContract(...) will get the second result, etc...
   * @example
   * ```ts
   MockVM.setVerifyVRFProofResults([false, true]);

   let callRes = System.verifyVRFProof(pubKey, proof, hash, messgae);
   if (callRes) {
     // Will execute
   }

   let callRes = System.verifyVRFProof(pubKey, proof, hash, messgae);
   if (callRes) {
     // Will not execute
   }
   * ```
   */
  export function setVerifyVRFProofResults(verifyVRFProofResults: bool[]): void {
    const verifyVRFProofResultListType = new value.list_type();

    for (let index = 0; index < verifyVRFProofResults.length; index++) {
      const callVerifyVRFProofValueType = new value.value_type();
      callVerifyVRFProofValueType.bool_value = verifyVRFProofResults[index];

      verifyVRFProofResultListType.values.push(callVerifyVRFProofValueType);
    }

    System.putObject(METADATA_SPACE, 'verify_vrf', verifyVRFProofResultListType, value.list_type.encode);
  }

  /**
    * Set call contract results that will be used when calling System.callContract(...)
    * @param { Uint8Array[] } callContractResults The results are FIFO, so the first System.callContract(...) used in your code will use the first result you set in callContractResults, the second System.callContract(...) will get the second result, etc...
    * @example
    * ```ts
    * const callContractResults = new value.list_type();

    const callContractRes1 = Base64.decode('res1');
    const callContractRes2 = Base64.decode('res2');

    MockVM.setCallContractResults([callContractRes1, callContractRes2]);

    let callRes = System.callContract(contract_id, 1, new Uint8Array(0));
    if (callRes) {
      System.log('callRes1: ' + (Base64.encode(callRes as Uint8Array) as string));
    }

    callRes = System.callContract(contract_id, 1, new Uint8Array(0));
    if (callRes) {
      System.log('callRes2: ' + (Base64.encode(callRes as Uint8Array) as string));
    }
    * ```
    */
  export function setCallContractResults(callContractResults: system_calls.exit_arguments[]): void {
    const callContractResultListType = new value.list_type();

    for (let index = 0; index < callContractResults.length; index++) {
      const callContractResultValueType = new value.value_type();
      callContractResultValueType.bytes_value = Protobuf.encode(callContractResults[index], system_calls.exit_arguments.encode);

      callContractResultListType.values.push(callContractResultValueType);

    }

    System.putObject(METADATA_SPACE, 'call_contract_results', callContractResultListType, value.list_type.encode);
  }

  /**
    * Get contract result set when calling System.exit()
    * @returns { Uint8Array | null }
    * @example
    * ```ts
    * System.setContractResult(Base64.decode('res1'));
    *
    * const contractRes = MockVM.getContractResult();
    *
    * if (contractRes) {
    *   System.log('contractRes: ' + (Base64.encode(contractRes as Uint8Array) as string));
    * }
    * ```
    */
  export function getContractResult(): Uint8Array | null {
    const bytes = System.getBytes(METADATA_SPACE, 'contract_result');

    return bytes;
  }

  /**
   * Get error message string after a VM error
   * @returns  { Uint8Array | null }
   * @example
   * ```ts
   * const errorMessage = MockVM.getErrorMessage();
   * ```
   */
  export function getErrorMessage(): String | null {
    const bytes = System.getBytes(METADATA_SPACE, 'error_message');

    return StringBytes.bytesToString(bytes);
  }

  /**
    * Get exit code set when calling System.exitContract(...)
    * @returns { string[] }
    * @example
    * ```ts
    * System.exit(0);
    *
    * const exitCode = MockVM.getExitCode();
    *
    * if (exitCode) {
    *   System.log('exitCode: ' + exitCode.toString());
    * }
    * ```
    */
  export function getExitCode(): i32 {
    const bytes = System.getBytes(METADATA_SPACE, 'exit_code');

    if (bytes) {
      const valueType = Protobuf.decode<value.value_type>(bytes, value.value_type.decode);
      return valueType.int32_value;
    }

    return -1;
  }

  /**
    * Get logs set when calling System.log()
    * @returns { string[] }
    * @example
    * ```ts
    * System.log('log 1');
    * System.log('log 2');
    *
    * const logs = MockVM.getLogs();
    *
    * for (let index = 0; index < logs.length; index++) {
    *   const log = logs;
    * }
    * ```
    */
  export function getLogs(): string[] {
    const logs: string[] = [];

    const logsBytes = System.getBytes(METADATA_SPACE, 'logs');

    if (logsBytes) {
      const logsListType = Protobuf.decode<value.list_type>(logsBytes, value.list_type.decode);

      for (let index = 0; index < logsListType.values.length; index++) {
        const log = logsListType.values[index];

        logs.push(log.string_value);
      }
    }

    return logs;
  }

  /**
   * Remove the current logs
   * @example
   * ```ts
   * System.log('log 1');
   * System.log('log 2');
   * MockVM.clearLogs();
   * System.log('log 3');
   * System.log('log 4');
   * console.log(MockVM.getLogs().join(","));
   * // log 3,log 4
   * ```
   */
  export function clearLogs(): void {
    System.putBytes(METADATA_SPACE, 'logs', new Uint8Array(0));
  }

  /**
    * Get logs set when calling System.log()
    * @returns { string[] }
    * @example
    * ```ts
    * System.Event('my-event-1', Base64.decode('event data'), [Base58.decode('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe')]);
    * System.Event('my-event-2', Base64.decode('event data 2'), [Base58.decode('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe')]);
    *
    * const events = MockVM.getEvents();
    *
    * for (let index = 0; index < events.length; index++) {
    *   const event = events[index];
    *
    *   System.log(event.name)
    *   System.log(event.data.toString())
    *
    *   event.impacted.forEach(acct => {
    *     System.log(Base58.encode(acct));
    *   });
    * }
    * ```
    */
  export function getEvents(): system_calls.event_arguments[] {
    const events: system_calls.event_arguments[] = [];

    const eventsBytes = System.getBytes(METADATA_SPACE, 'events');

    if (eventsBytes) {
      const eventsListType = Protobuf.decode<value.list_type>(eventsBytes, value.list_type.decode);

      for (let index = 0; index < eventsListType.values.length; index++) {
        const eventBytes = eventsListType.values[index];
        events.push(Protobuf.decode<system_calls.event_arguments>(eventBytes.bytes_value, system_calls.event_arguments.decode));
      }
    }

    return events;
  }

  /**
    * Reset the MockVM database
    * @example
    * ```ts
    * MockVM.reset();
    * ```
    */
  export function reset(): void {
    System.putBytes(METADATA_SPACE, 'reset', new Uint8Array(0));
  }

  /**
    * Rrestore the backup made via MockVM.commitTransaction()
    * @example
    * ```ts
    * MockVM.rollbackTransaction();
    * ```
    */
  export function rollbackTransaction(): void {
    System.putBytes(METADATA_SPACE, 'rollback_transaction', new Uint8Array(0));
  }

  /**
    * Backup the database so that it can be rolledback to the backedup state if the transaction reverts
    * @example
    * ```ts
    * MockVM.commitTransaction();
    * ```
    */
  export function commitTransaction(): void {
    System.putBytes(METADATA_SPACE, 'commit_transaction', new Uint8Array(0));
  }
}
