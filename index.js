const bip39 = require("bip39");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const { hdkey } = require("ethereumjs-wallet");
const bitcoin = require("bitcoinjs-lib");
const { Keypair } = require("@solana/web3.js");
const { derivePath } = require("ed25519-hd-key");
const { TezosToolkit } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const inquirer = require("inquirer");
const Table = require("cli-table3");
const figlet = require("figlet");
const bip32 = BIP32Factory(ecc);

async function generateSeedPhrase() {
  const mnemonic = bip39.generateMnemonic();
  return mnemonic;
}

async function generateEthereumWallet(mnemonic, index) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const hdWallet = hdkey.fromMasterSeed(seed);
  const key = hdWallet.derivePath(`m/44'/60'/0'/0/${index}`);
  const wallet = key.getWallet();
  const address = `0x${wallet.getAddress().toString("hex")}`;
  const privateKey = wallet.getPrivateKey().toString("hex");
  return { address, privateKey };
}

async function generateBitcoinWallet(mnemonic, index) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
  const path = `m/44'/0'/0'/0/${index}`;
  const child = root.derivePath(path);
  const { address } = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
    network: bitcoin.networks.bitcoin,
  });
  const privateKey = child.toWIF();
  return { address, privateKey };
}

async function generateSolanaWallet(mnemonic, index) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const bip32RootKey = bip32.fromSeed(seed);
  const solKey = await Keypair.fromSeed(
    derivePath(`m/44'/501'/0'/${index}'`, bip32RootKey.toString("hex")).key
  );

  return {
    address: solKey.publicKey.toBase58(),
    privateKey: Buffer.from(solKey.secretKey).toString("hex"),
  };
}

async function generateTezosWallet(mnemonic, index) {
  const path = `m/44'/1729'/0'/${index}'`;
  const signer = await InMemorySigner.fromMnemonic({
    mnemonic: mnemonic,
    derivationPath: path,
  });
  const Tezos = new TezosToolkit();
  Tezos.setProvider({ signer });
  const address = await signer.publicKeyHash();
  const privateKey = await signer.secretKey();
  return { address, privateKey };
}

async function askUserInput() {
  const questions = [
    {
      type: "list",
      name: "network",
      message: "Which network do you want to generate wallets for?",
      choices: ["Ethereum", "Bitcoin", "Solana", "Tezos"],
    },
    {
      type: "input",
      name: "numberOfWallets",
      message: "How many wallets do you want to generate?",
      validate: function (value) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      },
      filter: Number,
    },
    {
      type: "list",
      name: "mnemonicOption",
      message: "Do you want to generate a new mnemonic or use an existing one?",
      choices: ["Generate New", "Use Existing"],
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

  switch (userInputs.network) {
    case "Ethereum":
      for (let i = 0; i < userInputs.numberOfWallets; i++) {
        const pair = await generateEthereumWallet(mnemonic, i);
        table.push([pair.address, pair.privateKey]);
      }
      console.clear();
      console.log("Mnemonic is ", mnemonic);
      console.log(table.toString());
      break;
    case "Bitcoin":
      for (let i = 0; i < userInputs.numberOfWallets; i++) {
        const pair = await generateBitcoinWallet(mnemonic, i);
        table.push([pair.address, pair.privateKey]);
      }
      console.clear();
      console.log("Mnemonic is ", mnemonic);
      console.log(table.toString());
      break;
    case "Solana":
      for (let i = 0; i < userInputs.numberOfWallets; i++) {
        const pair = await generateSolanaWallet(mnemonic, i);
        table.push([pair.address, pair.privateKey]);
      }
      console.clear();
      console.log("Mnemonic is ", mnemonic);
      console.log(table.toString());
      break;
    case "Tezos":
      for (let i = 0; i < userInputs.numberOfWallets; i++) {
        const pair = await generateTezosWallet(mnemonic, i);
        table.push([pair.address, pair.privateKey]);
      }
      console.clear();
      console.log("Mnemonic is ", mnemonic);
      console.log(table.toString());
      break;
  }
}

generateWallets();
