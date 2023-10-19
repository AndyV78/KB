// SPDX-License-Identifier: MIT
// Koinos Bulls Items Contract v1.0.0

import { Nft, common } from "@koinosbox/contracts";

export class KBItems extends Nft {
  _name: string = "Koinos Bulls Items";
  _symbol: string = "KBI";
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
