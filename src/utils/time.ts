/**
 * Convert seconds to time
 * 23 => 00:23
 * 63 => 01:03
 */
export const formatTimeBySeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  return formattedTime;
};
