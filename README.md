![Sablier Sandbox](/packages/assets/banner.png)

# Sablier Sandbox

Front-end sandbox development environments for Sablier.

## Background

Sablier is a smart contract protocol that enables trustless streaming of ERC-20 assets, which means the ability to make
payments by the second.

### Lockup

There are three types of lockup streaming in Sablier:

- **LockupLinear**, abbreviated as **LL**, which creates streams with linear streaming functions
- **LockupDynamic**, abbreviated as **LD**, which creates streams with dynamic streaming functions (examples:
  exponentials, logarithms)
- **LockupTranched**, abbreviated as **LT**, which creates streams with stepper/tranched streaming functions (examples:
  monthly, timelocks, step functions)

For more information, please refer to our [documentation](https://docs.sablier.com).

We also support examples of how to **Withdraw** from a Lockup stream.

### Flow

Flow streams work within an open-ended model (no upfront deposits, top-ups, rate adjustments, no end date).

For more information, please refer to our [documentation](https://docs.sablier.com).

The sandbox will showcase how to create a **Flow** stream with a certain rate per second and initial deposit (which can
also be topped up later on).

We also support examples of how to **Withdraw** from a Flow stream.

## Environments and Examples

![Sablier Sandbox](/packages/assets/banner-s2.png)

### Wagmi

The official Sablier interface uses [wagmi](wagmi.sh/) and [viem](https://viem.sh/). Both libraries offer top-notch
support (check the docs and their github) and integrate nicely with wallet managers like RainbowKit or AppKit.

| Flow (Form)                            | Lockup Dynamic (Form)                            | Headless                                  |
| -------------------------------------- | ------------------------------------------------ | ----------------------------------------- |
| ![FL](./packages/assets/flow-dark.png) | ![LD](./packages/assets/lockup-dynamic-dark.png) | ![H](./packages/assets/headless-dark.png) |

#### Features

**↪ Single stream management through Lockup**

- Create an LL, LD or LT stream with Durations using the UI Form
- Create an LL, LD or LT stream with Durations in headless mode (tweak durations in code)
- Create an LL, LD or LT stream with Timestamps in headless mode (tweak timestamps in code)
- Withdraw from any Lockup (LL, LD or LT) stream using the UI Form

**↪ Single stream management through Flow**

- Create a Flow stream using the UI Form
- Withdraw from a Flow stream using the UI Form

**↪ Batch stream creation through Batch Lockup**

- Create group of LL, LD or LT streams with all possible configurations in headless mode, through a dedicated periphery.

Most of the transaction magic happens in [`models/LockupCore.ts`](/examples/wagmi/src/models/LockupCore.ts) and
[`models/FlowCore.ts`](/examples/wagmi/src/models/FlowCore.ts). Have a look to understand how parameters are formatted
(strings to BigInt, padding numbers with decimals, etc.) and sent to the contracts.

For the **headless** mode, see [`constants/data.ts`](/examples/wagmi/src/constants/data.ts). Here, you'll be able to
tweak the parameters to create streams of different values or shapes (segments).

**↪ Misc.**

- Mint [Sepolia DAI](https://sepolia.etherscan.io/token/0x776b6fc2ed15d6bb5fc32e0c89de68683118c62a) tokens
- Approve spending DAI tokens for any Lockup or Flow contract

#### Next steps

In the UI Forms, you may find `Prefill form` buttons. Clicking on them will add pre-configured data into the fields as
an example of what the data should look like.

After you create a test stream, make sure to connect to our main [app.sablier.com](https://app.sablier.com) interface
with your "sender" wallet to see what the stream [actually looks like](https://docs.sablier.com/apps/features/overview).

| Payload (LD with two segments)            | Shape                                      |
| ----------------------------------------- | ------------------------------------------ |
| ![E](./packages/assets/emission-code.png) | ![E](./packages/assets/emission-shape.png) |

---

![Sablier V2 Sandbox](/packages/assets/banner-s1.png)

### Ethers V6

An integration of Sablier contracts into a frontend environment that uses [Ethers V6](https://docs.ethers.org/v6/). It's
a small app that runs on the Sepolia testnet and provides an injected wallet connection out of the box.

> [!TIP]
>
> The Ethers examples do not include all possible variations, so we invite you to look into the Wagmi examples and
> attempt to convert them yourself.

#### Features

- Create an LL, LD or LT stream with Durations or Timestamps in headless mode (tweak durations in code)
