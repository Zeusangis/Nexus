export const calculateBmi = (weight: number, height: number): number => {
  if (height <= 0) return 0;
  const heightInMeters = height / 100;
  const calculatedBmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(calculatedBmi.toFixed(2));
};
