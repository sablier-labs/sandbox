export default {
  abi: [
    {
      type: "function",
      name: "createWithDurationsLD",
      inputs: [
        {
          name: "lockupDynamic",
          type: "address",
          internalType: "contract ISablierV2LockupDynamic",
        },
        { name: "asset", type: "address", internalType: "contract IERC20" },
        {
          name: "batch",
          type: "tuple[]",
          internalType: "struct BatchLockup.CreateWithDurationsLD[]",
          components: [
            { name: "sender", type: "address", internalType: "address" },
            { name: "recipient", type: "address", internalType: "address" },
            { name: "totalAmount", type: "uint128", internalType: "uint128" },
            { name: "cancelable", type: "bool", internalType: "bool" },
            { name: "transferable", type: "bool", internalType: "bool" },
            {
              name: "segments",
              type: "tuple[]",
              internalType: "struct LockupDynamic.SegmentWithDuration[]",
              components: [
                { name: "amount", type: "uint128", internalType: "uint128" },
                { name: "exponent", type: "uint64", internalType: "UD2x18" },
                { name: "duration", type: "uint40", internalType: "uint40" },
              ],
            },
            {
              name: "broker",
              type: "tuple",
              internalType: "struct Broker",
              components: [
                { name: "account", type: "address", internalType: "address" },
                { name: "fee", type: "uint256", internalType: "UD60x18" },
              ],
            },
          ],
        },
      ],
      outputs: [{ name: "streamIds", type: "uint256[]", internalType: "uint256[]" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "createWithDurationsLL",
      inputs: [
        {
          name: "lockupLinear",
          type: "address",
          internalType: "contract ISablierV2LockupLinear",
        },
        { name: "asset", type: "address", internalType: "contract IERC20" },
        {
          name: "batch",
          type: "tuple[]",
          internalType: "struct BatchLockup.CreateWithDurationsLL[]",
          components: [
            { name: "sender", type: "address", internalType: "address" },
            { name: "recipient", type: "address", internalType: "address" },
            { name: "totalAmount", type: "uint128", internalType: "uint128" },
            { name: "cancelable", type: "bool", internalType: "bool" },
            { name: "transferable", type: "bool", internalType: "bool" },
            {
              name: "durations",
              type: "tuple",
              internalType: "struct LockupLinear.Durations",
              components: [
                { name: "cliff", type: "uint40", internalType: "uint40" },
                { name: "total", type: "uint40", internalType: "uint40" },
              ],
            },
            {
              name: "broker",
              type: "tuple",
              internalType: "struct Broker",
              components: [
                { name: "account", type: "address", internalType: "address" },
                { name: "fee", type: "uint256", internalType: "UD60x18" },
              ],
            },
          ],
        },
      ],
      outputs: [{ name: "streamIds", type: "uint256[]", internalType: "uint256[]" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "createWithDurationsLT",
      inputs: [
        {
          name: "lockupTranched",
          type: "address",
          internalType: "contract ISablierV2LockupTranched",
        },
        { name: "asset", type: "address", internalType: "contract IERC20" },
        {
          name: "batch",
          type: "tuple[]",
          internalType: "struct BatchLockup.CreateWithDurationsLT[]",
          components: [
            { name: "sender", type: "address", internalType: "address" },
            { name: "recipient", type: "address", internalType: "address" },
            { name: "totalAmount", type: "uint128", internalType: "uint128" },
            { name: "cancelable", type: "bool", internalType: "bool" },
            { name: "transferable", type: "bool", internalType: "bool" },
            {
              name: "tranches",
              type: "tuple[]",
              internalType: "struct LockupTranched.TrancheWithDuration[]",
              components: [
                { name: "amount", type: "uint128", internalType: "uint128" },
                { name: "duration", type: "uint40", internalType: "uint40" },
              ],
            },
            {
              name: "broker",
              type: "tuple",
              internalType: "struct Broker",
              components: [
                { name: "account", type: "address", internalType: "address" },
                { name: "fee", type: "uint256", internalType: "UD60x18" },
              ],
            },
          ],
        },
      ],
      outputs: [{ name: "streamIds", type: "uint256[]", internalType: "uint256[]" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "createWithTimestampsLD",
      inputs: [
        {
          name: "lockupDynamic",
          type: "address",
          internalType: "contract ISablierV2LockupDynamic",
        },
        { name: "asset", type: "address", internalType: "contract IERC20" },
        {
          name: "batch",
          type: "tuple[]",
          internalType: "struct BatchLockup.CreateWithTimestampsLD[]",
          components: [
            { name: "sender", type: "address", internalType: "address" },
            { name: "recipient", type: "address", internalType: "address" },
            { name: "totalAmount", type: "uint128", internalType: "uint128" },
            { name: "cancelable", type: "bool", internalType: "bool" },
            { name: "transferable", type: "bool", internalType: "bool" },
            { name: "startTime", type: "uint40", internalType: "uint40" },
            {
              name: "segments",
              type: "tuple[]",
              internalType: "struct LockupDynamic.Segment[]",
              components: [
                { name: "amount", type: "uint128", internalType: "uint128" },
                { name: "exponent", type: "uint64", internalType: "UD2x18" },
                { name: "timestamp", type: "uint40", internalType: "uint40" },
              ],
            },
            {
              name: "broker",
              type: "tuple",
              internalType: "struct Broker",
              components: [
                { name: "account", type: "address", internalType: "address" },
                { name: "fee", type: "uint256", internalType: "UD60x18" },
              ],
            },
          ],
        },
      ],
      outputs: [{ name: "streamIds", type: "uint256[]", internalType: "uint256[]" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "createWithTimestampsLL",
      inputs: [
        {
          name: "lockupLinear",
          type: "address",
          internalType: "contract ISablierV2LockupLinear",
        },
        { name: "asset", type: "address", internalType: "contract IERC20" },
        {
          name: "batch",
          type: "tuple[]",
          internalType: "struct BatchLockup.CreateWithTimestampsLL[]",
          components: [
            { name: "sender", type: "address", internalType: "address" },
            { name: "recipient", type: "address", internalType: "address" },
            { name: "totalAmount", type: "uint128", internalType: "uint128" },
            { name: "cancelable", type: "bool", internalType: "bool" },
            { name: "transferable", type: "bool", internalType: "bool" },
            {
              name: "timestamps",
              type: "tuple",
              internalType: "struct LockupLinear.Timestamps",
              components: [
                { name: "start", type: "uint40", internalType: "uint40" },
                { name: "cliff", type: "uint40", internalType: "uint40" },
                { name: "end", type: "uint40", internalType: "uint40" },
              ],
            },
            {
              name: "broker",
              type: "tuple",
              internalType: "struct Broker",
              components: [
                { name: "account", type: "address", internalType: "address" },
                { name: "fee", type: "uint256", internalType: "UD60x18" },
              ],
            },
          ],
        },
      ],
      outputs: [{ name: "streamIds", type: "uint256[]", internalType: "uint256[]" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "createWithTimestampsLT",
      inputs: [
        {
          name: "lockupTranched",
          type: "address",
          internalType: "contract ISablierV2LockupTranched",
        },
        { name: "asset", type: "address", internalType: "contract IERC20" },
        {
          name: "batch",
          type: "tuple[]",
          internalType: "struct BatchLockup.CreateWithTimestampsLT[]",
          components: [
            { name: "sender", type: "address", internalType: "address" },
            { name: "recipient", type: "address", internalType: "address" },
            { name: "totalAmount", type: "uint128", internalType: "uint128" },
            { name: "cancelable", type: "bool", internalType: "bool" },
            { name: "transferable", type: "bool", internalType: "bool" },
            { name: "startTime", type: "uint40", internalType: "uint40" },
            {
              name: "tranches",
              type: "tuple[]",
              internalType: "struct LockupTranched.Tranche[]",
              components: [
                { name: "amount", type: "uint128", internalType: "uint128" },
                { name: "timestamp", type: "uint40", internalType: "uint40" },
              ],
            },
            {
              name: "broker",
              type: "tuple",
              internalType: "struct Broker",
              components: [
                { name: "account", type: "address", internalType: "address" },
                { name: "fee", type: "uint256", internalType: "UD60x18" },
              ],
            },
          ],
        },
      ],
      outputs: [{ name: "streamIds", type: "uint256[]", internalType: "uint256[]" }],
      stateMutability: "nonpayable",
    },
    {
      type: "error",
      name: "AddressEmptyCode",
      inputs: [{ name: "target", type: "address", internalType: "address" }],
    },
    {
      type: "error",
      name: "AddressInsufficientBalance",
      inputs: [{ name: "account", type: "address", internalType: "address" }],
    },
    { type: "error", name: "FailedInnerCall", inputs: [] },
    { type: "error", name: "SablierV2BatchLockup_BatchSizeZero", inputs: [] },
    {
      type: "error",
      name: "SafeERC20FailedOperation",
      inputs: [{ name: "token", type: "address", internalType: "address" }],
    },
  ],
} as const;
