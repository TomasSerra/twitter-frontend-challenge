import Avatar from "../common/avatar/Avatar";
import icon from "../../assets/icon.jpg";
import { useNavigate } from "react-router-dom";
import "./UserDataBox.css";

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
    <div className="user-container" onClick={onClick}>
      <Avatar
        width={"48px"}
        height={"48px"}
        src={profilePicture ?? icon}
        alt={name ?? "Name"}
      />
      <div className="user-info-container">
        <p>{name ?? "Name"}</p>
        <p style={{ color: "#566370" }}>{"@" + (username ?? "Username")}</p>
      </div>
    </div>
  );
};

export default UserDataBox;
