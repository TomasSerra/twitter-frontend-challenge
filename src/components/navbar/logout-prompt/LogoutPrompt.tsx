import { useEffect, useState } from "react";
import Modal from "../../modal/Modal";
import logo from "../../../assets/logo.png";
import Button from "../../button/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SwitchButton from "../../switch/SwitchButton";
import { ButtonColor, ButtonSize, ButtonType } from "../../button/StyledButton";
import { StyledPromptContainer } from "./PromptContainer";
import { StyledContainer } from "../../common/Container";
import { StyledP } from "../../common/text";
import { User } from "../../../service";
import { useToast } from "../../toast/ToastContext";
import { ToastType } from "../../toast/Toast";

interface LogoutPromptProps {
  show: boolean;
  user: User;
}

const LogoutPrompt = ({ show, user }: LogoutPromptProps) => {
  const [showPrompt, setShowPrompt] = useState<boolean>(show);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();

  const handleClick = () => {
    setShowModal(true);
  };

  const handleLanguageChange = () => {
    if (i18n.language === "es") {
      localStorage.setItem("language", "en");
      i18n.changeLanguage("en");
    } else {
      localStorage.setItem("language", "es");
      i18n.changeLanguage("es");
    }
  };

  const handleLogout = () => {
    showToast(ToastType.SUCCESS, t("toast.logout"));
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  useEffect(() => {
    setShowPrompt(show);
  }, [show]);

  return (
    <>
      {showPrompt && (
        <StyledPromptContainer>
          <StyledContainer
            flexDirection={"row"}
            gap={"16px"}
            borderBottom={"1px solid #ebeef0"}
            padding={"16px"}
            alignItems={"center"}
          >
            <StyledP primary>Es:</StyledP>
            <SwitchButton
              checked={i18n.language === "es"}
              onChange={handleLanguageChange}
            />
          </StyledContainer>
          <StyledContainer
            onClick={handleClick}
            alignItems={"center"}
            style={{ cursor: "pointer" }}
          >
            <StyledP primary>{`${t("buttons.logout")} @${
              user?.username
            }`}</StyledP>
          </StyledContainer>
        </StyledPromptContainer>
      )}
      <Modal
        show={showModal}
        text={t("modal-content.logout")}
        img={logo}
        title={t("modal-title.logout")}
        acceptButton={
          <Button
            buttonType={ButtonType.FULFILLED}
            buttonColor={ButtonColor.DELETE}
            size={ButtonSize.MEDIUM}
            onClick={handleLogout}
          >
            {t("buttons.logout")}
          </Button>
        }
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default LogoutPrompt;
