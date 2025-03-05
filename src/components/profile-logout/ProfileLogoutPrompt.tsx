import LogoutPrompt from "../navbar/logout-prompt/LogoutPrompt";
import { StyledProfileLogoutPromptContainer } from "./StyledProfileLogoutPromptContainer";
import { useState } from "react";
import icon from "../../assets/icon.jpg";
import { StyledP } from "../common/text";
import { StyledContainer } from "../common/Container";
import { useMe } from "../../hooks/useMe";

interface ProfileLogoutPromptProps {
  margin: string;
  direction: string;
}

const ProfileLogoutPrompt = ({
  margin,
  direction,
}: ProfileLogoutPromptProps) => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { data: user } = useMe();

  const handleClick = () => {
    setLogoutOpen(!logoutOpen);
  };

  return (
    <StyledContainer
      maxHeight={"48px"}
      flexDirection={"row"}
      className={"profile-info"}
      alignItems={"center"}
      gap={"8px"}
      onMouseDown={handleClick}
      cursor={"pointer"}
      position="relative"
    >
      <StyledProfileLogoutPromptContainer direction={direction}>
        <img src={user?.profilePicture ?? icon} className="icon" alt="Icon" />
        <LogoutPrompt
          show={logoutOpen}
          user={user}
          margin={margin}
          onClose={() => setLogoutOpen(false)}
        />
      </StyledProfileLogoutPromptContainer>
      <StyledContainer padding={"4px 0"} gap={"4px"} className={"user-info"}>
        <StyledP primary>{user?.name}</StyledP>
        <StyledP primary={false}>{`@${user?.username}`}</StyledP>
      </StyledContainer>
    </StyledContainer>
  );
};

export default ProfileLogoutPrompt;
