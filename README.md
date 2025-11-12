# JuiceSwap V3 Periphery

[![Tests](https://github.com/JuiceSwapXyz/v3-periphery/workflows/Tests/badge.svg)](https://github.com/JuiceSwapXyz/v3-periphery/actions?query=workflow%3ATests)
[![Lint](https://github.com/JuiceSwapXyz/v3-periphery/workflows/Lint/badge.svg)](https://github.com/JuiceSwapXyz/v3-periphery/actions?query=workflow%3ALint)

This repository contains the periphery smart contracts for JuiceSwap V3, a fork of Uniswap V3 Protocol.
For the lower level core contracts, see the [v3-core](https://github.com/JuiceSwapXyz/v3-core) repository.

## Overview

JuiceSwap V3 Periphery provides user-facing smart contracts for interacting with the JuiceSwap V3 Protocol, including:

- **SwapRouter** - Multi-hop swap execution with exact input/output amounts
- **NonfungiblePositionManager** - ERC721 NFT representation of liquidity positions
- **V3Migrator** - Migration from V2 to V3 positions
- **Quoter** - Off-chain quote calculations for swap pricing
- **Oracle Library** - TWAP oracle utilities

## Key Modifications from Uniswap V3

- Updated `POOL_INIT_CODE_HASH` for JuiceSwap's modified pool contract (50% max protocol fee vs 25%)
- Rebranded NFT positions: `JuiceSwap V3 Positions NFT-V1` with symbol `JUICE-V3-POS`
- Updated package name: `@juiceswapxyz/v3-periphery`

## Local Deployment

Install the npm package `@juiceswapxyz/v3-periphery` and import bytecode from artifacts:

```typescript
import {
  abi as SWAP_ROUTER_ABI,
  bytecode as SWAP_ROUTER_BYTECODE,
} from '@juiceswapxyz/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'

// deploy the bytecode
```

## Using Solidity Interfaces

Import JuiceSwap v3 periphery interfaces into your smart contracts:

```solidity
import '@juiceswapxyz/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract MyContract {
  ISwapRouter router;

  function doSomethingWithSwapRouter() {
    // router.exactInput(...);
  }
}
```

## Development

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Verify Pool Init Code Hash

Before deployment, verify that `POOL_INIT_CODE_HASH` matches the compiled v3-core bytecode:

```bash
npm run verify-pool-hash
```

This step is **critical** - an incorrect hash will cause all pool operations to fail.

## License

GPL-2.0-or-later
