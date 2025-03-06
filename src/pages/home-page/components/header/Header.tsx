import TabBar from "./tab-bar/TabBar";
import logo from "../../../../assets/logo.png";
import { StyledHeaderContainer } from "./HeaderContainer";
import ProfileLogoutPrompt from "../../../../components/profile-logout/ProfileLogoutPrompt";

interface HeaderProps {
  activePage: boolean;
  setActivePage: (value: boolean) => void;
}

const Header = ({ activePage, setActivePage }: HeaderProps) => {
  return (
    <>
      <StyledHeaderContainer>
        <ProfileLogoutPrompt margin={"58px 16px"} direction={"column"} />
        <div className="title-container" style={{ position: "relative" }}>
          <img src={logo} className="logo" alt="Logo" />
        </div>
        <TabBar activePage={activePage} setActivePage={setActivePage} />
      </StyledHeaderContainer>
    </>
  );
};

export default Header;
