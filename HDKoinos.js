/**
 * Hierarchical Deterministic Wallet for Koinos
 *
 * The HDKoinos follows the BIP44 standard as follows
 * (see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki):
 *
 * path levels
 * m / purpose' / coin_type' / account' / change / address_index
 *
 * purpose: 44
 *
 * coin_type: 659
 * This value was selected by taking the word "koinos", converting it
 * to ascii [107 111 105 110 111 115], and adding their values.
 *
 * account:
 * index of the account
 *
 * change:
 * Koinos doesn't use an UTXO model as bitcoin does, so there is no
 * change. However, we take the philosophy around change: internal and
 * external use.
 * - 0 for external use: Accounts. Addresses to receive payments and store
 *   assets.
 * - 1 for internal use: Signers. In Koinos these addresses are not
 *   meant to be used to store assets (like tokens or NTFs) but to
 *   define signers for multisig wallets.
 *
 * address_index:
 * - 0 for accounts, or
 * - index for signers (when change = 1)
 */

const { Signer } = require("koilib");
const ethers = require("ethers");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const [opt] = process.argv.slice(2);

if (opt === "random") {
  console.log(ethers.utils.entropyToMnemonic(crypto.randomBytes(16)));
  process.exit(0);
}

const KOINOS_PATH = "m/44'/659'/";
const hdNode = ethers.utils.HDNode.fromMnemonic(process.env.MNEMONIC);

function deriveKey(account) {
  const { name, keyPath, address } = account;
  const key = hdNode.derivePath(keyPath);
  const signer = new Signer({
    privateKey: key.privateKey.slice(2),
  });

  if (address && address !== signer.getAddress()) {
    throw new Error(
      `Error in "${name}". Expected address: ${address}. Derived: ${signer.getAddress()}`
    );
  }

  return {
    public: {
      name,
      keyPath,
      address: signer.getAddress(),
    },
    private: {
      privateKey: signer.getPrivateKey("wif", true),
    },
  };
}

function deriveKeyAccount(accIndex, name = "") {
  return deriveKey({
    name,
    keyPath: `${KOINOS_PATH}${accIndex}'/0/0`,
  });
}

function deriveKeySigner(accIndex, signerIndex, name = "") {
  return deriveKey({
    name,
    keyPath: `${KOINOS_PATH}${accIndex}'/1/${signerIndex}`,
  });
}

console.log([0, 1, 2, 3].map((i) => deriveKeyAccount(i)));
