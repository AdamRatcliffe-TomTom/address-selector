import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { tombac, Box, extractStylingProps } from "tombac";
import TomTomSearchBox from "@tomtom-international/web-sdk-plugin-searchbox";
import { services } from "@tomtom-international/web-sdk-services";
import { SearchIcon } from "tombac-icons";

import "@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css";

const Container = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
  border-width: ${tombac.unit(1)};
  border-style: solid;
  border-color: ${(props) =>
    props.invalid
      ? tombac.color("primary", 500)
      : props.focused
      ? tombac.color("accent", 500)
      : tombac.color("neutral", 400)};
  border-radius: ${tombac.unit(0, 2, 2, 0)};
  transition: 0.1s ease-out;
  transition-property: border-color, background-color, color;

  .tt-search-box {
    padding-left: ${tombac.space(4.5)};
    margin-top: 0;
    flex: 1;
  }

  .tt-search-box-input-container {
    height: ${tombac.space(5)};
    padding: 0;
    border: none;
  }

  .tt-search-box-input-container.-focused {
    box-shadow: none;
  }

  .tt-search-box-input {
    ${tombac.text({ fontSize: 14 })};
    padding-left: 0;
    width: 100%;
  }

  .tt-search-box-close-icon {
    display: none;
  }

  .tt-search-box-result-list-container {
    left: 0;
  }

  .tt-search-box-result-list {
    ${tombac.text()};
  }

  .tt-search-box-result-list-bold {
    ${tombac.text({
      fontFamily: tombac.altFontFamily
    })};
    font-weight: 600;
  }

  .tt-search-box-result-list-text-content,
  .tt-search-box-result-list-text-suggestion {
    margin-top: 0;
    font-size: ${tombac.unit(14)};
  }

  .TombacIcon--search {
    position: absolute;
    top: ${tombac.space(1)};
    left: ${tombac.space(1)};
    z-index: 10;
  }
`;

const defaultSearchBoxOptions = {
  showSearchButton: false
};

const SearchBox = ({
  className,
  data,
  placeholder = "Enter delivery address",
  apiKey,
  searchOptions,
  children,
  invalid = false,
  onClick = () => {},
  onFocus = () => {},
  onBlur = () => {},
  onKeyUp = () => {},
  onLoadingStarted = () => {},
  onLoadingFinished = () => {},
  onResultsFound = () => {},
  onResultsCleared = () => {},
  onResultFocused = () => {},
  onResultSelected = () => {},
  ...rest
}) => {
  const searchBoxRef = useRef();
  const containerRef = useRef();
  const [focused, setFocused] = useState(false);
  const cls = `SearchBox ${className}`;
  const [stylingProps] = extractStylingProps(rest);

  useEffect(() => {
    const searchBox = new TomTomSearchBox(services, {
      ...defaultSearchBoxOptions,
      searchOptions: {
        ...searchOptions,
        key: apiKey
      },
      labels: {
        placeholder
      }
    });

    if (data) {
      searchBox.setValue(data.address.freeformAddress);
    }

    searchBox._inputWrapper._input.addEventListener("focus", handleFocus);
    searchBox._inputWrapper._input.addEventListener("blur", handleBlur);
    searchBox._inputWrapper._input.addEventListener("keyup", handleKeyUp);

    searchBox.on("tomtom.searchbox.loadingstarted", (event) =>
      onLoadingStarted(event)
    );
    searchBox.on("tomtom.searchbox.loadingfinished", (event) =>
      onLoadingFinished(event)
    );
    searchBox.on("tomtom.searchbox.resultsfound", (event) =>
      onResultsFound(event)
    );
    searchBox.on("tomtom.searchbox.resultscleared", (event) =>
      onResultsCleared(event)
    );
    searchBox.on("tomtom.searchbox.resultfocused", (event) =>
      onResultFocused(event)
    );
    searchBox.on("tomtom.searchbox.resultselected", (event) =>
      onResultSelected(event.data.result)
    );

    searchBoxRef.current = searchBox;

    const searchBoxHtml = searchBox.getSearchBoxHTML();
    containerRef.current.appendChild(searchBoxHtml);
  }, []);

  useEffect(() => {
    const searchBox = searchBoxRef.current;
    if (searchBox && data) {
      searchBox.setValue(data.address.freeformAddress);
    }
  }, [data]);

  useEffect(() => {
    const searchBox = searchBoxRef.current;
    if (searchBox) {
      searchBox.updateOptions({
        ...defaultSearchBoxOptions,
        searchOptions: {
          ...searchOptions,
          key: apiKey
        },
        labels: {
          placeholder
        }
      });
    }
  }, [searchOptions, apiKey, placeholder]);

  const handleKeyUp = (event) => {
    const { value } = event.target;
    onKeyUp(value, event);
  };

  const handleFocus = () => {
    setFocused(true);
    onFocus();
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur();
  };

  return (
    <Container
      className={cls}
      ref={containerRef}
      focused={focused}
      invalid={invalid}
      onClick={onClick}
      {...stylingProps}
    >
      <SearchIcon />
      {children}
    </Container>
  );
};

export default SearchBox;
