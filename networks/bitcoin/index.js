const bip39 = require("bip39");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bitcoin = require("bitcoinjs-lib");
const bip32 = BIP32Factory(ecc);
const config = require("../config");

/**
 * Generates a Bitcoin wallet.
 * @param {string} mnemonic - The mnemonic phrase.
 * @param {number} index - The index of the wallet.
 * @returns {Object} An object containing the wallet's address and private key.
 */
function generateBitcoinWallet(mnemonic, index) {
  try {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
    const path = config.bitcoin.derivationPath + `${index}`;
    const child = root.derivePath(path);
    const { address } = bitcoin.payments.p2pkh({
      pubkey: child.publicKey,
      network: bitcoin.networks.bitcoin,
    });
    const privateKey = child.toWIF();
    return { address, privateKey };
  } catch (error) {
    console.error("Error generating Bitcoin wallet:", error);
  }
}

module.exports = generateBitcoinWallet;
