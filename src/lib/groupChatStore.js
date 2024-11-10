import { create } from "zustand";

export const useGroupChatStore = create((set) => ({
    groupChatId: null,
    name: "",
    description: "",
    avatar: "",
    users: [],
    changeGroupChat: (groupChatId, name, description, avatar, users) => {
        return set({
            groupChatId,
            name,
            description,
            avatar,
            users
        })
    },
    resetGroupChat: () => {
        return set({
            groupChatId: null,
            name: "",
            description: "",
            avatar: "",
            users: []
        })
    }
  }))