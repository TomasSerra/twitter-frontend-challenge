import ReactDOM from "react-dom";
import TweetBox from "../tweet-box/TweetBox";
import { PostModal } from "../post-modal/PostModal";

interface TweetModalProps {
  open: boolean;
  onClose: () => void;
}

export const TweetModal = ({ open, onClose }: TweetModalProps) => {
  return ReactDOM.createPortal(
    <>
      <PostModal show={open} onClose={onClose}>
        <TweetBox borderless close={onClose} />
      </PostModal>
    </>,
    document.getElementById("portal") as HTMLElement
  );
};
export default TweetModal;
