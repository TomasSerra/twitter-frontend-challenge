import { useState } from "react";
import { StyledContainer } from "../common/Container";
import Button from "../button/Button";
import { ButtonColor, ButtonSize, ButtonType } from "../button/StyledButton";
import { StyledInput } from "./StyledInput";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  return (
    <StyledContainer
      borderTop={"1px solid #ebeef0"}
      display="flex"
      flexDirection="row"
      padding={"10px 15px"}
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      marginBottom={"20px"}
      gap={"20px"}
    >
      <StyledInput
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <Button
        size={ButtonSize.SMALL}
        buttonType={ButtonType.FULFILLED}
        buttonColor={ButtonColor.PRIMARY}
      >
        Send
      </Button>
    </StyledContainer>
  );
};

export default ChatInput;
