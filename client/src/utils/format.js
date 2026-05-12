export const formatKES = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return 'KSh 0';
  return `KSh ${num.toLocaleString('en-KE')}`;
};

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatDateShort = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-KE');
};
