const bip39 = require("bip39");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const { Keypair } = require("@solana/web3.js");
const { derivePath } = require("ed25519-hd-key");
const config = require("../config");

/**
 * Generates a Solana wallet.
 * @param {string} mnemonic - The mnemonic phrase.
 * @param {number} index - The index of the wallet.
 * @returns {Object} An object containing the wallet's address and private key.
 */
function generateSolanaWallet(mnemonic, index) {
  try {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const bip32RootKey = bip32.fromSeed(seed);
    const solKey = Keypair.fromSeed(
      derivePath(
        config.solana.derivationPath + `${index}'`,
        bip32RootKey.toString("hex")
      ).key
    );

    return {
      address: solKey.publicKey.toBase58(),
      privateKey: Buffer.from(solKey.secretKey).toString("hex"),
    };
  } catch (error) {
    console.error("Error generating Solana wallet:", error);
  }
}

module.exports = generateSolanaWallet;
