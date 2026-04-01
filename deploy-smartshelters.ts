import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { TransactionBlock } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// === HACKATHON TIP ===
// 1. Run: sui keytool generate (or export from Sui Wallet → testnet)
// 2. Copy the base64 secret key (starts with "suiprivkey...") and paste it below
//    OR create a .env file with PRIVATE_KEY=suiprivkey... and use process.env
const secretKey = process.env.PRIVATE_KEY || 'suiprivkey...'; // Use env var or paste here

const keypair = Ed25519Keypair.fromSecretKey(secretKey);

async function main() {
  // Stillness uses the mainnet/fullnode for live EVE Frontier
  const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

  try {
    console.log('🚀 Creating SmartShelter on Sui testnet...');

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `smartshelters::smartshelters::create_shelter`,
      arguments: [],
    });

    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
    });

    const shelterObjectId = result.effects?.created?.[0]?.reference?.objectId;
    console.log('✅ SmartShelter created successfully!');
    console.log('📌 Shelter Object ID (share this with your corp):', shelterObjectId);
    console.log('\nPaste this ID into the dApp to test ship swapping.');

  } catch (err: any) {
    console.error('❌ Deployment failed:');
    console.error(err.message || err);
    if (err.message?.includes('invalid signature')) {
      console.log('💡 Tip: Double-check your secret key is correct and is for testnet.');
    }
  }
}

main();
