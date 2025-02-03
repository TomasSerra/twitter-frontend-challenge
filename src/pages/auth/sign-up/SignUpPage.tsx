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
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["me"] });
        window.location.href = "/";
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
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email format";
              }

              if (!values.password) {
                errors.password = "Required";
              }

              if (!values.name) {
                errors.name = "Required";
              }

              if (!values.username) {
                errors.username = "Required";
              }

              if (!values.confirmPassword) {
                errors.confirmPassword = "Required";
              } else if (values.confirmPassword !== values.password) {
                errors.confirmPassword = "Passwords do not match";
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
                    title={t("input-params.name")}
                    error={errors.name}
                    hasError={!!errors.name || error !== null}
                    onChange={handleChange}
                    name="name"
                  />
                  <LabeledInput
                    required
                    placeholder={"Enter username..."}
                    title={t("input-params.username")}
                    error={errors.username}
                    hasError={!!errors.username || error !== null}
                    onChange={handleChange}
                    name="username"
                  />
                  <LabeledInput
                    required
                    placeholder={"Enter email..."}
                    title={t("input-params.email")}
                    error={errors.email}
                    hasError={!!errors.email || error !== null}
                    onChange={handleChange}
                    name="email"
                  />
                  <LabeledInput
                    type="password"
                    required
                    placeholder={"Enter password..."}
                    title={t("input-params.password")}
                    error={errors.password}
                    hasError={!!errors.password || error !== null}
                    onChange={handleChange}
                    name="password"
                  />
                  <LabeledInput
                    type="password"
                    required
                    placeholder={"Confirm password..."}
                    title={t("input-params.confirm-password")}
                    error={errors.confirmPassword}
                    hasError={!!errors.confirmPassword || error !== null}
                    onChange={handleChange}
                    name="confirmPassword"
                  />
                </div>
                <p className={"error-message"}>{error}</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Button
                    text={t("buttons.register")}
                    buttonType={ButtonType.FOLLOW}
                    size={"MEDIUM"}
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={isSubmitting}
                  />
                  <Button
                    text={t("buttons.login")}
                    buttonType={ButtonType.OUTLINED}
                    size={"MEDIUM"}
                    onClick={() => navigate("/sign-in")}
                  />
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
