import React, { useEffect } from "react";
import { FaPenAlt } from "react-icons/fa";
import { addMyChat, addSelectedChat } from "../../redux/slices/myChatSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    setChatLoading,
    setGroupChatBox,
} from "../../redux/slices/conditionSlice";
import ChatShimmer from "../loading/ChatShimmer";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { VscCheckAll } from "react-icons/vsc";
import { SimpleDateAndTime, SimpleTime } from "../../utils/formateDateTime";

const MyChat = () => {
    const dispatch = useDispatch();
    const myChat = useSelector((store) => store.myChat.chat);
    const authUserId = useSelector((store) => store?.auth?._id);
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    const isChatLoading = useSelector(
        (store) => store?.condition?.isChatLoading
    );
    const newMessageId = useSelector((store) => store?.message?.newMessageId);
    const isGroupChatId = useSelector((store) => store.condition.isGroupChatId);

    useEffect(() => {
        const getMyChat = () => {
            dispatch(setChatLoading(true));
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    dispatch(addMyChat(json?.data || []));
                    dispatch(setChatLoading(false));
                })
                .catch(() => dispatch(setChatLoading(false)));
        };
        getMyChat();
    }, [newMessageId, isGroupChatId]);

    return (
        <>
            {/* HEADER */}
            <div className="p-6 w-full h-[7vh] font-semibold flex justify-between items-center 
                            bg-[#110d23] text-white border-8 border-black">
                <h1 className="mr-2 whitespace-nowrap">My Chat</h1>
                <div
                    className="flex items-center gap-2 border border-gray-700 
                               py-1 px-2 rounded-md cursor-pointer 
                               hover:bg-[#9d7dfa] active:bg-gray-300"
                    title="Create New Group"
                    onClick={() => dispatch(setGroupChatBox())}
                >
                    <h1 className="whitespace-nowrap">New Group</h1>
                    <FaPenAlt />
                </div>
            </div>

            {/* CHAT LIST */}
            <div className="flex flex-col w-full px-4 gap-1 py-2 border-8 border-black border-b-0
                            overflow-y-auto scroll-style h-[73vh] bg-[#110d23]">
                {myChat.length === 0 && isChatLoading ? (
                    <ChatShimmer />
                ) : (
                    <>
                        {myChat?.length === 0 && (
                            <div className="w-full h-full flex justify-center items-center text-gray-600">
                                <h1 className="text-base font-semibold">
                                    Start a new conversation.
                                </h1>
                            </div>
                        )}

                        {myChat?.map((chat) => (
                            <div
                                key={chat?._id}
                                className={`w-full h-16 border-2 border-black rounded-lg 
                                            flex items-center p-2 gap-2 cursor-pointer 
                                            transition-all
                                            ${
                                                 //updatign border in abobe line --- remainder ---
                                                selectedChat?._id === chat?._id
                                                    ? "bg-[#211844]"
                                                    : "bg-[#110d23] hover:bg-[#9d7dfa]"
                                                    //changing bg color to red-200 --- remainder ---
                                            }`}
                                onClick={() => dispatch(addSelectedChat(chat))}
                            >
                                <img
                                    className="h-12 min-w-12 rounded-full"
                                    src={getChatImage(chat, authUserId)}
                                    alt="img"
                                />

                                <div className="w-full">
                                    <div className="flex justify-between items-center w-full">
                                        <span className="line-clamp-1 capitalize font-semibold text-gray-400">
                                            {getChatName(chat, authUserId)}
                                        </span>

                                        <span className="text-xs text-gray-500 ml-1">
                                            {chat?.latestMessage &&
                                                SimpleTime(
                                                    chat?.latestMessage?.createdAt
                                                )}
                                        </span>
                                    </div>

                                    <div className="text-xs text-gray-600 line-clamp-1">
                                        {chat?.latestMessage ? (
                                            <div className="flex items-center gap-1">
                                                {chat?.latestMessage?.sender?._id ===
                                                    authUserId && (
                                                    <VscCheckAll
                                                        className="text-blue-600"
                                                        fontSize={14}
                                                    />
                                                )}
                                                <span>
                                                    {chat?.latestMessage?.message}
                                                </span>
                                            </div>
                                        ) : (
                                            <span>
                                                {SimpleDateAndTime(chat?.createdAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </>
    );
};

export default MyChat;
