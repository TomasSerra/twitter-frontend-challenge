import Avatar from "../common/avatar/Avatar";
import icon from "../../assets/icon.jpg";
import { StyledUserDataBoxContainer } from "./UserDataBoxContainer";
import { StyledUserInfoContainer } from "./UserInfoContainer";

interface UserDataBoxProps {
  name?: string;
  username?: string;
  profilePicture?: string;
  id: string;
  onClick?: () => void;
}
export const UserDataBox = ({
  name,
  username,
  profilePicture,
  id,
  onClick,
}: UserDataBoxProps) => {
  return (
    <StyledUserDataBoxContainer onClick={onClick}>
      <Avatar
        width={"48px"}
        height={"48px"}
        src={profilePicture ?? icon}
        alt={name ?? "Name"}
      />
      <StyledUserInfoContainer>
        <p>{name ?? "Name"}</p>
        <p style={{ color: "#566370" }}>{"@" + (username ?? "Username")}</p>
      </StyledUserInfoContainer>
    </StyledUserDataBoxContainer>
  );
};

export default UserDataBox;
