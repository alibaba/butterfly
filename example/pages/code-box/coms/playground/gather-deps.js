const regexp = /require\("(.+)"\)/g;

const gatherDeps = (code) => {
  const result = code.match(regexp);

  if (!result) {
    return [];
  }

  const deps = result.map(item => {
    const match = item.match(/require\("(.+)"\)/);

    return match[1];
  });

  return deps;
};

export default gatherDeps;
