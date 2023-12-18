const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");
const network = require("./network");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const config = require("../config");
const bip32 = BIP32Factory(ecc);

function generateDogecoinWallet(mnemonic, index, segwit = false) {
  try {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, network);
    const path = segwit
      ? config.dogecoin.segwitDerivationPath + `${index}`
      : config.dogecoin.derivationPath + `${index}`;
    const child = root.derivePath(path);

    let address;
    if (segwit) {
      // SegWit P2SH-P2WPKH address
      const p2wpkh = bitcoin.payments.p2wpkh({
        pubkey: child.publicKey,
        network: network,
      });
      address = bitcoin.payments.p2sh({
        redeem: p2wpkh,
        network: network,
      }).address;
    } else {
      // Legacy address
      address = bitcoin.payments.p2pkh({
        pubkey: child.publicKey,
        network: network,
      }).address;
    }

    const privateKey = child.toWIF();

    return { address, privateKey };
  } catch (error) {
    console.error("Error generating Dogecoin wallet:", error);
    throw error;
  }
}

module.exports = generateDogecoinWallet;
