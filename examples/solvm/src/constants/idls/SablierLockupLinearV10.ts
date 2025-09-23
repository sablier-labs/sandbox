export default {
  address: "B1NkZf77LvLw5nft55LUBgyrBaTEbnEmHSCLdrsFzRe4",
  metadata: {
    name: "sablier_lockup",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  docs: ["Sablier Lockup program for creating and managing token streams."],
  instructions: [
    {
      name: "cancel",
      docs: [
        "Cancels the stream and refunds any remaining tokens to the sender ATA.",
        "",
        "# Accounts Expected",
        "",
        "- `sender` The transaction signer and the stream's sender.",
        "- `deposited_token_mint` The mint of the deposited token.",
        "- `stream_nft_mint` The stream NFT mint uniquely identifying the stream.",
        "- `deposited_token_program` The Token Program of the deposited token.",
        "",
        "# Notes",
        "",
        "- If there are any tokens left for the recipient to withdraw, the stream is marked as canceled. Otherwise, the",
        "stream is marked as depleted.",
        "- If the sender does not have an ATA for the deposited token, it is created.",
        "- Emits a [`crate::utils::events::CancelLockupStream`] event.",
        "",
        "# Requirements",
        "",
        "- The signer must be the stream's sender.",
        "- The `stream_nft_mint` must exist.",
        "- The stream must be cancelable.",
        "- The stream must be Pending or Streaming.",
      ],
      discriminator: [232, 219, 223, 41, 219, 236, 220, 190],
      accounts: [
        {
          name: "sender",
          docs: ["Write account: the sender of the stream who can cancel it."],
          writable: true,
          signer: true,
        },
        {
          name: "sender_ata",
          docs: [
            "Create if needed account: the deposited token ATA owned by the sender.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "sender",
              },
              {
                kind: "account",
                path: "deposited_token_program",
              },
              {
                kind: "account",
                path: "deposited_token_mint",
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
          name: "deposited_token_mint",
          docs: ["Read account: the mint account of the deposited token."],
        },
        {
          name: "stream_data",
          docs: [
            "Write account: the stream data account storing stream details.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 114, 101, 97, 109, 95, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
          },
        },
        {
          name: "stream_data_ata",
          docs: [
            "Write account: the deposited token ATA owned by the stream data account.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "stream_data",
              },
              {
                kind: "account",
                path: "deposited_token_program",
              },
              {
                kind: "account",
                path: "deposited_token_mint",
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
          name: "stream_nft_mint",
          docs: ["Read account: the mint account for the stream NFT."],
        },
        {
          name: "associated_token_program",
          docs: ["Program account: the Associated Token program."],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "deposited_token_program",
          docs: ["Program account: the Token program of the deposited token."],
        },
        {
          name: "system_program",
          docs: ["Program account: the System program."],
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "collect_fees",
      docs: [
        "Collects the fees accumulated in the treasury by transferring them to the fee recipient.",
        "",
        "# Accounts Expected",
        "",
        "- `fee_collector` The transaction signer and the fee collector.",
        "- `fee_recipient` The address receiving the collected fees.",
        "",
        "# Notes",
        "",
        "- Leaves a buffer of 0.001 SOL to ensure the account remains rent-exempt after the fee collection.",
        "- Emits a [`crate::utils::events::FeesCollected`] event.",
        "",
        "# Requirements",
        "",
        "- `fee_collector` must be authorized for fee collection.",
      ],
      discriminator: [164, 152, 207, 99, 30, 186, 19, 182],
      accounts: [
        {
          name: "fee_collector",
          docs: [
            "Write account: the account authorized to collect fees from the treasury.",
          ],
          signer: true,
        },
        {
          name: "fee_recipient",
          docs: [
            "Write account: the address that will receive the collected fees.",
          ],
          writable: true,
        },
        {
          name: "treasury",
          docs: ["Write account: the treasury account that holds the fees."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 114, 101, 97, 115, 117, 114, 121],
              },
            ],
          },
        },
      ],
      args: [],
    },
    {
      name: "create_with_durations_ll",
      docs: [
        "Creates a stream by setting the start time to the current timestamp, and the end time to the sum of the",
        "current timestamp and the total duration The stream is funded by the signer and wrapped in a Metaplex NFT.",
        "",
        "# Accounts Expected",
        "",
        "Refer to the accounts in [`fn@crate::sablier_lockup::create_with_timestamps_ll`].",
        "",
        "# Parameters",
        "",
        "Refer to the parameters in [`fn@crate::sablier_lockup::create_with_timestamps_ll`].",
        "",
        "# Notes",
        "",
        "Refer to the notes in [`fn@crate::sablier_lockup::create_with_timestamps_ll`].",
        "",
        "# Requirements",
        "",
        "Refer to the requirements in [`fn@crate::sablier_lockup::create_with_timestamps_ll`].",
      ],
      discriminator: [87, 17, 170, 167, 156, 152, 169, 61],
      accounts: [
        {
          name: "creator",
          docs: ["Write account: the creator and funder of the stream."],
          writable: true,
          signer: true,
        },
        {
          name: "creator_ata",
          docs: ["Write account: the creator's ATA for the deposit token."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "creator",
              },
              {
                kind: "account",
                path: "deposit_token_program",
              },
              {
                kind: "account",
                path: "deposit_token_mint",
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
          docs: ["Read account: the recipient of the stream."],
        },
        {
          name: "sender",
          docs: ["Read account: the sender of the stream."],
        },
        {
          name: "nft_collection_data",
          docs: [
            "Write account: the NFT collection data storing the total supply.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  110, 102, 116, 95, 99, 111, 108, 108, 101, 99, 116, 105, 111,
                  110, 95, 100, 97, 116, 97,
                ],
              },
            ],
          },
        },
        {
          name: "nft_collection_master_edition",
          docs: [
            "Write account: the master edition account for the NFT collection.",
          ],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "token_metadata_program",
              },
              {
                kind: "account",
                path: "nft_collection_mint",
              },
              {
                kind: "const",
                value: [101, 100, 105, 116, 105, 111, 110],
              },
            ],
            program: {
              kind: "account",
              path: "token_metadata_program",
            },
          },
        },
        {
          name: "nft_collection_metadata",
          docs: ["Write account: the metadata account for the NFT collection."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "token_metadata_program",
              },
              {
                kind: "account",
                path: "nft_collection_mint",
              },
            ],
            program: {
              kind: "account",
              path: "token_metadata_program",
            },
          },
        },
        {
          name: "nft_collection_mint",
          docs: ["Read account: the mint account for the NFT collection."],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  110, 102, 116, 95, 99, 111, 108, 108, 101, 99, 116, 105, 111,
                  110, 95, 109, 105, 110, 116,
                ],
              },
            ],
          },
        },
        {
          name: "deposit_token_mint",
          docs: ["Read account: the mint account for the deposit token."],
        },
        {
          name: "stream_nft_mint",
          docs: ["Create account: the mint account for the stream NFT."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 116, 114, 101, 97, 109, 95, 110, 102, 116, 95, 109, 105,
                  110, 116,
                ],
              },
              {
                kind: "account",
                path: "sender",
              },
              {
                kind: "arg",
                path: "salt",
              },
            ],
          },
        },
        {
          name: "recipient_stream_nft_ata",
          docs: [
            "Create account: the ATA for the stream NFT owned by the recipient.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "recipient",
              },
              {
                kind: "account",
                path: "nft_token_program",
              },
              {
                kind: "account",
                path: "stream_nft_mint",
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
          name: "stream_data",
          docs: [
            "Create account: the account that will store the stream data.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 114, 101, 97, 109, 95, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
          },
        },
        {
          name: "stream_data_ata",
          docs: [
            "Create account: the ATA for deposit tokens owned by stream data account.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "stream_data",
              },
              {
                kind: "account",
                path: "deposit_token_program",
              },
              {
                kind: "account",
                path: "deposit_token_mint",
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
          name: "stream_nft_master_edition",
          docs: [
            "Create account: the master edition account for the stream NFT.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "token_metadata_program",
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
              {
                kind: "const",
                value: [101, 100, 105, 116, 105, 111, 110],
              },
            ],
            program: {
              kind: "account",
              path: "token_metadata_program",
            },
          },
        },
        {
          name: "stream_nft_metadata",
          docs: ["Create account: the metadata account for the stream NFT."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "token_metadata_program",
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
            program: {
              kind: "account",
              path: "token_metadata_program",
            },
          },
        },
        {
          name: "associated_token_program",
          docs: ["Program account: the Associated Token program."],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "deposit_token_program",
          docs: ["Program account: the Token program of the deposit token."],
        },
        {
          name: "nft_token_program",
          docs: ["Program account: the Token program of the stream NFT."],
        },
        {
          name: "token_metadata_program",
          docs: ["Program account: the Token Metadata program."],
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        },
        {
          name: "system_program",
          docs: ["Program account: the System program."],
          address: "11111111111111111111111111111111",
        },
        {
          name: "rent",
          docs: ["Sysvar account: Rent."],
          address: "SysvarRent111111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "salt",
          type: "u128",
        },
        {
          name: "deposit_amount",
          type: "u64",
        },
        {
          name: "cliff_duration",
          type: "u64",
        },
        {
          name: "total_duration",
          type: "u64",
        },
        {
          name: "start_unlock_amount",
          type: "u64",
        },
        {
          name: "cliff_unlock_amount",
          type: "u64",
        },
        {
          name: "is_cancelable",
          type: "bool",
        },
      ],
    },
    {
      name: "create_with_timestamps_ll",
      docs: [
        "Creates a stream with the provided start and end times. The stream is funded by the signer and wrapped in",
        "a Metaplex NFT.",
        "",
        "# Accounts Expected",
        "",
        "- `creator` The transaction signer.",
        "- `sender` The account that will have authority to cancel or renounce the stream.",
        "- `deposit_token_mint` The mint of the tokens to be deposited.",
        "- `recipient` The address receiving the tokens, as well as the NFT owner.",
        "- `deposit_token_program` The Token Program of the deposit token.",
        "- `nft_token_program` The Token Program of the NFT.",
        "",
        "# Parameters",
        "",
        "- `salt` A unique salt used to derive the address of the stream NFT mint.",
        "- `deposit_amount` The deposit amount, denoted in units of the token's decimals.",
        "- `start_time` The Unix timestamp indicating the stream's start.",
        "- `cliff_time` The Unix timestamp indicating the stream's cliff.",
        "- `end_time` The Unix timestamp indicating the stream's end.",
        "- `start_unlock_amount` The amount to be unlocked at the start time.",
        "- `cliff_unlock_amount` The amount to be unlocked at the cliff time.",
        "- `is_cancelable` Indicates if the stream is cancelable.",
        "",
        "# Notes",
        "",
        "- The passed sender of the stream doesn't have to be the same as its creator.",
        "- A cliff time of zero means there is no cliff.",
        "- As long as the times are ordered, it is not an error for the start or the cliff time to be in the past.",
        "- The stream recipient is given solely by the ownership of the stream NFT, which is minted to the passed",
        "`recipient`.",
        "- Emits a [`crate::utils::events::CreateLockupLinearStream`] event.",
        "",
        "# Requirements",
        "",
        "- `deposit_amount` must be greater than zero.",
        "- `start_time` must be greater than zero and less than `end_time`.",
        "- If set, `cliff_time` must be greater than `start_time` and less than `end_time`.",
        "- The sum of `start_unlock_amount` and `cliff_unlock_amount` must be less than or equal to deposit amount.",
        "- If `cliff_time` is not set, the `cliff_unlock_amount` amount must be zero.",
      ],
      discriminator: [150, 165, 147, 28, 68, 41, 48, 41],
      accounts: [
        {
          name: "creator",
          docs: ["Write account: the creator and funder of the stream."],
          writable: true,
          signer: true,
        },
        {
          name: "creator_ata",
          docs: ["Write account: the creator's ATA for the deposit token."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "creator",
              },
              {
                kind: "account",
                path: "deposit_token_program",
              },
              {
                kind: "account",
                path: "deposit_token_mint",
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
          docs: ["Read account: the recipient of the stream."],
        },
        {
          name: "sender",
          docs: ["Read account: the sender of the stream."],
        },
        {
          name: "nft_collection_data",
          docs: [
            "Write account: the NFT collection data storing the total supply.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  110, 102, 116, 95, 99, 111, 108, 108, 101, 99, 116, 105, 111,
                  110, 95, 100, 97, 116, 97,
                ],
              },
            ],
          },
        },
        {
          name: "nft_collection_master_edition",
          docs: [
            "Write account: the master edition account for the NFT collection.",
          ],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "token_metadata_program",
              },
              {
                kind: "account",
                path: "nft_collection_mint",
              },
              {
                kind: "const",
                value: [101, 100, 105, 116, 105, 111, 110],
              },
            ],
            program: {
              kind: "account",
              path: "token_metadata_program",
            },
          },
        },
        {
          name: "nft_collection_metadata",
          docs: ["Write account: the metadata account for the NFT collection."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "token_metadata_program",
              },
              {
                kind: "account",
                path: "nft_collection_mint",
              },
            ],
            program: {
              kind: "account",
              path: "token_metadata_program",
            },
          },
        },
        {
          name: "nft_collection_mint",
          docs: ["Read account: the mint account for the NFT collection."],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  110, 102, 116, 95, 99, 111, 108, 108, 101, 99, 116, 105, 111,
                  110, 95, 109, 105, 110, 116,
                ],
              },
            ],
          },
        },
        {
          name: "deposit_token_mint",
          docs: ["Read account: the mint account for the deposit token."],
        },
        {
          name: "stream_nft_mint",
          docs: ["Create account: the mint account for the stream NFT."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 116, 114, 101, 97, 109, 95, 110, 102, 116, 95, 109, 105,
                  110, 116,
                ],
              },
              {
                kind: "account",
                path: "sender",
              },
              {
                kind: "arg",
                path: "salt",
              },
            ],
          },
        },
        {
          name: "recipient_stream_nft_ata",
          docs: [
            "Create account: the ATA for the stream NFT owned by the recipient.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "recipient",
              },
              {
                kind: "account",
                path: "nft_token_program",
              },
              {
                kind: "account",
                path: "stream_nft_mint",
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
          name: "stream_data",
          docs: [
            "Create account: the account that will store the stream data.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 114, 101, 97, 109, 95, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
          },
        },
        {
          name: "stream_data_ata",
          docs: [
            "Create account: the ATA for deposit tokens owned by stream data account.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "stream_data",
              },
              {
                kind: "account",
                path: "deposit_token_program",
              },
              {
                kind: "account",
                path: "deposit_token_mint",
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
          name: "stream_nft_master_edition",
          docs: [
            "Create account: the master edition account for the stream NFT.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "token_metadata_program",
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
              {
                kind: "const",
                value: [101, 100, 105, 116, 105, 111, 110],
              },
            ],
            program: {
              kind: "account",
              path: "token_metadata_program",
            },
          },
        },
        {
          name: "stream_nft_metadata",
          docs: ["Create account: the metadata account for the stream NFT."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "token_metadata_program",
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
            program: {
              kind: "account",
              path: "token_metadata_program",
            },
          },
        },
        {
          name: "associated_token_program",
          docs: ["Program account: the Associated Token program."],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "deposit_token_program",
          docs: ["Program account: the Token program of the deposit token."],
        },
        {
          name: "nft_token_program",
          docs: ["Program account: the Token program of the stream NFT."],
        },
        {
          name: "token_metadata_program",
          docs: ["Program account: the Token Metadata program."],
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        },
        {
          name: "system_program",
          docs: ["Program account: the System program."],
          address: "11111111111111111111111111111111",
        },
        {
          name: "rent",
          docs: ["Sysvar account: Rent."],
          address: "SysvarRent111111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "salt",
          type: "u128",
        },
        {
          name: "deposit_amount",
          type: "u64",
        },
        {
          name: "start_time",
          type: "u64",
        },
        {
          name: "cliff_time",
          type: "u64",
        },
        {
          name: "end_time",
          type: "u64",
        },
        {
          name: "start_unlock_amount",
          type: "u64",
        },
        {
          name: "cliff_unlock_amount",
          type: "u64",
        },
        {
          name: "is_cancelable",
          type: "bool",
        },
      ],
    },
    {
      name: "initialize",
      docs: [
        "Initializes the program with the provided fee collector address by creating a Metaplex NFT collection.",
        "",
        "# Accounts Expected",
        "",
        "- `initializer` The transaction signer.",
        "- `nft_token_program` The Token Program of the NFT collection.",
        "",
        "# Parameters:",
        "",
        "- `fee_collector`: The address that will have the authority to collect fees.",
        "- `chainlink_program`: The Chainlink program used to retrieve on-chain price feeds.",
        "- `chainlink_sol_usd_feed`: The account providing the SOL/USD price feed data.",
      ],
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "initializer",
          docs: ["Write account: the initializer of the program."],
          writable: true,
          signer: true,
        },
        {
          name: "treasury",
          docs: [
            "Create account: the treasury account that will hold the fees.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 114, 101, 97, 115, 117, 114, 121],
              },
            ],
          },
        },
        {
          name: "nft_collection_data",
          docs: [
            "Create account: the NFT collection data account storing collection metadata.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  110, 102, 116, 95, 99, 111, 108, 108, 101, 99, 116, 105, 111,
                  110, 95, 100, 97, 116, 97,
                ],
              },
            ],
          },
        },
        {
          name: "nft_collection_master_edition",
          docs: [
            "Create account: the master edition account for the NFT collection.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "token_metadata_program",
              },
              {
                kind: "account",
                path: "nft_collection_mint",
              },
              {
                kind: "const",
                value: [101, 100, 105, 116, 105, 111, 110],
              },
            ],
            program: {
              kind: "account",
              path: "token_metadata_program",
            },
          },
        },
        {
          name: "nft_collection_metadata",
          docs: [
            "Create account: the metadata account for the NFT collection.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "token_metadata_program",
              },
              {
                kind: "account",
                path: "nft_collection_mint",
              },
            ],
            program: {
              kind: "account",
              path: "token_metadata_program",
            },
          },
        },
        {
          name: "nft_collection_mint",
          docs: ["Create account: the mint account for the NFT collection."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  110, 102, 116, 95, 99, 111, 108, 108, 101, 99, 116, 105, 111,
                  110, 95, 109, 105, 110, 116,
                ],
              },
            ],
          },
        },
        {
          name: "nft_collection_ata",
          docs: [
            "Create account: the ATA for the NFT collection owned by treasury.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "treasury",
              },
              {
                kind: "account",
                path: "nft_token_program",
              },
              {
                kind: "account",
                path: "nft_collection_mint",
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
          name: "associated_token_program",
          docs: ["Program account: the Associated Token program."],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "nft_token_program",
          docs: ["Program account: the Token program of the collection NFT."],
        },
        {
          name: "token_metadata_program",
          docs: ["Program account: the Token Metadata program."],
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        },
        {
          name: "rent",
          docs: ["Sysvar account: Rent."],
          address: "SysvarRent111111111111111111111111111111111",
        },
        {
          name: "system_program",
          docs: ["Program account: the System program."],
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "fee_collector",
          type: "pubkey",
        },
        {
          name: "chainlink_program",
          type: "pubkey",
        },
        {
          name: "chainlink_sol_usd_feed",
          type: "pubkey",
        },
      ],
    },
    {
      name: "refundable_amount_of",
      docs: [
        "Calculates the amount that the sender would be refunded if the stream were canceled, denoted in units of the",
        "token's decimals.",
        "",
        "# Accounts Expected",
        "",
        "- `stream_nft_mint` The stream NFT mint uniquely identifying the stream.",
        "",
        "# Requirements",
        "",
        "- The stream does not exist.",
      ],
      discriminator: [160, 136, 114, 120, 234, 178, 146, 58],
      accounts: [
        {
          name: "stream_data",
          docs: ["Read account: the account storing stream details."],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 114, 101, 97, 109, 95, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
          },
        },
        {
          name: "stream_nft_mint",
          docs: ["Read account: the mint account for the stream NFT."],
        },
      ],
      args: [],
      returns: "u64",
    },
    {
      name: "renounce",
      docs: [
        "Removes the right of the stream's sender to cancel the stream.",
        "",
        "# Accounts Expected",
        "",
        "- `sender` The transaction signer and the stream's sender.",
        "- `stream_nft_mint` The stream NFT mint uniquely identifying the stream.",
        "",
        "# Notes",
        "",
        "- Emits a [`crate::utils::events::RenounceLockupStream`] event.",
      ],
      discriminator: [241, 157, 138, 210, 8, 235, 187, 123],
      accounts: [
        {
          name: "sender",
          docs: ["Write account: the sender of the stream."],
          signer: true,
        },
        {
          name: "stream_data",
          docs: [
            "Write account: the stream data account storing stream details.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 114, 101, 97, 109, 95, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
          },
        },
        {
          name: "stream_nft_mint",
          docs: ["Read account: the mint account for the stream NFT."],
        },
      ],
      args: [],
    },
    {
      name: "status_of",
      docs: [
        "Retrieves the stream's status.",
        "",
        "# Accounts Expected",
        "",
        "- `stream_nft_mint` The stream NFT mint uniquely identifying the stream.",
        "",
        "# Requirements",
        "",
        "- The stream does not exist.",
      ],
      discriminator: [90, 214, 253, 237, 126, 236, 132, 237],
      accounts: [
        {
          name: "stream_data",
          docs: ["Read account: the account storing stream details."],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 114, 101, 97, 109, 95, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
          },
        },
        {
          name: "stream_nft_mint",
          docs: ["Read account: the mint account for the stream NFT."],
        },
      ],
      args: [],
      returns: {
        defined: {
          name: "StreamStatus",
        },
      },
    },
    {
      name: "stream_exists",
      docs: [
        "Returns a flag indicating whether a stream based on the `_sender` and the `_salt` already exists.",
        "",
        "# Parameters",
        "",
        "- `_sender` The sender of the stream.",
        "- `_salt` The unique salt used to derive the stream NFT mint address.",
      ],
      discriminator: [104, 209, 104, 97, 122, 35, 165, 195],
      accounts: [
        {
          name: "stream_nft_mint",
          docs: ["Read account: the mint account for the stream NFT."],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 116, 114, 101, 97, 109, 95, 110, 102, 116, 95, 109, 105,
                  110, 116,
                ],
              },
              {
                kind: "arg",
                path: "_sender",
              },
              {
                kind: "arg",
                path: "_salt",
              },
            ],
          },
        },
      ],
      args: [
        {
          name: "_sender",
          type: "pubkey",
        },
        {
          name: "_salt",
          type: "u128",
        },
      ],
      returns: "bool",
    },
    {
      name: "streamed_amount_of",
      docs: [
        "Calculates the amount streamed to the recipient, denoted in units of the token's decimals.",
        "",
        "# Accounts Expected",
        "",
        "- `stream_nft_mint` The stream NFT mint uniquely identifying the stream.",
        "",
        "# Notes",
        "",
        "- Upon cancellation of the stream, the amount streamed is calculated as the difference between the deposited",
        "amount and the refunded amount. Ultimately, when the stream becomes depleted, the streamed amount is equivalent",
        "to the total amount withdrawn.",
        "",
        "# Requirements",
        "",
        "- The stream does not exist.",
      ],
      discriminator: [91, 69, 219, 48, 189, 26, 13, 33],
      accounts: [
        {
          name: "stream_data",
          docs: ["Read account: the account storing stream details."],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 114, 101, 97, 109, 95, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
          },
        },
        {
          name: "stream_nft_mint",
          docs: ["Read account: the mint account for the stream NFT."],
        },
      ],
      args: [],
      returns: "u64",
    },
    {
      name: "treasury_view",
      docs: ["Returns the treasury details."],
      discriminator: [247, 160, 213, 237, 247, 121, 164, 82],
      accounts: [
        {
          name: "treasury",
          docs: ["Read account: the account storing the treasury details."],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 114, 101, 97, 115, 117, 114, 121],
              },
            ],
          },
        },
      ],
      args: [],
      returns: {
        defined: {
          name: "Treasury",
        },
      },
    },
    {
      name: "withdraw",
      docs: [
        "Withdraws the provided amount of tokens from the stream data ATA to the provided account.",
        "",
        "# Accounts Expected",
        "",
        "- `signer` The transaction signer.",
        "- `deposited_token_mint` The mint of the deposited token.",
        "- `stream_nft_mint` The stream NFT mint uniquely identifying the stream.",
        "- `withdrawal_recipient` The address of the recipient receiving the withdrawn tokens.",
        "- `deposited_token_program` The Token Program of the deposited token.",
        "- `nft_token_program` The Token Program of the NFT.",
        "- `chainlink_program`: The Chainlink program used to retrieve on-chain price feeds.",
        "- `chainlink_sol_usd_feed`: The account providing the SOL/USD price feed data.",
        "",
        "# Parameters",
        "",
        "- `amount` The amount to withdraw, denoted in units of the token's decimals.",
        "",
        "# Notes",
        "",
        "- If the withdrawal recipient does not have an ATA for the deposited token, one is created.",
        "- The instruction charges a fee in the native token (SOL), equivalent to $1 USD.",
        "- Emits [`crate::utils::events::WithdrawFromLockupStream`] event.",
        "",
        "# Requirements",
        "",
        "- `stream_nft_mint` must exist.",
        "- `withdrawal_recipient` must be the recipient if the signer is not the stream's recipient.",
        "- `amount` must be greater than zero and must not exceed the withdrawable amount.",
        "- The stream must not be Depleted.",
        "- `chainlink_program` and `chainlink_sol_usd_feed` must match the ones stored in the treasury.",
      ],
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34],
      accounts: [
        {
          name: "signer",
          docs: [
            "Write account: the signer of the withdrawal who pays the withdrawal fee.",
          ],
          writable: true,
          signer: true,
        },
        {
          name: "stream_recipient",
          docs: [
            "Read account: the recipient of the stream who owns the stream NFT.",
          ],
        },
        {
          name: "withdrawal_recipient",
          docs: [
            "Read account: the account that will receive the withdrawn tokens.",
            "recipient.",
          ],
        },
        {
          name: "withdrawal_recipient_ata",
          docs: [
            "Create if needed account: the ATA for deposited tokens owned by withdrawal recipient.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "withdrawal_recipient",
              },
              {
                kind: "account",
                path: "deposited_token_program",
              },
              {
                kind: "account",
                path: "deposited_token_mint",
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
          name: "treasury",
          docs: [
            "Write account: the treasury account that receives the withdrawal fee.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 114, 101, 97, 115, 117, 114, 121],
              },
            ],
          },
        },
        {
          name: "deposited_token_mint",
          docs: ["Read account: the mint account for the deposited token."],
        },
        {
          name: "recipient_stream_nft_ata",
          docs: [
            "Read account: the ATA for the stream NFT owned by recipient.",
            "",
          ],
          pda: {
            seeds: [
              {
                kind: "account",
                path: "stream_recipient",
              },
              {
                kind: "account",
                path: "nft_token_program",
              },
              {
                kind: "account",
                path: "stream_nft_mint",
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
          name: "stream_data",
          docs: ["Write account: the account storing the stream data."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 114, 101, 97, 109, 95, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
          },
        },
        {
          name: "stream_data_ata",
          docs: [
            "Write account: the ATA for deposited tokens owned by stream data.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "stream_data",
              },
              {
                kind: "account",
                path: "deposited_token_program",
              },
              {
                kind: "account",
                path: "deposited_token_mint",
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
          name: "stream_nft_mint",
          docs: ["Read account: the mint account for the stream NFT."],
        },
        {
          name: "associated_token_program",
          docs: ["Program account: the Associated Token program."],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "chainlink_program",
          docs: [
            "Read account: The Chainlink program used to retrieve on-chain price feeds.",
          ],
        },
        {
          name: "chainlink_sol_usd_feed",
          docs: [
            "Read account: The account providing the SOL/USD price feed data.",
          ],
        },
        {
          name: "deposited_token_program",
          docs: ["Program account: the Token program of the deposited token."],
        },
        {
          name: "nft_token_program",
          docs: ["Program account: the Token program of the stream NFT."],
        },
        {
          name: "system_program",
          docs: ["Program account: the System program."],
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdraw_max",
      docs: [
        "Withdraws the maximum withdrawable amount from the stream data ATA to the provided account.",
        "",
        "# Accounts Expected",
        "",
        "Refer to the accounts in [`fn@crate::sablier_lockup::withdraw`].",
        "",
        "# Notes",
        "",
        "Refer to the notes in [`fn@crate::sablier_lockup::withdraw`].",
        "",
        "# Requirements",
        "",
        "Refer to the requirements in [`fn@crate::sablier_lockup::withdraw`].",
      ],
      discriminator: [32, 71, 46, 98, 105, 76, 85, 96],
      accounts: [
        {
          name: "signer",
          docs: [
            "Write account: the signer of the withdrawal who pays the withdrawal fee.",
          ],
          writable: true,
          signer: true,
        },
        {
          name: "stream_recipient",
          docs: [
            "Read account: the recipient of the stream who owns the stream NFT.",
          ],
        },
        {
          name: "withdrawal_recipient",
          docs: [
            "Read account: the account that will receive the withdrawn tokens.",
            "recipient.",
          ],
        },
        {
          name: "withdrawal_recipient_ata",
          docs: [
            "Create if needed account: the ATA for deposited tokens owned by withdrawal recipient.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "withdrawal_recipient",
              },
              {
                kind: "account",
                path: "deposited_token_program",
              },
              {
                kind: "account",
                path: "deposited_token_mint",
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
          name: "treasury",
          docs: [
            "Write account: the treasury account that receives the withdrawal fee.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 114, 101, 97, 115, 117, 114, 121],
              },
            ],
          },
        },
        {
          name: "deposited_token_mint",
          docs: ["Read account: the mint account for the deposited token."],
        },
        {
          name: "recipient_stream_nft_ata",
          docs: [
            "Read account: the ATA for the stream NFT owned by recipient.",
            "",
          ],
          pda: {
            seeds: [
              {
                kind: "account",
                path: "stream_recipient",
              },
              {
                kind: "account",
                path: "nft_token_program",
              },
              {
                kind: "account",
                path: "stream_nft_mint",
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
          name: "stream_data",
          docs: ["Write account: the account storing the stream data."],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 114, 101, 97, 109, 95, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
          },
        },
        {
          name: "stream_data_ata",
          docs: [
            "Write account: the ATA for deposited tokens owned by stream data.",
          ],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "stream_data",
              },
              {
                kind: "account",
                path: "deposited_token_program",
              },
              {
                kind: "account",
                path: "deposited_token_mint",
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
          name: "stream_nft_mint",
          docs: ["Read account: the mint account for the stream NFT."],
        },
        {
          name: "associated_token_program",
          docs: ["Program account: the Associated Token program."],
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "chainlink_program",
          docs: [
            "Read account: The Chainlink program used to retrieve on-chain price feeds.",
          ],
        },
        {
          name: "chainlink_sol_usd_feed",
          docs: [
            "Read account: The account providing the SOL/USD price feed data.",
          ],
        },
        {
          name: "deposited_token_program",
          docs: ["Program account: the Token program of the deposited token."],
        },
        {
          name: "nft_token_program",
          docs: ["Program account: the Token program of the stream NFT."],
        },
        {
          name: "system_program",
          docs: ["Program account: the System program."],
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "withdrawable_amount_of",
      docs: [
        "Calculates the amount that the recipient can withdraw from the stream, denoted in units of the token's",
        "decimals.",
        "",
        "# Accounts Expected",
        "",
        "- `stream_nft_mint` The stream NFT mint uniquely identifying the stream.",
        "",
        "# Requirements",
        "",
        "- The stream does not exist.",
      ],
      discriminator: [30, 195, 140, 141, 173, 123, 253, 60],
      accounts: [
        {
          name: "stream_data",
          docs: ["Read account: the account storing stream details."],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [115, 116, 114, 101, 97, 109, 95, 100, 97, 116, 97],
              },
              {
                kind: "account",
                path: "stream_nft_mint",
              },
            ],
          },
        },
        {
          name: "stream_nft_mint",
          docs: ["Read account: the mint account for the stream NFT."],
        },
      ],
      args: [],
      returns: "u64",
    },
    {
      name: "withdrawal_fee_in_lamports",
      docs: [
        "Calculates the withdrawal fee in lamports, which is equivalent to $1 USD.",
        "",
        "# Accounts Expected:",
        "",
        "- `chainlink_program`: The Chainlink program used to retrieve on-chain price feeds.",
        "- `chainlink_sol_usd_feed`: The account providing the SOL/USD price feed data.",
      ],
      discriminator: [55, 255, 88, 224, 223, 23, 97, 140],
      accounts: [
        {
          name: "treasury",
          docs: [
            "Read account: the treasury account that receives the withdrawal fee.",
          ],
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 114, 101, 97, 115, 117, 114, 121],
              },
            ],
          },
        },
        {
          name: "chainlink_program",
          docs: [
            "Read account: The Chainlink program used to retrieve on-chain price feeds.",
          ],
        },
        {
          name: "chainlink_sol_usd_feed",
          docs: [
            "Read account: The account providing the SOL/USD price feed data.",
          ],
        },
      ],
      args: [],
      returns: "u64",
    },
  ],
  accounts: [
    {
      name: "NftCollectionData",
      discriminator: [159, 26, 37, 150, 44, 84, 171, 172],
    },
    {
      name: "StreamData",
      discriminator: [61, 89, 148, 141, 154, 81, 86, 113],
    },
    {
      name: "Treasury",
      discriminator: [238, 239, 123, 238, 89, 1, 168, 253],
    },
  ],
  events: [
    {
      name: "CancelLockupStream",
      discriminator: [82, 106, 117, 112, 153, 245, 190, 66],
    },
    {
      name: "CreateLockupLinearStream",
      discriminator: [234, 181, 19, 52, 67, 64, 151, 173],
    },
    {
      name: "FeesCollected",
      discriminator: [233, 23, 117, 225, 107, 178, 254, 8],
    },
    {
      name: "RenounceLockupStream",
      discriminator: [28, 66, 144, 150, 118, 56, 81, 93],
    },
    {
      name: "WithdrawFromLockupStream",
      discriminator: [232, 101, 27, 150, 85, 222, 243, 9],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "StreamDepleted",
      msg: "Can't perform the action on a depleted stream!",
    },
    {
      code: 6001,
      name: "StreamCanceled",
      msg: "Can't renounce an already-renounced Stream!",
    },
    {
      code: 6002,
      name: "StreamIsNotCancelable",
      msg: "Can't cancel a non-cancelable Stream!",
    },
    {
      code: 6003,
      name: "StreamSettled",
      msg: "Can't cancel a settled Stream!",
    },
    {
      code: 6004,
      name: "CantCollectZeroFees",
      msg: "Can't collect zero fees!",
    },
    {
      code: 6005,
      name: "CliffTimeNotLessThanEndTime",
      msg: "Invalid cliff time of the Stream!",
    },
    {
      code: 6006,
      name: "CliffTimeZeroUnlockAmountNotZero",
      msg: "Cliff time zero but unlock amount not zero!",
    },
    {
      code: 6007,
      name: "DepositAmountZero",
      msg: "Invalid deposit amount!",
    },
    {
      code: 6008,
      name: "StartTimeNotLessThanCliffTime",
      msg: "Start time must be less than cliff time!",
    },
    {
      code: 6009,
      name: "StartTimeNotLessThanEndTime",
      msg: "Start time must be less than end time!",
    },
    {
      code: 6010,
      name: "StartTimeZero",
      msg: "Start time can't be zero!",
    },
    {
      code: 6011,
      name: "UnlockAmountsSumTooHigh",
      msg: "Unlock amounts sum is greater than deposit amount!",
    },
    {
      code: 6012,
      name: "StreamAlreadyNonCancelable",
      msg: "Can't renounce a non-cancelable Stream!",
    },
    {
      code: 6013,
      name: "Overdraw",
      msg: "Attempting to withdraw more than available in the stream!",
    },
    {
      code: 6014,
      name: "WithdrawAmountZero",
      msg: "Can't withdraw a zero amount!",
    },
  ],
  types: [
    {
      name: "Amounts",
      type: {
        kind: "struct",
        fields: [
          {
            name: "start_unlock",
            type: "u64",
          },
          {
            name: "cliff_unlock",
            type: "u64",
          },
          {
            name: "deposited",
            type: "u64",
          },
          {
            name: "refunded",
            type: "u64",
          },
          {
            name: "withdrawn",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "CancelLockupStream",
      type: {
        kind: "struct",
        fields: [
          {
            name: "deposited_token_mint",
            type: "pubkey",
          },
          {
            name: "recipient_amount",
            type: "u64",
          },
          {
            name: "sender_amount",
            type: "u64",
          },
          {
            name: "stream_data",
            type: "pubkey",
          },
          {
            name: "stream_nft_mint",
            type: "pubkey",
          },
        ],
      },
    },
    {
      name: "CreateLockupLinearStream",
      type: {
        kind: "struct",
        fields: [
          {
            name: "deposit_token_decimals",
            type: "u8",
          },
          {
            name: "deposit_token_mint",
            type: "pubkey",
          },
          {
            name: "recipient",
            type: "pubkey",
          },
          {
            name: "salt",
            type: "u128",
          },
          {
            name: "stream_data",
            type: "pubkey",
          },
          {
            name: "stream_nft_mint",
            type: "pubkey",
          },
        ],
      },
    },
    {
      name: "FeesCollected",
      type: {
        kind: "struct",
        fields: [
          {
            name: "fee_amount",
            type: "u64",
          },
          {
            name: "fee_collector",
            type: "pubkey",
          },
          {
            name: "fee_recipient",
            type: "pubkey",
          },
        ],
      },
    },
    {
      name: "NftCollectionData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "total_supply",
            type: "u64",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "RenounceLockupStream",
      type: {
        kind: "struct",
        fields: [
          {
            name: "deposited_token_mint",
            type: "pubkey",
          },
          {
            name: "stream_data",
            type: "pubkey",
          },
          {
            name: "stream_nft_mint",
            type: "pubkey",
          },
        ],
      },
    },
    {
      name: "StreamData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "amounts",
            type: {
              defined: {
                name: "Amounts",
              },
            },
          },
          {
            name: "deposited_token_mint",
            type: "pubkey",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "salt",
            type: "u128",
          },
          {
            name: "is_cancelable",
            type: "bool",
          },
          {
            name: "is_depleted",
            type: "bool",
          },
          {
            name: "timestamps",
            type: {
              defined: {
                name: "Timestamps",
              },
            },
          },
          {
            name: "sender",
            type: "pubkey",
          },
          {
            name: "was_canceled",
            type: "bool",
          },
        ],
      },
    },
    {
      name: "StreamStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Pending",
          },
          {
            name: "Streaming",
          },
          {
            name: "Settled",
          },
          {
            name: "Canceled",
          },
          {
            name: "Depleted",
          },
        ],
      },
    },
    {
      name: "Timestamps",
      docs: ["Groups the timestamps for a Lockup stream."],
      type: {
        kind: "struct",
        fields: [
          {
            name: "cliff",
            type: "u64",
          },
          {
            name: "end",
            type: "u64",
          },
          {
            name: "start",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "Treasury",
      type: {
        kind: "struct",
        fields: [
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "fee_collector",
            type: "pubkey",
          },
          {
            name: "chainlink_program",
            type: "pubkey",
          },
          {
            name: "chainlink_sol_usd_feed",
            type: "pubkey",
          },
        ],
      },
    },
    {
      name: "WithdrawFromLockupStream",
      type: {
        kind: "struct",
        fields: [
          {
            name: "deposited_token_mint",
            type: "pubkey",
          },
          {
            name: "fee_in_lamports",
            type: "u64",
          },
          {
            name: "stream_data",
            type: "pubkey",
          },
          {
            name: "stream_nft_mint",
            type: "pubkey",
          },
          {
            name: "withdrawn_amount",
            type: "u64",
          },
        ],
      },
    },
  ],
} as const;
