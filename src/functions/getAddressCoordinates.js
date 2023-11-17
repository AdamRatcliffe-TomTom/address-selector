export default function getAddressCoordinates(address) {
  const { position } = address;
  return [position.lng, position.lat];
}
