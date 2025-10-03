export default {
  address: "DVE8KdM7uEPts5E6SHg6MnHKx6MHxtb8EwMbg7SU4Eba",
  metadata: {
    name: "solana_spl_faucet",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "initialize_token",
      discriminator: [38, 209, 150, 50, 190, 117, 16, 54],
      accounts: [
        {
          name: "metadata",
          writable: true,
        },
        {
          name: "mint",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 105, 110, 116],
              },
              {
                kind: "arg",
                path: "params.symbol",
              },
            ],
          },
        },
        {
          name: "payer",
          writable: true,
          signer: true,
        },
        {
          name: "rent",
          address: "SysvarRent111111111111111111111111111111111",
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "token_metadata_program",
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        },
      ],
      args: [
        {
          name: "metadata",
          type: {
            defined: {
              name: "InitializeTokenParams",
            },
          },
        },
      ],
    },
    {
      name: "mint_token_to",
      discriminator: [105, 222, 27, 81, 229, 72, 190, 194],
      accounts: [
        {
          name: "mint",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 105, 110, 116],
              },
              {
                kind: "arg",
                path: "symbol",
              },
            ],
          },
        },
        {
          name: "recipient_ata",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "recipient",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "mint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "recipient",
        },
        {
          name: "payer",
          writable: true,
          signer: true,
        },
        {
          name: "rent",
          address: "SysvarRent111111111111111111111111111111111",
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
      ],
      args: [
        {
          name: "symbol",
          type: "string",
        },
        {
          name: "quantity",
          type: "u64",
        },
      ],
    },
  ],
  types: [
    {
      name: "InitializeTokenParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "decimals",
            type: "u8",
          },
        ],
      },
    },
  ],
} as const;
