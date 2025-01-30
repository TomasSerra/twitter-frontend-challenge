import type { PostData, SingInData, SingUpData } from "./index";
import axios from "axios";
import { S3Service } from "./S3Service";
import { axiosInstance } from "./axiosInstance";

const url = process.env.REACT_APP_API_URL || "http://localhost:8081/api";

const httpRequestService = {
  signUp: async (data: Partial<SingUpData>) => {
    console.log(data);
    const res = await axiosInstance.post(`${url}/auth/signup`, data);
    if (res.status === 201) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },
  signIn: async (data: SingInData) => {
    const res = await axiosInstance.post(`${url}/auth/login`, data);
    if (res.status === 200) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },
  createPost: async (data: PostData) => {
    const uploadData = {
      content: data.content,
      images: data.images?.map((image) => image.name),
    };
    const res = await axiosInstance.post(`${url}/post`, uploadData, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 201) {
      const { upload } = S3Service;
      for (const imageUrl of res.data.images) {
        const index: number = res.data.images.indexOf(imageUrl);
        console.log(imageUrl);
        await upload(data.images![index], imageUrl);
      }
      return res.data;
    }
  },
  getPaginatedPosts: async (limit: number, after: string, query: string) => {
    try {
      const res = await axiosInstance.get(`${url}/post/${query}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {
          limit,
          after,
        },
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      catchError(e);
    }
  },
  getPosts: async (query: string) => {
    try {
      const res = await axiosInstance.get(`${url}/post/${query}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      catchError(e);
    }
  },
  getRecommendedUsers: async (limit: number, skip: number) => {
    try {
      const res = await axiosInstance.get(`${url}/user`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {
          limit,
          skip,
        },
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      catchError(e);
    }
  },
  me: async () => {
    const res = await axiosInstance.get(`${url}/user/me`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data.user;
    }
  },
  getPostById: async (id: string) => {
    const res = await axiosInstance.get(`${url}/post/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  createReaction: async (postId: string, reaction: string) => {
    const res = await axiosInstance.post(
      `${url}/reaction/${postId}`,
      { type: reaction },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (res.status === 201) {
      return res.data;
    }
  },
  deleteReaction: async (reactionId: string) => {
    const res = await axiosInstance.delete(`${url}/reaction/${reactionId}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  followUser: async (userId: string) => {
    const res = await axiosInstance.post(
      `${url}/follow/${userId}`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (res.status === 201) {
      return res.data;
    }
  },
  unfollowUser: async (userId: string) => {
    const res = await axiosInstance.delete(`${url}/follow/${userId}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  searchUsers: async (username: string, limit: number, skip: number) => {
    try {
      const cancelToken = axios.CancelToken.source();

      const response = await axiosInstance.get(`${url}/user/search`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
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
      catchError(error);
    }
  },

  getProfile: async (id: string) => {
    const res = await axiosInstance.get(`${url}/user/profile/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getPaginatedPostsFromProfile: async (
    limit: number,
    after: string,
    id: string
  ) => {
    try {
      const res = await axiosInstance.get(`${url}/post/by_user/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {
          limit,
          after,
        },
      });

      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      catchError(e);
    }
  },
  getPostsFromProfile: async (id: string) => {
    try {
      const res = await axiosInstance.get(`${url}/post/by_user/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      catchError(e);
    }
  },

  isLogged: async () => {
    try {
      const res = await axiosInstance.get(`${url}/user/me`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return res.status === 200;
    } catch (e) {
      return false;
    }
  },

  getProfileView: async (id: string) => {
    const res = await axiosInstance.get(`${url}/user/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },

  deleteProfile: async () => {
    const res = await axiosInstance.delete(`${url}/user/me`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.status === 204) {
      localStorage.removeItem("token");
    }
  },

  getChats: async () => {
    try {
      const res = await axiosInstance.get(`${url}/chat`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      catchError(e);
    }
  },

  getMutualFollows: async () => {
    const res = await axiosInstance.get(`${url}/follow/mutual`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },

  createChat: async (id: string) => {
    const res = await axiosInstance.post(
      `${url}/chat`,
      {
        users: [id],
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    if (res.status === 201) {
      return res.data;
    }
  },

  getChat: async (id: string) => {
    const res = await axiosInstance.get(`${url}/chat/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },

  deletePost: async (id: string) => {
    await axiosInstance.delete(`${url}/post/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  },

  getPaginatedCommentsByPostId: async (
    id: string,
    limit: number,
    after: string
  ) => {
    try {
      const res = await axiosInstance.get(`${url}/post/comment/by_post/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {
          limit,
          after,
        },
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      catchError(e);
    }
  },
  getCommentsByPostId: async (id: string) => {
    try {
      const res = await axiosInstance.get(`${url}/post/comment/by_post/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      catchError(e);
    }
  },
};

const catchError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      return [];
    }
  }
  console.error("Error fetching:", error);
  throw error;
};

const useHttpRequestService = () => httpRequestService;

// For class component (remove when unused)
class HttpService {
  service = httpRequestService;
}

export { useHttpRequestService, HttpService };
