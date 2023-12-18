const { TezosToolkit } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const config = require("../config");

/**
 * Generates a Tezos wallet.
 * @param {string} mnemonic - The mnemonic phrase.
 * @param {number} index - The index of the wallet.
 * @returns {Object} An object containing the wallet's address and private key.
 */
async function generateTezosWallet(mnemonic, index) {
  try {
    const path = config.tezos.derivationPath + `${index}'`;
    const signer = InMemorySigner.fromMnemonic({
      mnemonic: mnemonic,
      derivationPath: path,
    });
    const Tezos = new TezosToolkit();
    Tezos.setProvider({ signer });
    const address = await signer.publicKeyHash();
    const privateKey = await signer.secretKey();

    return { address, privateKey };
  } catch (error) {
    console.error("Error generating Tezos wallet:", error);
  }
}

module.exports = generateTezosWallet;
