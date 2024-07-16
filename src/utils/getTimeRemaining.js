export const getTimeRemaining = () => {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = midnight - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
};

export const getCooldownTime = () => {
  const cooldownTime = localStorage.getItem('cooldownTime');
  return cooldownTime ? new Date(cooldownTime) : null;
};

export const setCooldownTime = (time) => {
  localStorage.setItem('cooldownTime', time.toISOString());
};

export const calculateCountdownRemaining = (endTime) => {
  const now = new Date();
  const diff = endTime - now;
  return Math.max(Math.floor((diff % (1000 * 60)) / 1000), 0);
};

export const getDashboardData = () => {
  const cooldownTime = localStorage.getItem('dashboardData');
  return JSON.parse(cooldownTime) ?? null;
};

export const setDashboardData = (data) => {
  localStorage.setItem('dashboardData', JSON.stringify(data));
};
