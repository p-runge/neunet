// returns value between 0 and 1
export const sigmoid = (n: number) => {
  return 1 / (1 + Math.exp(-n));
};

// returns value between -1 and 1
export const tanh = (n: number) => {
  return Math.tanh(n);
};

export const random = (min = 0, max = 1 /* excluded */): number => {
  return Math.random() * (max - min) + min;
};

export const randomInt = (min = 0, max = 1 /* included */): number => {
  return Math.floor(random(min, max + 1));
};

export const hexGenerator = (length: number): string => {
  let string = '';
  let i = length;
  while (i > 0) {
    const decimal = randomInt(0, 255);
    const hex = decimal.toString(16).padStart(2, '0');
    string += hex;
    i--;
  }

  return string;
};
