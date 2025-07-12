import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    searchedUsers: [],

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/users")
            // console.log("getUsers response : ", res)
            set({ users: res.data?.data })
        } catch (error) {
            console.log("Error in getUser : ", error);
            toast.error(error.response?.data?.message || error.message || "Fetch Chat failed. Please try again.");
        }
        finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.post(`/users/${userId}`)

            set({ messages: res.data?.data })

            console.log("Messages just fetched : ", res.data?.data)
        } catch (error) {
            console.log("Error in getMessages : ", error);
            toast.error(error.response?.data?.message || error.message || "Fetch Chat failed. Please try again.");
        }
        finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser } = get()
        try {
            const res = await axiosInstance.post(`/users/${selectedUser._id}/send`, messageData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            // console.log("messages before update: ", messages)

            console.log("Response in sendMessage : ", res)
            const newMessage = res.data?.data;

            set((state) => {
                // You're logging console.log(messages) after the set() call, but messages is still the old value because set() is asynchronous and doesn’t update immediately.

                const updatedMessages = [ newMessage , ...(Array.isArray(state.messages) ? state.messages : [])];

                console.log("messages after update inside set():", updatedMessages);
                
                return { messages: updatedMessages };
            });

            // console.log(messages) still the old value because set is async

        } catch (error) {
            console.log("Error in sendMessage : ", error);
            toast.error(error.response?.data?.message || error.message || "Send message failed. Please try again.");
        }
    },

    searchUsers: async (query, token, page = 1, limit = 10) => {
        if (!query.trim()) return set({ searchedUsers: [] });

        try {
            const res = await axiosInstance.get(`/users/search?query=${query}&page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Response in searchUsers : ", res)

            set({ searchedUsers: res?.data?.data || [] });
        } catch (error) {
            console.log("Error in searchUsers : ", error);
            toast.error(error.response?.data?.message || error.message || "Search Users failed. Please try again.");
            set({ searchedUsers: [] });
        }
    },

    listenMessages : () => {
        const { selectedUser } = get()

        if( !selectedUser ) return ;

        const socket = useAuthStore.getState().socket

        // TODO: OPTIMIZE THIS LATER
        socket.on("newMessage", (newMessage) => {
            set({ messages :  [newMessage,...get().messages],})
        })
    },

    stopListenMessages : () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => set({ selectedUser })
}))