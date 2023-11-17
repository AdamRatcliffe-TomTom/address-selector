import React, { useState } from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { TombacApp, tombac } from "tombac";
import SearchBox from "./components/SearchBox";
import DeliveryAddress from "./components/DeliveryAddress";

const API_KEY = "<YOUR-API-KEY>";

const AddressContainer = styled.div`
  width: ${tombac.unit(400)};
  margin-left: ${tombac.space(4)};
  margin-top: ${tombac.space(4)};
`;

const App = () => {
  const [state, setState] = useState({});
  const { deliveryAddress } = state;

  const handleAddressChange = (address) => {
    setState((state) => ({ ...state, deliveryAddress: address }));
  };

  return (
    <TombacApp>
      <AddressContainer>
        {!deliveryAddress && (
          <SearchBox apiKey={API_KEY} onResultSelected={handleAddressChange} />
        )}
        {deliveryAddress && (
          <DeliveryAddress
            $mt="1sp"
            apiKey={API_KEY}
            address={deliveryAddress}
            onChange={handleAddressChange}
          />
        )}
      </AddressContainer>
    </TombacApp>
  );
};

render(<App />, document.getElementById("root"));
