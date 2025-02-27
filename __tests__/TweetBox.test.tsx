import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TweetBox from "../src/components/tweet-box/TweetBox";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import useHttpRequestService from "../src/service/useHttpRequestService";
import { useToast } from "../src/components/toast/ToastContext";
import { ToastType } from "../src/components/toast/Toast";

jest.mock("../src/service/useHttpRequestService", () => {
  const createPost = jest.fn().mockResolvedValue({});
  const getPosts = jest.fn().mockResolvedValue([]);
  return {
    __esModule: true,
    default: jest.fn(() => ({
      createPost,
      getPosts,
    })),
  };
});

jest.mock("../src/redux/user", () => ({
  setLength: jest.fn(),
  updateFeed: jest.fn(),
}));

jest.mock("../src/hooks/useMe", () => ({
  useMe: () => ({ data: { profilePicture: "mockedProfilePic.jpg" } }),
}));

jest.mock("../src/components/tweet/tweet-image/ImageContainer", () => () => (
  <div data-testid="image-container"></div>
));

jest.mock("../src/components/icon/Icon", () => ({
  BackArrowIcon: () => <div data-testid="back-arrow-icon"></div>,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("../src/components/toast/ToastContext", () => ({
  useToast: jest.fn(() => ({
    showToast: jest.fn(),
  })),
}));

jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => ({ length: 0, query: "" }),
}));

jest.mock("path/to/image.png", () => "test-image.png");

const mockTheme = {
  background: "#fff",
  colors: {
    main: "#4A99E9",
    light: "#A5CCF4",
    dark: "#428AD2",
    error: "#E03C39",
    white: "#FFFFFF",
    softWhite: "#f6f6f6",
    softPrimary: "#e5edf7",
    inactiveBackground: "#F0F3F4",
    containerLine: "#F0F3F4",
    hover: "#E7E7E8",
    outline: "#000000",
    text: "#566370",
    black: "#000000",
    errorContainer: "#E5397F",
    successContainer: "#4CAF50",
    warningContainer: "#FFC107",
    infoContainer: "#2196F3",
  },
  hover: {
    default: "#428AD2",
    main: "#428AD2",
    white: "#FFFFFF",
    follow: "#428AD2",
    error: "#FF0000",
    outlined: "#f3f3f3",
    disabled: "#A5CCF4",
  },
  text: {
    default: "#566370",
    title: "#000000",
    error: "#E03C39",
  },
  font: {
    default: "Manrope",
    title: "Inter",
  },
};

describe("TweetBox component", () => {
  let mockCreatePost: jest.Mock;
  let mockShowToast: jest.Mock;

  beforeEach(() => {
    mockCreatePost = jest.fn().mockResolvedValue({});
    mockShowToast = jest.fn();

    (useHttpRequestService as jest.Mock).mockReturnValue({
      createPost: mockCreatePost,
      getPosts: jest.fn().mockResolvedValue([]),
    });

    (useToast as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
    });
  });

  test("TweetBox component renders correctly on PC", () => {
    const view = render(
      <ThemeProvider theme={mockTheme}>
        <TweetBox />
      </ThemeProvider>
    );
    expect(view).toMatchSnapshot();
    expect(
      screen.getByPlaceholderText("placeholder.tweet")
    ).toBeInTheDocument();

    expect(screen.getByTestId("tweet-button")).toBeInTheDocument();
  });

  test("TweetBox component renders correctly on mobile", () => {
    const view = render(
      <ThemeProvider theme={mockTheme}>
        <TweetBox mobile={true} />
      </ThemeProvider>
    );
    expect(view).toMatchSnapshot();
    expect(
      screen.getByPlaceholderText("placeholder.tweet")
    ).toBeInTheDocument();

    expect(screen.getByTestId("tweet-button-mobile")).toBeInTheDocument();
  });

  test("Tweet button is disabled when no content is entered", () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <TweetBox mobile={false} />
      </ThemeProvider>
    );

    const tweetInput = screen.getByPlaceholderText(
      "placeholder.tweet"
    ) as HTMLInputElement;
    const tweetButton = screen.getByTestId("tweet-button");

    expect(tweetButton).toBeDisabled();

    fireEvent.change(tweetInput, { target: { value: "Nuevo tweet" } });

    expect(tweetButton).toBeEnabled();
  });

  test("content changes when typing in the input", () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <TweetBox mobile={false} />
      </ThemeProvider>
    );

    const tweetInput = screen.getByPlaceholderText("placeholder.tweet");

    fireEvent.change(tweetInput, { target: { value: "Nuevo tweet" } });

    expect((tweetInput as HTMLInputElement).value).toBe("Nuevo tweet");
  });

  test("should call createPost when the tweet is submitted", async () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <TweetBox />
      </ThemeProvider>
    );

    const input = screen.getByPlaceholderText("placeholder.tweet");

    fireEvent.change(input, { target: { value: "Test tweet" } });

    const button = screen.getByTestId("tweet-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith({
        content: "Test tweet",
        images: [],
        parentId: undefined,
      });
    });

    expect(mockShowToast).toHaveBeenCalledWith(
      ToastType.SUCCESS,
      "toast.post.create.success"
    );
  });

  test("should empty textarea when the tweet is submitted", async () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <TweetBox />
      </ThemeProvider>
    );

    const input = screen.getByPlaceholderText("placeholder.tweet");

    fireEvent.change(input, { target: { value: "Test tweet" } });

    const button = screen.getByTestId("tweet-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe("");
    });
  });

  test("should throw error in toast when the tweet is not submitted", async () => {
    (useHttpRequestService as jest.Mock).mockReturnValue({
      createPost: jest.fn().mockRejectedValue({}),
      getPosts: jest.fn(),
    });

    render(
      <ThemeProvider theme={mockTheme}>
        <TweetBox />
      </ThemeProvider>
    );

    const input = screen.getByPlaceholderText("placeholder.tweet");

    fireEvent.change(input, { target: { value: "Test tweet" } });

    const button = screen.getByTestId("tweet-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        ToastType.ALERT,
        "toast.post.create.error"
      );
    });
  });

  test("Should allow adding an image", async () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <TweetBox />
      </ThemeProvider>
    );

    const file = new File(["image-content"], "test-tweet-image.png", {
      type: "image/png",
    });
    const fileInput = screen.getByTestId("image-input");

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByTestId("tweet-image")).toBeInTheDocument();
    });
  });
});
