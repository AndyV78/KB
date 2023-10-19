import { Signer, Contract, Provider, Transaction } from "koilib";
import abi from "../build/rotb-abi.json";
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

  const { transaction } = await contract.functions.mint({
    to: contractAccount.address,
    value: "100_000000_00000000".replace(/_/g, ""),
  });
  const { blockNumber } = await transaction.wait("byBlock", 60000);
  console.log(
    `Transaction mined in block number ${blockNumber} (${networkName})`
  );
}

main()
  .then(() => {})
  .catch((error) => console.error(error));
