/**
 * @author Afreen Ayyoob
 * Script to deploy smart contract 
 * 1. Generating the contract Id
 * 2. Printing the result of functions 
*/
// Importing Dependencies from the Hashgraph Library

const {
    Client,
    Hbar,
    ContractCreateFlow,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    PrivateKey,
} = require("@hashgraph/sdk");
require("dotenv").config({ path: '../.env' });

const Web3 = require("web3");
const web3 = new Web3;

const accountId1 = process.env.ACCOUNT1_ID;
const accountPrivateKey1 = PrivateKey.fromString(process.env.ACCOUNT1_PVKEY);

const client = Client.forTestnet();
client.setOperator(accountId1, accountPrivateKey1);
client.setDefaultMaxTransactionFee(new Hbar(100));

const contractJson = require("./smartcontract.json");

async function deployContract() {
    // This streamlines the creation of a contract by taking the bytecode of the contract and creating the file on Hedera to store the bytecode
    const contractTx = await new ContractCreateFlow()
        .setBytecode(contractJson.bytecode)
        .setGas(100000)
        .execute(client);

    const contractId = (await contractTx.getReceipt(client)).contractId;
    console.log(`Contract with ID: ${contractId} is deployed`);
    return contractId;
}

async function interactWithContractFunction1(contractId) {
    const tx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction(
            "function1",
            new ContractFunctionParameters().addUint16(6).addUint16(7)
        )
        .execute(client);

    let record = await tx.getRecord(client);

    return Buffer.from(record.contractFunctionResult.bytes)
        .toJSON()
        .data.at(-1);
}

async function interactWithContractFunction2(contractId, n) {
    const tx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("function2", new ContractFunctionParameters().addUint16(n))
        .execute(client);

    return Buffer.from(
        (await tx.getRecord(client)).contractFunctionResult.bytes
    )
        .toJSON()
        .data.at(-1);
}

async function main() {
    let contractId = await deployContract();
    let result1 = await interactWithContractFunction1(contractId);
    console.log(`Recieved answer from function 1 is ${result1}`);
    let result2 = await interactWithContractFunction2(contractId, result1);
    console.log(`Recieved answer from function 2 is ${result2}`);

    process.exit();
}

main();