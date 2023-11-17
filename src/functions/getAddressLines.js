export default function getAddressLines(result) {
  const { address, poi, type } = result;

  if (
    type === "Point Address" ||
    type === "Address Range" ||
    type === "Cross Street"
  ) {
    return [
      `${address.streetNumber} ${address.streetName}`,
      `${address.municipality}, ${address.country}`
    ];
  } else if (type === "POI") {
    return [poi.name, address.freeformAddress];
  } else if (type === "Street") {
    return [
      address.streetName,
      `${address.postalCode} ${address.municipality}`
    ];
  } else if (type === "Geography") {
    switch (this._result.entityType) {
      case "Municipality":
        return [address.municipality, address.country];
      case "MunicipalitySubdivision":
        return [address.municipalitySubdivision, address.municipality];
      case "Country":
        return [address.country, address.country];
      case "CountrySubdivision":
        return [address.countrySubdivision, address.country];
      default:
        return [address.freeformAddress];
    }
  } else {
    return [address.freeformAddress];
  }
}
