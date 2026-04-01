import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

export default async function handler(req, res) {
  const { shelterId } = req.query;

  if (!shelterId) {
    return res.status(400).json({ error: 'Shelter ID is required' });
  }

  try {
    const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
    
    // TODO: Call view_ships or query the object
    const result = await client.getObject({
      id: shelterId,
      options: { showContent: true },
    });

    res.status(200).json({
      success: true,
      shelterId,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
