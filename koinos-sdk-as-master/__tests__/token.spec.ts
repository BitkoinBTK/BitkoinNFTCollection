import { Base58, MockVM, Protobuf, StringBytes, Token } from "../index";
import { token, system_calls, chain } from '@koinos/proto-as';


const mockTokenContractIdAccount = Base58.decode('1DQzuCcTKacbs9GGScFTU1Hc8BsyARTPqe');
const mockAccount1 = Base58.decode('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe');
const mockAccount2 = Base58.decode('1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqE');
const mockId = StringBytes.stringToBytes("0x12345");

describe('token', () => {
  it('should get the name of a token', () => {
    const tokenName = 'Token';
    const nameRes = new token.name_result(tokenName);
    MockVM.setCallContractResults([
      new system_calls.exit_arguments(0, new chain.result(Protobuf.encode(nameRes, token.name_result.encode)))]);

    const tkn = new Token(mockTokenContractIdAccount);
    const name = tkn.name();

    expect(name).toBe(tokenName);
  });

  it('should get the symbol of a token', () => {
    const tokenSymbol = 'TKN';
    const symbolRes = new token.symbol_result(tokenSymbol);
    MockVM.setCallContractResults([
      new system_calls.exit_arguments(0, new chain.result(Protobuf.encode(symbolRes, token.symbol_result.encode)))]);

    const tkn = new Token(mockTokenContractIdAccount);
    const symbol = tkn.symbol();

    expect(symbol).toBe(tokenSymbol);
  });

  it('should get the decimals of a token', () => {
    const tokenDecimals = 8;
    const decimalsRes = new token.decimals_result(tokenDecimals);
    MockVM.setCallContractResults([
      new system_calls.exit_arguments(0, new chain.result(Protobuf.encode(decimalsRes, token.decimals_result.encode)))]);

    const tkn = new Token(mockTokenContractIdAccount);
    const decimals = tkn.decimals();

    expect(decimals).toBe(tokenDecimals);
  });

  it('should get the total supply of a token', () => {
    const tokenTotalSupply = 1008767;
    const totalSupplyRes = new token.total_supply_result(tokenTotalSupply);
    MockVM.setCallContractResults([
      new system_calls.exit_arguments(0, new chain.result(Protobuf.encode(totalSupplyRes, token.total_supply_result.encode)))]);

    const tkn = new Token(mockTokenContractIdAccount);
    const totalSupply = tkn.totalSupply();

    expect(totalSupply).toBe(tokenTotalSupply);
  });

  it('should get the balance of an account', () => {
    const accountBalance = 76231876;
    const balanceOfRes = new token.balance_of_result(accountBalance);
    MockVM.setCallContractResults([
      new system_calls.exit_arguments(0, new chain.result(Protobuf.encode(balanceOfRes, token.balance_of_result.encode)))]);

    const tkn = new Token(mockTokenContractIdAccount);
    const balance = tkn.balanceOf(mockAccount1);

    expect(balance).toBe(accountBalance);
  });

  it('should transfer a token', () => {
    let transferRes = new token.transfer_result();
    MockVM.setCallContractResults([
      new system_calls.exit_arguments(0, new chain.result(Protobuf.encode(transferRes, token.transfer_result.encode)))]);

    const tkn = new Token(mockTokenContractIdAccount);
    let transfer = tkn.transfer(mockAccount1, mockAccount2, 167);

    expect(transfer).toBe(true);
  });

  it('should/not mint a token', () => {
    let mintRes = new token.mint_result();
    MockVM.setCallContractResults([
      new system_calls.exit_arguments(0, new chain.result(Protobuf.encode(mintRes, token.mint_result.encode)))]);

    const tkn = new Token(mockTokenContractIdAccount);
    let mint = tkn.mint(mockAccount1, 167);

    expect(mint).toBe(true);
  });

  it('should burn a token', () => {
    let burnRes = new token.burn_result();
    MockVM.setCallContractResults([
      new system_calls.exit_arguments(0, new chain.result(Protobuf.encode(burnRes, token.burn_result.encode)))]);

    const tkn = new Token(mockTokenContractIdAccount);
    let burn = tkn.burn(mockAccount1, 167);

    expect(burn).toBe(true);
  });
});
