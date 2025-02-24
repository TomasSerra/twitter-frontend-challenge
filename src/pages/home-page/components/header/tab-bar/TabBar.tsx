import React, { useState } from "react";
import Tab from "./tab/Tab";
import { updateFeed } from "../../../../../redux/user";
import useHttpRequestService from "../../../../../service/useHttpRequestService";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../redux/hooks";
import { StyledTabBarContainer } from "./TabBarContainer";
import { useGetFeed } from "../../../../../hooks/useGetFeed";

const TabBar = () => {
  const [activeFirstPage, setActiveFirstPage] = useState(true);
  const dispatch = useAppDispatch();
  const { getFollowedPosts } = useHttpRequestService();
  const { posts } = useGetFeed();
  const { t } = useTranslation();

  const handleClick = async (value: boolean) => {
    setActiveFirstPage(value);
    const data = value ? posts : await getFollowedPosts();
    dispatch(updateFeed(data));
  };

  return (
    <>
      <StyledTabBarContainer>
        <Tab
          active={activeFirstPage}
          text={t("header.for-you")}
          onClick={() => handleClick(true)}
        />
        <Tab
          active={!activeFirstPage}
          text={t("header.following")}
          onClick={() => handleClick(false)}
        />
      </StyledTabBarContainer>
    </>
  );
};

export default TabBar;
