import { useEffect, useState } from "react";
import Button from "../button/Button";
import useHttpRequestService from "../../service/useHttpRequestService";
import UserDataBox from "../user-data-box/UserDataBox";
import { useTranslation } from "react-i18next";
import { ButtonColor, ButtonSize, ButtonType } from "../button/StyledButton";
import { Author } from "../../service";
import { useMe } from "../../hooks/useMe";
import { StyledFollowUserBoxContainer } from "./FollowUserBoxContainer";

interface FollowUserBoxProps {
  profilePicture?: string;
  name?: string;
  username?: string;
  id: string;
}

const FollowUserBox = ({
  profilePicture,
  name,
  username,
  id,
}: FollowUserBoxProps) => {
  const { t } = useTranslation();
  const { unfollowUser, followUser } = useHttpRequestService();
  const { data: user } = useMe();

  useEffect(() => {
    if (user) {
      setIsFollowing(user.following.some((f: Author) => f.id === id));
    }
  }, [user]);

  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    if (isFollowing) {
      await unfollowUser(id);
    } else {
      await followUser(id);
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <StyledFollowUserBoxContainer>
      <UserDataBox
        id={id}
        name={name!}
        profilePicture={profilePicture!}
        username={username!}
      />
      <Button
        buttonColor={isFollowing ? ButtonColor.WHITE : ButtonColor.PRIMARY}
        buttonType={isFollowing ? ButtonType.OUTLINED : ButtonType.FULFILLED}
        size={ButtonSize.MEDIUM}
        onClick={handleFollow}
      >
        {isFollowing ? t("buttons.unfollow") : t("buttons.follow")}
      </Button>
    </StyledFollowUserBoxContainer>
  );
};

export default FollowUserBox;
