import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useHttpRequestService from "../../../service/useHttpRequestService";
import AuthWrapper from "../AuthWrapper";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import {
  ButtonColor,
  ButtonType,
} from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import { useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import { ButtonSize } from "../../../components/my-button/StyledButton";

const SignInPage = () => {
  const queryClient = useQueryClient();

  const { signIn, error } = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const submit = ({ email, password }: { email: string; password: string }) => {
    signIn({ email, password })
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
            <img src={logo} alt={"Twitter Logo"} />
            <StyledH3>{t("title.login")}</StyledH3>
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors: { email?: string; password?: string } = {};
              if (!values.email) {
                errors.email = t("login.required");
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = t("login.email.invalid");
              }

              if (!values.password) {
                errors.password = t("login.required");
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              submit(values);
              setSubmitting(false);
            }}
          >
            {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
              <>
                <div className={"input-container"}>
                  <LabeledInput
                    name="email"
                    type="email"
                    required
                    placeholder={"Enter user..."}
                    title={t("input-params.email")}
                    error={errors.email}
                    hasError={errors.email !== undefined || error !== null}
                    onChange={handleChange}
                    value={values.email}
                  />
                  <LabeledInput
                    name="password"
                    type="password"
                    required
                    placeholder={"Enter password..."}
                    title={t("input-params.password")}
                    error={errors.password}
                    hasError={errors.password !== undefined || error !== null}
                    onChange={handleChange}
                    value={values.password}
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
                    {t("buttons.login")}
                  </Button>
                  <Button
                    buttonType={ButtonType.OUTLINED}
                    buttonColor={ButtonColor.WHITE}
                    size={ButtonSize.MEDIUM}
                    onClick={() => navigate("/sign-up")}
                  >
                    {t("buttons.register")}
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

export default SignInPage;
