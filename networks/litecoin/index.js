const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");
const network = require("./network");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const config = require("../config");
const bip32 = BIP32Factory(ecc);

/**
 * Generates a Litcoin wallet.
 * @param {string} mnemonic - The mnemonic phrase.
 * @param {number} index - The index of the wallet.
 * @returns {Object} An object containing the wallet's address and private key.
 */
function generateLitecoinWallet(mnemonic, index) {
  try {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, network);
    const path = config.litecoin.derivationPath + `${index}`;
    const child = root.derivePath(path);
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: network,
    });
    const privateKey = child.toWIF();

    return { address, privateKey };
  } catch (error) {
    console.error("Error generating Litecoin wallet:", error);
    throw error;
  }
}

module.exports = generateLitecoinWallet;
