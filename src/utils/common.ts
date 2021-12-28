// returns value between 0 and 1
export const sigmoid = (n: number) => {
  return 1 / (1 + Math.exp(-n));
};

// returns value between -1 and 1
export const tanh = (n: number) => {
  return Math.tanh(n);
};

export const random = (min = 0, max = 1): number => {
  return Math.random() * (max - min) + min;
};
