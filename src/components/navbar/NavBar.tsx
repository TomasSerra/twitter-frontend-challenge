import { useState } from "react";
import NavItem from "./navItem/NavItem";
import Button from "../button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { StyledTweetButton } from "../tweet-button/StyledTweetButton";
import TweetModal from "../tweet-modal/TweetModal";
import { IconType, LogoIcon } from "../icon/Icon";
import { useTranslation } from "react-i18next";
import { ButtonColor, ButtonSize, ButtonType } from "../button/StyledButton";
import { StyledNavBarContainer } from "./NavBarContainer";
import { StyledContainer } from "../common/Container";
import { StyledIconContainer } from "./IconContainer";
import { StyledNavItemsContainer } from "./navItem/NavItemsContainer";
import ProfileLogoutPrompt from "../profile-logout/ProfileLogoutPrompt";
import { useMe } from "../../hooks/useMe";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tweetModalOpen, setTweetModalOpen] = useState(false);
  const { data: user } = useMe();
  const { t } = useTranslation();

  return (
    <StyledNavBarContainer>
      <StyledContainer flex={1}>
        <StyledIconContainer>
          <LogoIcon />
        </StyledIconContainer>
        <StyledNavItemsContainer>
          <NavItem
            title={t("navbar.home")}
            onClick={() => {
              navigate("/");
            }}
            icon={IconType.HOME}
            selectedIcon={IconType.ACTIVE_HOME}
            active={location.pathname === "/"}
          />
          <NavItem
            title={t("navbar.profile")}
            onClick={() => {
              navigate(`/profile/${user?.id}`);
            }}
            icon={IconType.PROFILE}
            selectedIcon={IconType.ACTIVE_PROFILE}
            active={location.pathname === `/profile/${user?.id}`}
          />
          <StyledTweetButton onClick={() => navigate("/compose/tweet")}>
            +
          </StyledTweetButton>
        </StyledNavItemsContainer>
        <StyledContainer width={"100%"}>
          <Button
            size={ButtonSize.LARGE}
            buttonType={ButtonType.FULFILLED}
            buttonColor={ButtonColor.PRIMARY}
            onClick={() => {
              setTweetModalOpen(true);
            }}
          >
            Tweet
          </Button>
        </StyledContainer>
        <TweetModal
          open={tweetModalOpen}
          onClose={() => {
            setTweetModalOpen(false);
          }}
        />
      </StyledContainer>
      <ProfileLogoutPrompt margin={"50px 0"} direction={"column-reverse"} />
    </StyledNavBarContainer>
  );
};

export default NavBar;
