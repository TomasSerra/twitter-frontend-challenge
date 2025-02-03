import { useState } from "react";
import axios from "axios";
import { S3Service } from "./S3Service";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "./axiosInstance";
import type { PostData, SingInData, SingUpData } from "./index";

const url = process.env.REACT_APP_API_URL || "http://localhost:8081/api";

const useHttpRequestService = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return [];
      }
      setError("Error fetching data");
      console.error("Error fetching:", error);
    }
  };

  const signUp = async (data: Partial<SingUpData>) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`${url}/auth/signup`, data);
      if (res.status === 201) {
        localStorage.setItem("token", `Bearer ${res.data.token}`);
        return true;
      }
    } catch (e) {
      handleError(e);
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 409) {
          throw new Error(t("error.signup.conflict"));
        }
        if (e.response?.status === 400) {
          throw new Error(t("error.signup.bad-request"));
        }
      }
      throw new Error(t("error.signup.error"));
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: SingInData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`${url}/auth/login`, data);
      if (res.status === 200) {
        localStorage.setItem("token", `Bearer ${res.data.token}`);
        return true;
      }
    } catch (e) {
      handleError(e);
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
      handleError(e);
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
      handleError(e);
    }
  };

  const getPosts = async (query: string) => {
    try {
      const res = await axiosInstance.get(`${url}/post/${query}`);
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleError(e);
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
      handleError(e);
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
      type: reaction,
    });
    if (res.status === 201) {
      return res.data;
    }
  };

  const deleteReaction = async (reactionId: string) => {
    const res = await axiosInstance.delete(`${url}/reaction/${reactionId}`);
    if (res.status === 200) {
      return res.data;
    }
  };

  const followUser = async (userId: string) => {
    const res = await axiosInstance.post(`${url}/follow/${userId}`);
    if (res.status === 201) {
      return res.data;
    }
  };

  const unfollowUser = async (userId: string) => {
    const res = await axiosInstance.delete(`${url}/follow/${userId}`);
    if (res.status === 200) {
      return res.data;
    }
  };

  const searchUsers = async (username: string, limit: number, skip: number) => {
    try {
      const cancelToken = axios.CancelToken.source();

      const response = await axiosInstance.get(`${url}/user/search`, {
        params: {
          username,
          limit,
          skip,
        },
        cancelToken: cancelToken.token,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (!axios.isCancel(error)) console.log(error);
      handleError(error);
    }
  };

  const getProfile = async (id: string) => {
    const res = await axiosInstance.get(`${url}/user/profile/${id}`);
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
      handleError(e);
    }
  };

  const getPostsFromProfile = async (id: string) => {
    try {
      const res = await axiosInstance.get(`${url}/post/by_user/${id}`);

      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleError(e);
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
      handleError(e);
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
      handleError(e);
    }
  };

  const getCommentsByPostId = async (id: string) => {
    try {
      const res = await axiosInstance.get(`${url}/post/comment/by_post/${id}`);
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      handleError(e);
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
