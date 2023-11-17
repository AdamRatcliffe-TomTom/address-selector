export default function getMainEntryPointForAddress(address) {
  const { entryPoints } = address;
  const entryPoint =
    Array.isArray(entryPoints) && entryPoints.find((ep) => ep.type === "main");
  return entryPoint;
}
