# Wallet Forge CLI

Forge your path through the diverse universe of cryptocurrencies with the Universal Wallet Forge CLI. This Node.js-based command-line tool empowers you to generate wallets for multiple blockchains, including Ethereum, Bitcoin, Solana, and Tezos, all from a single command.

## Features

- <b>Multi-Blockchain Support:</b> Seamlessly create wallets for Ethereum, Bitcoin, Solana, and Tezos. </br>
- <b>BIP-39 Mnemonic Support:</b> Generate new mnemonics or use existing ones to create wallets. </br>
- <b>Interactive CLI:</b> User-friendly prompts guide you through wallet generation. </br>
- <b>Custom Wallet Numbers:</b> Choose how many wallets to generate for each cryptocurrency. </br>

## Installation

Install the Universal Wallet Forge globally using npm:

```bash
npm install -g universal-wallet-forge
```

## Usage

To start generating wallets, simply run:

```bash
wallet-forge
```

Follow the interactive prompts to choose the blockchain network, number of wallets, and mnemonic options.

## Generating Wallets

1. <b>Select Network:</b> Choose from Ethereum, Bitcoin, Solana, or Tezos.
2. <b>Number of Wallets:</b> Specify how many wallets you want to generate.
3. <b>Mnemonic Option:</b> Opt to generate a new mnemonic or use an existing one.
   If using an existing mnemonic, you'll be prompted to enter it.

## Example

```
$ wallet-forge

? Which network do you want to generate wallets for? (Use arrow keys)
❯ Ethereum
Bitcoin
Solana
Tezos

? How many wallets do you want to generate? 5

? Do you want to generate a new mnemonic or use an existing one? (Use arrow keys)
❯ Generate New
Use Existing
```

## Contributing

Contributions to Universal Wallet Forge are welcome! Feel free to fork the repository, make your enhancements, and submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
