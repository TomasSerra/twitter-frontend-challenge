import React, { useState } from "react";
import { DeleteIcon } from "../../icon/Icon";
import Modal from "../../modal/Modal";
import Button from "../../button/Button";
import { updateFeed } from "../../../redux/user";
import useHttpRequestService from "../../../service/useHttpRequestService";
import { useTranslation } from "react-i18next";
import { ButtonColor, ButtonSize, ButtonType } from "../../button/StyledButton";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Post } from "../../../service";
import { StyledDeletePostModalContainer } from "./DeletePostModalContainer";
import { useToast } from "../../toast/ToastContext";
import { ToastType } from "../../toast/Toast";

interface DeletePostModalProps {
  show: boolean;
  onClose: () => void;
  id: string;
}

export const DeletePostModal = ({
  show,
  id,
  onClose,
}: DeletePostModalProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const feed = useAppSelector((state) => state.user.feed);
  const dispatch = useAppDispatch();
  const { deletePost } = useHttpRequestService();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const handleDelete = () => {
    try {
      showToast(ToastType.SUCCESS, t("toast.post.delete.success"));
      deletePost(id).then((res) => console.log(res));
      const newFeed = feed.filter((post: Post) => post.id !== id);
      dispatch(updateFeed(newFeed));
      handleClose();
    } catch (error) {
      showToast(ToastType.ALERT, t("toast.post.delete.error"));
    }
  };

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  return (
    <>
      {show && (
        <>
          <StyledDeletePostModalContainer onClick={() => setShowModal(true)}>
            <DeleteIcon />
            <p>{t("buttons.delete")}</p>
          </StyledDeletePostModalContainer>
          <Modal
            title={t("modal-title.delete-post") + "?"}
            text={t("modal-content.delete-post")}
            show={showModal}
            onClose={handleClose}
            acceptButton={
              <Button
                buttonType={ButtonType.FULFILLED}
                buttonColor={ButtonColor.DELETE}
                size={ButtonSize.MEDIUM}
                onClick={handleDelete}
              >
                {t("buttons.delete")}
              </Button>
            }
          />
        </>
      )}
    </>
  );
};

export default DeletePostModal;
