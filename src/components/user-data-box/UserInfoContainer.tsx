import styled from "styled-components";

export const StyledUserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  width: 100%;
  padding-left: 8px;
  overflow: hidden;

  p {
    font-family: "Manrope", sans-serif;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%;
    letter-spacing: -0.15px;
    margin: 0;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    padding-bottom: 5px;
  }
`;
