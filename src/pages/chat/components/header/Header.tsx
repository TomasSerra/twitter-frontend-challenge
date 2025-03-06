import { useNavigate } from "react-router-dom";
import { StyledContainer } from "../../../../components/common/Container";
import AuthorData from "../../../../components/tweet/user-post-data/AuthorData";
import { User } from "../../../../service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  toUserData?: User;
}

const Header = ({ toUserData }: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <StyledContainer
      borderBottom={"1px solid #ebeef0"}
      padding={"10px 15px"}
      width={"100%"}
      display={"flex"}
      flexDirection="row"
      justifyContent={"space-between"}
      alignItems={"center"}
      height={"fit-content"}
      gap={"20px"}
    >
      <button
        onClick={handleBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "10px",
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size={"xl"} color="grey" />
      </button>
      {toUserData && (
        <AuthorData
          id={toUserData?.id}
          name={toUserData?.name ?? "Name"}
          username={toUserData?.username}
          profilePicture={toUserData?.profilePicture}
        />
      )}
    </StyledContainer>
  );
};

export default Header;
