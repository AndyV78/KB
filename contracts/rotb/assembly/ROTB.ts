// SPDX-License-Identifier: MIT
// ROTB Token Contract v1.0.0

import { Token, token } from "@koinosbox/contracts";

export class ROTB extends Token {
  _name: string = "ROTB";
  _symbol: string = "ROTB";

  /**
   * Get name of the NFT
   * @external
   * @readonly
   */
  name(): token.str {
    return new token.str(this._name);
  }
}
