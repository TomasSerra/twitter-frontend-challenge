import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthWrapper from "../../../pages/auth/AuthWrapper";
import useHttpRequestService from "../../../service/useHttpRequestService";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import {
  ButtonColor,
  ButtonSize,
  ButtonType,
} from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import { useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";

const SignUpPage = () => {
  const { signUp, error } = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const submit = async (data: {
    email: string;
    username: string;
    name: string;
    password: string;
  }) => {
    signUp(data)
      .then(async () => {
        await queryClient.invalidateQueries({ queryKey: ["me"] });
        navigate("/sign-in");
      })
      .catch(() => {});
  };

  return (
    <AuthWrapper>
      <div className={"border"}>
        <div className={"container"}>
          <div className={"header"}>
            <img src={logo} alt="Twitter Logo" />
            <StyledH3>{t("title.register")}</StyledH3>
          </div>
          <Formik
            initialValues={{
              email: "",
              password: "",
              name: "",
              username: "",
              confirmPassword: "",
            }}
            validate={(values) => {
              const errors: {
                email?: string;
                password?: string;
                name?: string;
                username?: string;
                confirmPassword?: string;
              } = {};
              if (!values.email) {
                errors.email = t("signup.required");
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = t("signup.email.invalid");
              }

              if (!values.password) {
                errors.password = t("signup.required");
              }

              if (!values.name) {
                errors.name = t("signup.required");
              }

              if (!values.username) {
                errors.username = t("signup.required");
              }

              if (!values.confirmPassword) {
                errors.confirmPassword = t("signup.required");
              } else if (values.confirmPassword !== values.password) {
                errors.confirmPassword = t("signup.password.invalid");
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              const { confirmPassword, ...data } = values;
              submit(data);
              setSubmitting(false);
            }}
          >
            {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
              <>
                <div className={"input-container"}>
                  <LabeledInput
                    required
                    placeholder={"Enter name..."}
                    label={t("input-params.name")}
                    error={errors.name}
                    hasError={!!errors.name || error !== null}
                    onChange={handleChange}
                    name="name"
                  />
                  <LabeledInput
                    required
                    placeholder={"Enter username..."}
                    label={t("input-params.username")}
                    error={errors.username}
                    hasError={!!errors.username || error !== null}
                    onChange={handleChange}
                    name="username"
                  />
                  <LabeledInput
                    required
                    placeholder={"Enter email..."}
                    label={t("input-params.email")}
                    error={errors.email}
                    hasError={!!errors.email || error !== null}
                    onChange={handleChange}
                    name="email"
                  />
                  <LabeledInput
                    type="password"
                    required
                    placeholder={"Enter password..."}
                    label={t("input-params.password")}
                    error={errors.password}
                    hasError={!!errors.password || error !== null}
                    onChange={handleChange}
                    name="password"
                  />
                  <LabeledInput
                    type="password"
                    required
                    placeholder={"Confirm password..."}
                    label={t("input-params.confirm-password")}
                    error={errors.confirmPassword}
                    hasError={!!errors.confirmPassword || error !== null}
                    onChange={handleChange}
                    name="confirmPassword"
                  />
                </div>
                <p className={"error-message"}>{error}</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Button
                    buttonType={ButtonType.FULFILLED}
                    buttonColor={ButtonColor.PRIMARY}
                    size={ButtonSize.MEDIUM}
                    disabled={isSubmitting}
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    {t("buttons.register")}
                  </Button>
                  <Button
                    buttonType={ButtonType.OUTLINED}
                    buttonColor={ButtonColor.WHITE}
                    size={ButtonSize.MEDIUM}
                    onClick={() => navigate("/sign-in")}
                  >
                    {t("buttons.login")}
                  </Button>
                </div>
              </>
            )}
          </Formik>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SignUpPage;
