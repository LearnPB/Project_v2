import { topPlayer } from '../../../lib/server/sql/dbIndex';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { limit } = await request.json();
    const players = topPlayer(limit || 10);

    return new Response(JSON.stringify({
      summaries: players.map((player) => ({
        slug: player.playerName.replace(/\s+/g, '-').toLowerCase(),
        title: player.playerName,
        totalPay: player.totalPay // assuming 'cleanTotalPay' is the correct property name
      }))
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in endpoint:', error);
    return new Response(JSON.stringify({ summaries: [] }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
};
