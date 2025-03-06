import Tab from "./tab/Tab";
import { useTranslation } from "react-i18next";
import { StyledTabBarContainer } from "./TabBarContainer";

interface TabBarProps {
  activePage: boolean;
  setActivePage: (value: boolean) => void;
}

const TabBar = ({ setActivePage, activePage }: TabBarProps) => {
  const { t } = useTranslation();

  const handleClick = async (value: boolean) => {
    setActivePage(value);
  };

  return (
    <>
      <StyledTabBarContainer>
        <Tab
          active={activePage}
          text={t("header.for-you")}
          onClick={() => handleClick(true)}
        />
        <Tab
          active={!activePage}
          text={t("header.following")}
          onClick={() => handleClick(false)}
        />
      </StyledTabBarContainer>
    </>
  );
};

export default TabBar;
