# Hedera Hashgraph Services for Beginner

This project is a Node.js based application that provides a set of scripts to interact with the Hedera Hashgraph network. The scripts are designed to perform various actions such as creating new accounts, transferring HBAR, querying account information, creating and managing fungible tokens, multi-signature transactions, consensus, scheduling transactions, and interacting with smart contracts.


## Getting Started 

### Prerequisites


- Node.js (v14 or higher) 
- Hedera Hashgraph account 
- Hedera Hashgraph Testnet account (for testing) 

### Installation

- Clone this repository or download the code as a zip file. `git clone https://github.com/afreen-ayyoob01/hedera-exam-afreen.git` 
- Go to the `hedera-exam-afreen.git` directory: `cd hedera-exam-afreen.git` 
- Install dependencies by running `npm install`. 
- Create a `.env` file in the root directory of the project and add your Hedera Hashgraph account details. 
- Run the scripts by executing `node <script-name>` (replace `<script-name>` with the name of the script you want to execute). 

## Usage

To use this application, you'll need to have Node.js and the @hashgraph/sdk and dotenv modules installed. Once you have those dependencies installed, you can clone this repository and run the scripts using the `node` command. 

Here are the available scripts: 

### Account Scripts

- `node account.js`: Create new accounts 

### Fungible Token Scripts

- `node createToken.js`: Create a new fungible token 
- `node func_calling.js`: Calling all other functions from associate_transfer.js and pause_unpause.js file


### Multi-Signature Scripts

- `node multisign.js`: Perform a multi-signature transaction 

### Consensus Scripts 
- `node consensus.js`: Perform a consensus transaction 

### Scheduled Transactions Scripts 
- `node schedule.js`: Schedule a transaction to generate schedule id 
- `node schedulesign.js`: Sign a scheduled transaction

### Smart Contract Scripts 
- `node smartcontract.js`: Interact with a smart contract 

## License 

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

