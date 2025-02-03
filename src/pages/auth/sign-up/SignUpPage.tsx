import type { ChangeEvent } from "react";
import { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthWrapper from "../../../pages/auth/AuthWrapper";
import useHttpRequestService from "../../../service/useHttpRequestService";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import { useQueryClient } from "@tanstack/react-query";

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const SignUpPage = () => {
  const [data, setData] = useState<Partial<SignUpData>>({});
  const [error, setError] = useState("");
  const { signUp } = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleChange =
    (prop: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [prop]: event.target.value });
    };
  const handleSubmit = async () => {
    const { confirmPassword, ...requestData } = data;
    signUp(requestData)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["me"] });
        window.location.href = "/";
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  return (
    <AuthWrapper>
      <div className={"border"}>
        <div className={"container"}>
          <div className={"header"}>
            <img src={logo} alt="Twitter Logo" />
            <StyledH3>{t("title.register")}</StyledH3>
          </div>
          <div className={"input-container"}>
            <LabeledInput
              required
              placeholder={"Enter name..."}
              title={t("input-params.name")}
              error={error !== ""}
              onChange={handleChange("name")}
            />
            <LabeledInput
              required
              placeholder={"Enter username..."}
              title={t("input-params.username")}
              error={error !== ""}
              onChange={handleChange("username")}
            />
            <LabeledInput
              required
              placeholder={"Enter email..."}
              title={t("input-params.email")}
              error={error !== ""}
              onChange={handleChange("email")}
            />
            <LabeledInput
              type="password"
              required
              placeholder={"Enter password..."}
              title={t("input-params.password")}
              error={error !== ""}
              onChange={handleChange("password")}
            />
            <LabeledInput
              type="password"
              required
              placeholder={"Confirm password..."}
              title={t("input-params.confirm-password")}
              error={error !== ""}
              onChange={handleChange("confirmPassword")}
            />
          </div>
          <p className={"error-message"}>{error}</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              text={t("buttons.register")}
              buttonType={ButtonType.FOLLOW}
              size={"MEDIUM"}
              onClick={handleSubmit}
            />
            <Button
              text={t("buttons.login")}
              buttonType={ButtonType.OUTLINED}
              size={"MEDIUM"}
              onClick={() => navigate("/sign-in")}
            />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SignUpPage;
