#!/usr/bin/env node

const bip39 = require("bip39");
const generateEthereumWallet = require("./networks/ethereum");
const generateBitcoinWallet = require("./networks/bitcoin");
const generateSolanaWallet = require("./networks/solana");
const generateTezosWallet = require("./networks/tezos");
const generateLitecoinWallet = require("./networks/litecoin");
const generateDogecoinWallet = require("./networks/dogecoin");
const inquirer = require("inquirer");
const Table = require("cli-table3");
const figlet = require("figlet");

async function generateSeedPhrase() {
  const mnemonic = bip39.generateMnemonic();
  return mnemonic;
}

async function askUserInput() {
  const questions = [
    {
      type: "list",
      name: "network",
      message: "Which network do you want to generate wallets for?",
      choices: [
        "Ethereum",
        "Bitcoin",
        "Solana",
        "Tezos",
        "Litecoin",
        "Dogecoin",
      ],
      default: "Ethereum",
    },
    {
      type: "input",
      name: "numberOfWallets",
      message: "How many wallets do you want to generate?",
      default: 1,
      validate: (value) => {
        const valid = !isNaN(parseInt(value)) && parseInt(value) > 0;
        return valid || "Please enter a positive number";
      },
      filter: Number,
    },
    {
      type: "list",
      name: "mnemonicOption",
      message: "Do you want to generate a new mnemonic or use an existing one?",
      choices: ["Generate New", "Use Existing"],
      default: "Generate New",
    },
    {
      type: "input",
      name: "mnemonic",
      message: "Enter your existing mnemonic:",
      when: function (answers) {
        return answers.mnemonicOption === "Use Existing";
      },
      validate: function (value) {
        var valid = bip39.validateMnemonic(value);
        return valid || "Please enter a valid mnemonic";
      },
    },
  ];

  return inquirer.prompt(questions);
}

async function generateWallets() {
  console.log(figlet.textSync("Wallet Forge", { horizontalLayout: "full" }));

  const userInputs = await askUserInput();
  const mnemonic =
    userInputs.mnemonicOption === "Generate New"
      ? await generateSeedPhrase()
      : userInputs.mnemonic;

  const table = new Table({
    head: ["Wallet", "Private Key"],
  });

  for (let i = 0; i < userInputs.numberOfWallets; i++) {
    let walletDetails;

    switch (userInputs.network) {
      case "Ethereum":
        walletDetails = await generateEthereumWallet(mnemonic, i);
        break;
      case "Bitcoin":
        walletDetails = await generateBitcoinWallet(mnemonic, i);
        break;
      case "Solana":
        walletDetails = await generateSolanaWallet(mnemonic, i);
        break;
      case "Tezos":
        walletDetails = await generateTezosWallet(mnemonic, i);
        break;
      case "Litecoin":
        walletDetails = await generateLitecoinWallet(mnemonic, i);
        break;
      case "Dogecoin":
        walletDetails = await generateDogecoinWallet(mnemonic, i);
        break;
    }

    if (walletDetails) {
      table.push([walletDetails.address, walletDetails.privateKey]);
    }
  }

  console.clear();
  console.log("Mnemonic is ", mnemonic);
  console.log(table.toString());
}

generateWallets();
