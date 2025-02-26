import React, { useEffect, useState } from "react";
import FollowUserBox from "../../../../components/follow-user/FollowUserBox";
import useHttpRequestService from "../../../../service/useHttpRequestService";
import { useTranslation } from "react-i18next";
import { User } from "../../../../service";
import { StyledSuggestionBoxContainer } from "./SuggestionBoxContainer";
import {
  ButtonColor,
  ButtonSize,
  ButtonType,
} from "../../../../components/button/StyledButton";
import Button from "../../../../components/button/Button";
import { useNavigate } from "react-router-dom";

const SuggestionBox = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { getRecommendedUsers } = useHttpRequestService();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      getRecommendedUsers(6, 0).then((res) => {
        setUsers(res || []);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleMoreSuggestions = () => {
    navigate("/recommendations");
  };

  return (
    <StyledSuggestionBoxContainer>
      <h6>{t("suggestion.who-to-follow")}</h6>
      {users?.length > 0 ? (
        users
          .filter((value, index, array) => {
            return array.indexOf(value) === index;
          })
          .slice(0, 5)
          .map((user) => (
            <FollowUserBox
              key={user?.id}
              id={user?.id}
              name={user?.name}
              username={user?.username}
              profilePicture={user?.profilePicture}
              size={ButtonSize.SMALL}
            />
          ))
      ) : (
        <p>{t("suggestion.no-recommendations")}</p>
      )}
      {users?.length > 5 && (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Button
            onClick={handleMoreSuggestions}
            size={ButtonSize.LARGE}
            buttonColor={ButtonColor.PRIMARY}
            buttonType={ButtonType.OUTLINED}
          >
            {t("suggestion.show-more")}
          </Button>
        </div>
      )}
    </StyledSuggestionBoxContainer>
  );
};

export default SuggestionBox;
