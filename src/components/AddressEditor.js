import React, { useRef, useState } from "react";
import styled from "styled-components";
import {
  tombac,
  defaultColorPalette,
  Box,
  Button,
  Text,
  extractStylingProps
} from "tombac";
import Map, { Marker, Icon } from "react-tomtom-maps";
import SearchBox from "./SearchBox";
import getMainEntryPointForAddress from "../functions/getMainEntryPointForAddress";
import getAddressCoordinates from "../functions/getAddressCoordinates";
import calculateBounds from "../functions/calculateBounds";

const EditorMode = {
  EDIT_ADDRESS: "EDIT_ADDRESS",
  ADJUST_PIN: "ADJUST_PIN"
};

const Container = styled(Box)`
  width: ${tombac.unit(360)};
  padding: ${tombac.space(1)};

  .mapboxgl-map div[class*="Box"] {
    line-height: 0;
  }
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: ${tombac.space(1)};

  > button {
    font-weight: bold;
    border-radius: ${tombac.space(
      2.5
    )}; // Should not be necessary to set this explictly, this is now the default for tombac
    flex: 1;
  }
`;

const EntryPoint = styled.div`
  width: ${tombac.unit(12)};
  height: ${tombac.unit(12)};
  border-radius: 50%;
  background: ${(props) => props.color || defaultColorPalette.lightRed};
`;

const Legend = () => (
  <Box $display="flex" $alignItems="center" $gap="1sp" $mt="1sp" $mb="1sp">
    <EntryPoint />
    <Text $mt="2u">Entry point</Text>
  </Box>
);

const AddressEditor = ({
  address,
  apiKey,
  searchOptions,
  mapStyle = "https://api.tomtom.com/map/1/style/21.2.3-3/basic_light-map.json",
  onChange = () => {},
  ...rest
}) => {
  const mapRef = useRef();

  const entryPoint = getMainEntryPointForAddress(address);

  const [state, setState] = useState({
    mode: EditorMode.EDIT_ADDRESS,
    address,
    entryPoint,
    bounds: calculateBounds([
      getAddressCoordinates(address),
      getAddressCoordinates(entryPoint)
    ])
  });

  const [stylingProps] = extractStylingProps(rest);

  const handleResultSelected = (address) => {
    const entryPoint = getMainEntryPointForAddress(address);
    const bounds = calculateBounds([
      getAddressCoordinates(address),
      getAddressCoordinates(entryPoint)
    ]);
    setState((state) => ({ ...state, address, entryPoint, bounds }));
  };

  const handlePinAdjustment = () => {
    const mapCenter = mapRef.current.getMap().getCenter();
    const updatedAddress = {
      ...address,
      position: mapCenter
    };
    setState((state) => ({
      ...state,
      mode: EditorMode.EDIT_ADDRESS,
      address: updatedAddress
    }));
  };

  const handleSave = () => {
    onChange(state.address);
  };

  return (
    <Container className="AddressEditor" {...stylingProps}>
      {
        {
          [EditorMode.EDIT_ADDRESS]: (
            <>
              <SearchBox
                $mb="2sp"
                placeholder="Enter new delivery address"
                apiKey={apiKey}
                searchOptions={searchOptions}
                onResultSelected={handleResultSelected}
              />
              <Map
                apiKey={apiKey}
                mapStyle={mapStyle}
                containerStyle={{ width: "100%", height: 160 }}
                bounds={state.bounds}
                fitBoundsOptions={{
                  animate: false,
                  padding: 48
                }}
              >
                {state.entryPoint && (
                  <Marker
                    coordinates={getAddressCoordinates(state.entryPoint)}
                    anchor="center"
                  >
                    <EntryPoint />
                  </Marker>
                )}
                <Marker coordinates={getAddressCoordinates(state.address)} />
              </Map>
              <Legend />
              <ButtonContainer>
                <Button
                  size="m"
                  onClick={() =>
                    setState((state) => ({
                      ...state,
                      mode: EditorMode.ADJUST_PIN
                    }))
                  }
                >
                  Adjust Pin
                </Button>
              </ButtonContainer>
              <ButtonContainer $mt="2sp">
                <Button size="m" variant="primary" onClick={handleSave}>
                  Save Address
                </Button>
              </ButtonContainer>
            </>
          ),
          [EditorMode.ADJUST_PIN]: (
            <>
              <Map
                ref={mapRef}
                apiKey={apiKey}
                mapStyle={mapStyle}
                containerStyle={{ width: "100%", height: 258 }}
                bounds={state.bounds}
                fitBoundsOptions={{
                  padding: 48
                }}
              >
                {entryPoint && (
                  <Marker
                    coordinates={getAddressCoordinates(state.entryPoint)}
                    anchor="center"
                  >
                    <EntryPoint />
                  </Marker>
                )}
                <Box
                  $position="absolute"
                  $top="50%"
                  $left="50%"
                  $mt="-36u"
                  $ml="-15u"
                >
                  <Icon />
                </Box>
              </Map>
              <ButtonContainer $mt="2sp">
                <Button
                  size="m"
                  onClick={() =>
                    setState((state) => ({
                      ...state,
                      mode: EditorMode.EDIT_ADDRESS
                    }))
                  }
                >
                  Cancel
                </Button>
                <Button
                  size="m"
                  variant="primary"
                  onClick={handlePinAdjustment}
                >
                  Save
                </Button>
              </ButtonContainer>
            </>
          )
        }[state.mode]
      }
    </Container>
  );
};

export default AddressEditor;
