// SPDX-License-Identifier: MIT
// Koinos Bulls Characters Contract v1.0.0

import { Nft, common } from "@koinosbox/contracts";

export class KBChars extends Nft {
  _name: string = "Koinos Bulls Characters";
  _symbol: string = "KBC";
  _uri: string = "";

  /**
   * Get name of the NFT
   * @external
   * @readonly
   */
  name(): common.str {
    return new common.str(this._name);
  }
}
