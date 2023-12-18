const bip39 = require("bip39");
const { hdkey } = require("ethereumjs-wallet");
const config = require("../config");

/**
 * Generates an Ethereum wallet.
 * @param {string} mnemonic - The mnemonic phrase.
 * @param {number} index - The index of the wallet.
 * @returns {Object} An object containing the wallet's address and private key.
 */
function generateEthereumWallet(mnemonic, index) {
  try {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdWallet = hdkey.fromMasterSeed(seed);
    const key = hdWallet.derivePath(
      config.ethereum.derivationPath + `${index}`
    );
    const wallet = key.getWallet();
    const address = `0x${wallet.getAddress().toString("hex")}`;
    const privateKey = wallet.getPrivateKey().toString("hex");
    return { address, privateKey };
  } catch (error) {
    console.error("Error generating Ethereum wallet:", error);
  }
}

module.exports = generateEthereumWallet;
