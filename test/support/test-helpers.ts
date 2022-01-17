export const stubEnvVar = (k: keyof typeof process.env, v?: string) => {
  const currentValue = process.env[k];
  process.env[k] = v;
  return () => {
    process.env[k] = currentValue;
  };
};

export const collectTeardowns = (...teardowns: (() => void)[]) => {
  return () => {
    teardowns.forEach((td) => td());
  };
};
