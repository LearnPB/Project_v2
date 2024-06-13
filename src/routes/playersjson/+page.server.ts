
import { topPlayer } from '../../lib/server/sql/dbIndex';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const players = topPlayer();

  return {
    summaries: players.map((player) => ({
      slug: player.playerName.replace(/\s+/g, '-').toLowerCase(),
      title: player.playerName,
      totalPay: player.totalPay
    }))
  };
};
