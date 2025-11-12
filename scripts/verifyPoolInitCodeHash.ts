/**
 * Verify POOL_INIT_CODE_HASH in PoolAddress.sol
 *
 * This script verifies that the POOL_INIT_CODE_HASH constant in PoolAddress.sol
 * matches the actual hash of the deployed UniswapV3Pool bytecode from v3-core.
 *
 * Usage:
 *   CORE_PATH=../v3-core npx hardhat run scripts/verifyPoolInitCodeHash.ts
 */

import { ethers } from 'hardhat'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('Verifying POOL_INIT_CODE_HASH...\n')

  // Get the v3-core path from environment variable or use default
  const corePath = process.env.CORE_PATH || '../v3-core'
  const coreArtifactPath = path.join(
    __dirname,
    '..',
    corePath,
    'artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'
  )

  // Check if v3-core artifact exists
  if (!fs.existsSync(coreArtifactPath)) {
    console.error('Error: UniswapV3Pool artifact not found at:', coreArtifactPath)
    console.error('Please ensure v3-core is compiled and CORE_PATH is correct')
    process.exit(1)
  }

  // Read the v3-core artifact
  const artifact = JSON.parse(fs.readFileSync(coreArtifactPath, 'utf8'))
  const bytecode = artifact.bytecode

  if (!bytecode || bytecode === '0x') {
    console.error('Error: Bytecode is empty!')
    process.exit(1)
  }

  // Compute the actual hash
  const actualHash = ethers.utils.keccak256(bytecode)

  // Read the PoolAddress.sol file to extract the hardcoded hash
  const poolAddressPath = path.join(__dirname, '../contracts/libraries/PoolAddress.sol')
  const poolAddressContent = fs.readFileSync(poolAddressPath, 'utf8')

  // Extract the POOL_INIT_CODE_HASH value using regex
  const hashMatch = poolAddressContent.match(
    /POOL_INIT_CODE_HASH\s*=\s*(0x[a-fA-F0-9]{64})/
  )

  if (!hashMatch) {
    console.error('Error: Could not find POOL_INIT_CODE_HASH in PoolAddress.sol')
    process.exit(1)
  }

  const declaredHash = hashMatch[1]

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Hash Comparison:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Declared in PoolAddress.sol: ${declaredHash}`)
  console.log(`Actual from v3-core bytecode: ${actualHash}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (actualHash.toLowerCase() === declaredHash.toLowerCase()) {
    console.log('SUCCESS: POOL_INIT_CODE_HASH is correct!\n')
    console.log('Pool addresses will be computed correctly.\n')
  } else {
    console.log('ERROR: POOL_INIT_CODE_HASH mismatch!\n')
    console.log('This will cause pool address computation to fail.')
    console.log('Pool creation and liquidity operations will not work.\n')
    console.log('To fix:')
    console.log(`1. Update PoolAddress.sol line with: ${actualHash}`)
    console.log('2. Or run: cd ../v3-core && npx hardhat run scripts/computePoolInitCodeHash.ts\n')
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
