import { useEffect, useState } from "react";
import ProfileInfo from "./ProfileInfo";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import { useTranslation } from "react-i18next";
import { User } from "../../service";
import {
  ButtonColor,
  ButtonSize,
  ButtonType,
} from "../../components/button/StyledButton";
import useHttpRequestService from "../../service/useHttpRequestService";
import Button from "../../components/button/Button";
import ProfileFeed from "../../components/feed/ProfileFeed";
import { StyledContainer } from "../../components/common/Container";
import { StyledH5 } from "../../components/common/text";
import { useMe } from "../../hooks/useMe";

const ProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalValues, setModalValues] = useState({
    text: "",
    title: "",
    buttonType: ButtonType.FULFILLED,
    buttonColor: ButtonColor.PRIMARY,
    buttonText: "",
  });
  const { data: me } = useMe();
  const { deleteProfile, followUser, unfollowUser, getProfileView } =
    useHttpRequestService();

  const id = useParams().id;
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleButtonType = (): {
    component: { type: ButtonType; color: ButtonColor };
    text: string;
  } => {
    if (profile?.id === me?.id)
      return {
        component: { type: ButtonType.FULFILLED, color: ButtonColor.DELETE },
        text: t("buttons.delete"),
      };
    if (following)
      return {
        component: { type: ButtonType.OUTLINED, color: ButtonColor.DELETE },
        text: t("buttons.unfollow"),
      };
    else
      return {
        component: { type: ButtonType.FULFILLED, color: ButtonColor.PRIMARY },
        text: t("buttons.follow"),
      };
  };

  const handleSubmit = () => {
    if (profile?.id === me?.id) {
      deleteProfile().then(() => {
        localStorage.removeItem("token");
        navigate("/sign-in");
      });
    } else {
      unfollowUser(profile!.id).then(async () => {
        setFollowing(false);
        setShowModal(false);
        await getProfileData();
      });
    }
  };

  useEffect(() => {
    getProfileData().then();
  }, [id]);

  if (!id) return null;

  const handleButtonAction = async () => {
    if (profile?.id === me?.id) {
      setShowModal(true);
      setModalValues({
        title: t("modal-title.delete-account"),
        text: t("modal-content.delete-account"),
        buttonType: ButtonType.FULFILLED,
        buttonText: t("buttons.delete"),
        buttonColor: ButtonColor.DELETE,
      });
    } else {
      if (following) {
        setShowModal(true);
        setModalValues({
          text: t("modal-content.unfollow"),
          title: `${t("modal-title.unfollow")} @${profile?.username}?`,
          buttonType: ButtonType.FULFILLED,
          buttonText: t("buttons.unfollow"),
          buttonColor: ButtonColor.DELETE,
        });
      } else {
        await followUser(id);
        getProfileView(id).then((res) => setProfile(res));
      }
      return await getProfileData();
    }
  };

  const getProfileData = async () => {
    getProfileView(id)
      .then((res) => {
        setProfile({ ...res.user });
        setFollowing(res.isFollowing);
      })
      .catch(() => {});
  };

  return (
    <>
      <StyledContainer
        maxHeight={"100vh"}
        borderRight={"1px solid #ebeef0"}
        maxWidth={"600px"}
        overflowY={"auto"}
      >
        {profile && (
          <>
            <StyledContainer
              borderBottom={"1px solid #ebeef0"}
              maxHeight={"212px"}
              padding={"16px"}
            >
              <StyledContainer
                alignItems={"center"}
                padding={"24px 0 0 0"}
                flexDirection={"row"}
              >
                <ProfileInfo
                  name={profile?.name}
                  username={profile?.username}
                  profilePicture={profile?.profilePicture}
                />
                <Button
                  buttonType={handleButtonType().component.type}
                  buttonColor={handleButtonType().component.color}
                  size={ButtonSize.MEDIUM}
                  onClick={handleButtonAction}
                >
                  {handleButtonType().text}
                </Button>
              </StyledContainer>
            </StyledContainer>
            <StyledContainer width={"100%"}>
              {!profile.private || profile?.id === me?.id || following ? (
                <ProfileFeed />
              ) : (
                <StyledH5>Private account</StyledH5>
              )}
            </StyledContainer>
            <Modal
              show={showModal}
              text={modalValues.text}
              title={modalValues.title}
              acceptButton={
                <Button
                  buttonType={modalValues.buttonType}
                  buttonColor={modalValues.buttonColor}
                  size={ButtonSize.MEDIUM}
                  onClick={handleSubmit}
                >
                  {modalValues.buttonText}
                </Button>
              }
              onClose={() => {
                setShowModal(false);
              }}
            />
          </>
        )}
      </StyledContainer>
    </>
  );
};

export default ProfilePage;
