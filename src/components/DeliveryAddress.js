import React from "react";
import styled from "styled-components";
import { tombac, Box, Tooltip, Button, extractStylingProps } from "tombac";
import { EditIcon } from "tombac-icons";
import AddressEditor from "./AddressEditor";
import getAddressLines from "../functions/getAddressLines";

import "tombac-icons/react/style.css";

const Container = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${tombac.space(2)};

  .TombacIcon--edit {
    cursor: pointer;
  }
`;

const PrimaryText = styled.span`
  ${tombac.text({
    fontFamily: tombac.altFontFamily,
    fontWeight: 600,
    fontSize: 16
  })};
  display: block;
`;

const SecondaryText = styled.span`
  ${tombac.text({
    fontSize: 16,
    color: "#666"
  })};
`;

const Actions = styled.div`
  display: flex;
  gap: ${tombac.space(1)};
`;

const DeliveryAddress = ({
  apiKey,
  searchOptions,
  mapStyle,
  address,
  onChange,
  ...rest
}) => {
  const [primaryLine, secondaryLine] = getAddressLines(address);
  const [stylingProps] = extractStylingProps(rest);

  return (
    <Tooltip
      className="AddressEditor-tooltip"
      closeOnOutsideClick
      placement="bottom"
      content={({ close }) => (
        <AddressEditor
          apiKey={apiKey}
          searchOptions={searchOptions}
          mapStyle={mapStyle}
          title={primaryLine}
          address={address}
          onChange={(address) => {
            onChange(address);
            close();
          }}
        />
      )}
    >
      {({ ref, toggle }) => (
        <Container className="DeliveryAddress" {...stylingProps}>
          <div>
            <PrimaryText>{primaryLine}</PrimaryText>
            <SecondaryText>{secondaryLine}</SecondaryText>
          </div>
          <Actions>
            <Button ref={ref} size="s" shape="circle" onClick={toggle}>
              <EditIcon />
            </Button>
          </Actions>
        </Container>
      )}
    </Tooltip>
  );
};

export default DeliveryAddress;
