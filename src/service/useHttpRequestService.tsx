import { useState } from "react";
import axios from "axios";
import { S3Service } from "./S3Service";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "./axiosInstance";
import type { PostData, SingInData, SingUpData } from "./index";
import { useToast } from "../components/toast/ToastContext";
import { ToastType } from "../components/toast/Toast";

const url = process.env.REACT_APP_API_URL || "http://localhost:8081/api";

const useHttpRequestService = () => {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNotFound = (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return [];
      }
    }
  };

  const signUp = async (data: Partial<SingUpData>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post(`${url}/auth/signup`, data);
      if (res.status === 201) {
        showToast(ToastType.SUCCESS, t("toast.signup.success"));
        return true;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 409) {
          showToast(ToastType.ALERT, t("toast.signup.conflict"));
          setError("");
        }
        if (e.response?.status === 400) {
          setError(t("toast.signup.bad-request"));
        }
      }
      throw new Error(t("toast.signup.error"));
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: SingInData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post(`${url}/auth/login`, data);
      if (res.status === 200) {
        localStorage.setItem("token", `Bearer ${res.data.token}`);
        showToast(ToastType.SUCCESS, t("toast.login.success"));
        return true;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        switch (e.response?.status) {
          case 400:
            setError(t("toast.login.bad-request"));
            break;
          case 401:
            showToast(ToastType.ALERT, t("toast.login.unauthorized"));
            break;
          case 404:
            setError(t("toast.login.not-found"));
            break;
          case 500:
            showToast(ToastType.ALERT, t("toast.login.server-error"));
            break;
          default:
            showToast(ToastType.ALERT, t("toast.login.server-error"));
            break;
        }
      }
      throw new Error(t("toast.login.server-error"));
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (data: PostData) => {
    setLoading(true);
    try {
      const uploadData = {
        content: data.content,
        images: data.images?.map((image) => image.name),
      };
      const res = await axiosInstance.post(`${url}/post`, uploadData);
      if (res.status === 201) {
        const { upload } = S3Service;
        for (const imageUrl of res.data.images) {
          const index: number = res.data.images.indexOf(imageUrl);
          console.log(imageUrl);
          await upload(data.images![index], imageUrl);
        }
        return res.data;
      }
    } catch (e) {
      handleNotFound(e);
    } finally {
      setLoading(false);
    }
  };

  const getPaginatedPosts = async (
    limit: number,
    after: string,
    query: string
  ) => {
    try {
      const res = await axiosInstance.get(`${url}/post/${query}`, {
        params: {
          limit,
          after,
        },
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleNotFound(e);
    }
  };

  const getPosts = async (query: string) => {
    try {
      const res = await axiosInstance.get(`${url}/post/${query}`);
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleNotFound(e);
    }
  };

  const getRecommendedUsers = async (limit: number, skip: number) => {
    try {
      const res = await axiosInstance.get(`${url}/user`, {
        params: {
          limit,
          skip,
        },
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleNotFound(e);
    }
  };

  const me = async () => {
    const res = await axiosInstance.get(`${url}/user/me`);
    if (res.status === 200) {
      return res.data.user;
    }
  };

  const getPostById = async (id: string) => {
    const res = await axiosInstance.get(`${url}/post/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  };

  const createReaction = async (postId: string, reaction: string) => {
    const res = await axiosInstance.post(`${url}/reaction/${postId}`, {
      action: reaction,
    });
    if (res.status === 201) {
      return res.data;
    }
  };

  const deleteReaction = async (reactionId: string, reaction: string) => {
    const res = await axiosInstance.delete(`${url}/reaction/${reactionId}`, {
      data: {
        action: reaction,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  };

  const followUser = async (userId: string) => {
    const res = await axiosInstance.post(`${url}/follower/follow/${userId}`);
    if (res.status === 201) {
      return res.data;
    }
  };

  const unfollowUser = async (userId: string) => {
    const res = await axiosInstance.post(`${url}/follower/unfollow/${userId}`);
    if (res.status === 200) {
      return res.data;
    }
  };

  const searchUsers = async (username: string) => {
    try {
      const cancelToken = axios.CancelToken.source();

      const response = await axiosInstance.get(
        `${url}/user/by_username/${username}`,
        {
          cancelToken: cancelToken.token,
        }
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      handleNotFound(error);
    }
  };

  const getProfile = async (id: string) => {
    const res = await axiosInstance.get(`${url}/user/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  };

  const getPaginatedPostsFromProfile = async (
    limit: number,
    after: string,
    id: string
  ) => {
    try {
      const res = await axiosInstance.get(`${url}/post/by_user/${id}`, {
        params: {
          limit,
          after,
        },
      });

      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleNotFound(e);
    }
  };

  const getPostsFromProfile = async (id: string) => {
    try {
      const res = await axiosInstance.get(`${url}/post/by_user/${id}`);

      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleNotFound(e);
    }
  };

  const isLogged = async () => {
    try {
      const res = await axiosInstance.get(`${url}/user/me`);
      return res.status === 200;
    } catch (e) {
      return false;
    }
  };

  const getProfileView = async (id: string) => {
    const res = await axiosInstance.get(`${url}/user/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  };

  const deleteProfile = async () => {
    const res = await axiosInstance.delete(`${url}/user/me`);

    if (res.status === 204) {
      localStorage.removeItem("token");
    }
  };

  const getChats = async () => {
    try {
      const res = await axiosInstance.get(`${url}/chat`);

      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleNotFound(e);
    }
  };

  const getMutualFollows = async () => {
    const res = await axiosInstance.get(`${url}/follow/mutual`);

    if (res.status === 200) {
      return res.data;
    }
  };

  const createChat = async (id: string) => {
    const res = await axiosInstance.post(`${url}/chat`, {
      users: [id],
    });

    if (res.status === 201) {
      return res.data;
    }
  };

  const getChat = async (id: string) => {
    const res = await axiosInstance.get(`${url}/chat/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  };

  const deletePost = async (id: string) => {
    await axiosInstance.delete(`${url}/post/${id}`);
  };

  const getPaginatedCommentsByPostId = async (
    id: string,
    limit: number,
    after: string
  ) => {
    try {
      const res = await axiosInstance.get(`${url}/post/comment/by_post/${id}`, {
        params: {
          limit,
          after,
        },
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleNotFound(e);
    }
  };

  const getCommentsByPostId = async (id: string) => {
    try {
      const res = await axiosInstance.get(`${url}/post/comment/by_post/${id}`);
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleNotFound(e);
    }
  };

  return {
    signUp,
    signIn,
    createPost,
    getPaginatedPosts,
    getPosts,
    getRecommendedUsers,
    me,
    getPostById,
    createReaction,
    deleteReaction,
    followUser,
    unfollowUser,
    searchUsers,
    getProfile,
    getPaginatedPostsFromProfile,
    getPostsFromProfile,
    isLogged,
    getProfileView,
    deleteProfile,
    getChats,
    getMutualFollows,
    createChat,
    getChat,
    deletePost,
    getPaginatedCommentsByPostId,
    getCommentsByPostId,
    loading,
    error,
  };
};

export default useHttpRequestService;
