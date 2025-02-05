import { useEffect, useState } from "react";
import Button from "../button/Button";
import useHttpRequestService from "../../service/useHttpRequestService";
import UserDataBox from "../user-data-box/UserDataBox";
import { useTranslation } from "react-i18next";
import { ButtonColor, ButtonSize, ButtonType } from "../button/StyledButton";
import { Author } from "../../service";
import { useMe } from "../../hooks/useMe";
import { StyledFollowUserBoxContainer } from "./FollowUserBoxContainer";
import { useNavigate } from "react-router-dom";

interface FollowUserBoxProps {
  profilePicture?: string;
  name?: string;
  username?: string;
  id: string;
  size?: ButtonSize;
}

const FollowUserBox = ({
  profilePicture,
  name,
  username,
  id,
  size = ButtonSize.MEDIUM,
}: FollowUserBoxProps) => {
  const { t } = useTranslation();
  const { unfollowUser, followUser } = useHttpRequestService();
  const { data: me } = useMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (me) {
      setIsFollowing(me?.following?.some((f: Author) => f.id === id));
    }
  }, [me]);

  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isFollowing) {
      await unfollowUser(id);
    } else {
      await followUser(id);
    }
    setIsFollowing(!isFollowing);
  };

  const handleClick = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <StyledFollowUserBoxContainer onClick={handleClick}>
      <UserDataBox
        id={id}
        name={name!}
        profilePicture={profilePicture!}
        username={username!}
      />
      <Button
        buttonColor={isFollowing ? ButtonColor.WHITE : ButtonColor.PRIMARY}
        buttonType={isFollowing ? ButtonType.OUTLINED : ButtonType.FULFILLED}
        size={size}
        onClick={(e) => {
          handleFollow(e);
        }}
      >
        {isFollowing ? t("buttons.unfollow") : t("buttons.follow")}
      </Button>
    </StyledFollowUserBoxContainer>
  );
};

export default FollowUserBox;
