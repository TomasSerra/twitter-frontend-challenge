import React, { useState } from "react";
import Button from "../button/Button";
import TweetInput from "../tweet-input/TweetInput";
import useHttpRequestService from "../../service/useHttpRequestService";
import { setLength, updateFeed } from "../../redux/user";
import ImageContainer from "../tweet/tweet-image/ImageContainer";
import { BackArrowIcon } from "../icon/Icon";
import ImageInput from "../common/ImageInput";
import { useTranslation } from "react-i18next";
import { ButtonColor, ButtonSize, ButtonType } from "../button/StyledButton";
import { StyledTweetBoxContainer } from "./TweetBoxContainer";
import { StyledContainer } from "../common/Container";
import { StyledButtonContainer } from "./ButtonContainer";
import { useDispatch, useSelector } from "react-redux";
import { useMe } from "../../hooks/useMe";
import { useToast } from "../toast/ToastContext";
import { ToastType } from "../toast/Toast";

interface TweetBoxProps {
  parentId?: string;
  close?: () => void;
  mobile?: boolean;
  borderless?: boolean;
}

const TweetBox = ({ parentId, close, mobile }: TweetBoxProps) => {
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

  const { length, query } = useSelector(
    (state: { user: { length: number; query: string } }) => state.user
  );
  const { createPost, getPosts } = useHttpRequestService();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data: user } = useMe();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await createPost({ content, images, parentId }).then(async (res) => {
        showToast(ToastType.SUCCESS, t("toast.post.create.success"));
        setContent("");
        setImages([]);
        setImagesPreview([]);
        dispatch(setLength(length + 1));
        const posts = await getPosts(query);
        dispatch(updateFeed(posts));
        close && close();
      });
    } catch (e) {
      showToast(ToastType.SUCCESS, t("toast.post.create.error"));
      console.error(e);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((i, idx) => idx !== index);
    const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
    setImages(newImages);
    setImagesPreview(newImagesPreview);
  };

  const handleAddImage = (newImages: File[]) => {
    setImages(newImages);
    const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
    setImagesPreview(newImagesPreview);
  };

  return (
    <StyledTweetBoxContainer>
      {mobile && (
        <StyledContainer
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <BackArrowIcon onClick={close} />
          <Button
            buttonType={ButtonType.FULFILLED}
            size={ButtonSize.SMALL}
            buttonColor={ButtonColor.PRIMARY}
            onClick={handleSubmit}
            disabled={content.length === 0}
          >
            Tweet
          </Button>
        </StyledContainer>
      )}
      <StyledContainer style={{ width: "100%" }}>
        <TweetInput
          onChange={handleChange}
          maxLength={240}
          placeholder={t("placeholder.tweet")}
          value={content}
          src={user?.profilePicture}
        />
        <StyledContainer padding={"0 0 0 10%"}>
          <ImageContainer
            editable
            images={imagesPreview}
            removeFunction={handleRemoveImage}
          />
        </StyledContainer>
        <StyledButtonContainer>
          <ImageInput setImages={handleAddImage} parentId={parentId} />
          {!mobile && (
            <Button
              buttonType={ButtonType.FULFILLED}
              size={ButtonSize.SMALL}
              buttonColor={ButtonColor.PRIMARY}
              onClick={handleSubmit}
              disabled={
                content.length <= 0 ||
                content.length > 240 ||
                images.length > 4 ||
                images.length < 0
              }
            >
              Tweet
            </Button>
          )}
        </StyledButtonContainer>
      </StyledContainer>
    </StyledTweetBoxContainer>
  );
};

export default TweetBox;
