import { error } from '@sveltejs/kit';
import { topPlayers } from '../toPlayer';

export function load({ params }) {
  // Replace hyphens with spaces and convert to lower case for case-insensitive matching
  const playerName = params.playerjson.replace(/-/g, " ").toLowerCase();

  // Find the player with case-insensitive comparison
  const playerful = topPlayers.find(
    (player) => player.PlayerName.toLowerCase() === playerName
  );

  // const playerpay = topPlayers.find(
  //   (player) => player.CleanTotalPay
  // );

  if (!playerful) {
    // Log the error for debugging purposes
    console.error(`Player not found: ${params.playerjson}`);
    throw error(404, `Player "${params.playerjson}" Not Found`);
  }

  const playerpay = playerful.totalPay;

  return {
    playerful,
    playerpay
  };
}