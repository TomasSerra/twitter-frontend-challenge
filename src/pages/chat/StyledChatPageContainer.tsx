import styled from "styled-components";

export const StyledChatPageContainer = styled.div`
  height: 100vh;
  border-right: 1px solid #ebeef0;
  max-width: 700px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
    padding-bottom: 40px;
  }
`;
