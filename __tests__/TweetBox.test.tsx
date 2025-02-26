import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import TweetBox from "../src/components/tweet-box/TweetBox";

test("TweetBox component renders correctly in pc", () => {
  const view = render(<TweetBox mobile={false} />);
  expect(view).toMatchSnapshot();
});
