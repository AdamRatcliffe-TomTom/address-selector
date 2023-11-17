import tt from "@tomtom-international/web-sdk-maps";

export default function calculateBounds(coordinates) {
  const bounds = coordinates.reduce((bounds, coord) => {
    return bounds.extend(coord);
  }, new tt.LngLatBounds(coordinates[0], coordinates[0]));
  return bounds.toArray();
}
