import { Signer, Contract, Provider, Transaction } from "koilib";
import abi from "../build/kbchars-abi.json";
import koinosConfig from "../koinos.config.js";

const TOTAL_NFTS = 150;

const [inputNetworkName] = process.argv.slice(2);

async function main() {
  const networkName = inputNetworkName || "harbinger";
  const network = koinosConfig.networks[networkName];
  if (!network) throw new Error(`network ${networkName} not found`);
  const provider = new Provider(network.rpcNodes);
  const contractAccount = Signer.fromWif(network.accounts.contract.privateKey);
  contractAccount.provider = provider;

  const contract = new Contract({
    signer: contractAccount,
    provider,
    abi,
    options: {
      payer: network.accounts.manaSharer.id,
      rcLimit: "1000000000",
    },
  });

  let tx: Transaction;
  
  let nftId = 122;
  while (nftId <= TOTAL_NFTS) {
    tx = new Transaction({
      signer: contractAccount,
      provider,
      options: {
        payer: network.accounts.manaSharer.id,
        rcLimit: "1000000000",
      },
    });

    for (let i = 0; i < 30 && nftId <= TOTAL_NFTS; i += 1 ) {
      await tx.pushOperation(contract.functions.mint, {
        token_id: `0x${Buffer.from(`${nftId}`).toString("hex")}`,
        to: contractAccount.address,
      });
      nftId += 1;
    }

    await tx.send();
    console.log("Transaction submitted...");
    const { blockNumber } = await tx.wait("byBlock", 60000);
    console.log(
      `Transaction mined in block number ${blockNumber} (${networkName}). Total NFTs: ${nftId}`
    );
  }
}

main()
  .then(() => {})
  .catch((error) => console.error(error));
