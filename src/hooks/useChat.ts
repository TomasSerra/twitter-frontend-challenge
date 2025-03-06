import { useCallback } from "react";
import socket from "../service/socketService";
import { Socket } from "socket.io-client";
import useHttpRequestService from "../service/useHttpRequestService";
import { ChatType } from "../pages/chat/components/chats/ChatList";

export interface ChatSocket {
  sendMessage: (message: string, toUserId: string) => void;
  onMessage: (
    callback: (data: {
      msg: string;
      createdAt: string;
      senderId: string;
    }) => void
  ) => void;
  getAllMessages: (toUserId: string) => Promise<ChatType[]>;
  connect: () => void;
  disconnect: () => void;
  joinRoom: (toUserId: string) => void;
  leaveRoom: (toUserId: string) => void;
  off: () => void;
}

const useChat = (): ChatSocket => {
  const token = localStorage.getItem("token")?.split(" ")[1] || "";
  const chatSocket: Socket = socket({ token });
  const { getChats } = useHttpRequestService();

  const sendMessage = useCallback(
    (msg: string, receiverId: string) => {
      if (chatSocket) {
        chatSocket.emit("send message", { msg, receiverId });
      }
    },
    [chatSocket]
  );

  const onMessage = useCallback(
    (
      callback: (data: {
        msg: string;
        createdAt: string;
        senderId: string;
      }) => void
    ) => {
      if (chatSocket) {
        chatSocket.on("get message", callback);
      }
    },
    [chatSocket]
  );

  const disconnect = useCallback(() => {
    if (chatSocket) {
      chatSocket.disconnect();
    }
  }, [chatSocket]);

  const connect = useCallback(() => {
    if (chatSocket) {
      chatSocket.connect();
    }
  }, [chatSocket]);

  const getAllMessages = useCallback(async (receiverId: string) => {
    const res: ChatType[] = await getChats(receiverId);
    return res;
  }, []);

  const joinRoom = useCallback(
    (receiverId: string) => {
      if (chatSocket) {
        chatSocket.emit("join room", { receiverId });
      }
    },
    [chatSocket]
  );

  const leaveRoom = useCallback(
    (receiverId: string) => {
      if (chatSocket) {
        chatSocket.emit("leave room", { receiverId });
      }
    },
    [chatSocket]
  );

  const off = useCallback(() => {
    if (chatSocket) {
      chatSocket.off("send message");
      chatSocket.off("get message");
    }
  }, [chatSocket]);

  return {
    sendMessage,
    onMessage,
    disconnect,
    connect,
    getAllMessages,
    joinRoom,
    leaveRoom,
    off,
  };
};

export default useChat;
