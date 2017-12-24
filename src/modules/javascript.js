const getEnvironment = () => {
  if (typeof global === 'object') {
    return global;
  }
  if (typeof window === 'object') {
    return window;
  }
  throw new Error('Unknown environment');
};

module.exports = (env) => {
  const environment = getEnvironment();
  const keys = Object.keys(environment);
  for (const key of keys) {
    env.set(`js/${key}`, environment[key]);
  }
  console.log(env);
}

