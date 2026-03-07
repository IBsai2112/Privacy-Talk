import React, { useEffect } from "react";
import { MdChat } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import UserSearch from "../components/chatComponents/UserSearch";
import MyChat from "../components/chatComponents/MyChat";
import MessageBox from "../components/messageComponents/MessageBox";
import ChatNotSelected from "../components/chatComponents/ChatNotSelected";
import {
	setChatDetailsBox,
	setSocketConnected,
	setUserSearchBox,
} from "../redux/slices/conditionSlice";
import socket from "../socket/socket";
import { addAllMessages, addNewMessage } from "../redux/slices/messageSlice";
import {
	addNewChat,
	addNewMessageRecieved,
	deleteSelectedChat,
} from "../redux/slices/myChatSlice";
import { toast } from "react-toastify";
import { receivedSound } from "../utils/notificationSound";

let selectedChatCompare;

const Home = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const dispatch = useDispatch();
	const isUserSearchBox = useSelector(
		(store) => store?.condition?.isUserSearchBox
	);
	const authUserId = useSelector((store) => store?.auth?._id);

	/* ================= SOCKET LOGIC (UNCHANGED) ================= */

	useEffect(() => {
		if (!authUserId) return;
		socket.emit("setup", authUserId);
		socket.on("connected", () => dispatch(setSocketConnected(true)));
	}, [authUserId]);

	useEffect(() => {
		selectedChatCompare = selectedChat;
		const messageHandler = (newMessageReceived) => {
			if (
				selectedChatCompare &&
				selectedChatCompare._id === newMessageReceived.chat._id
			) {
				dispatch(addNewMessage(newMessageReceived));
			} else {
				receivedSound();
				dispatch(addNewMessageRecieved(newMessageReceived));
			}
		};
		socket.on("message received", messageHandler);
		return () => socket.off("message received", messageHandler);
	});

	useEffect(() => {
		const clearChatHandler = (chatId) => {
			if (chatId === selectedChat?._id) {
				dispatch(addAllMessages([]));
				toast.success("Cleared all messages");
			}
		};
		socket.on("clear chat", clearChatHandler);
		return () => socket.off("clear chat", clearChatHandler);
	});

	useEffect(() => {
		const deleteChatHandler = (chatId) => {
			dispatch(setChatDetailsBox(false));
			if (selectedChat && chatId === selectedChat._id) {
				dispatch(addAllMessages([]));
			}
			dispatch(deleteSelectedChat(chatId));
			toast.success("Chat deleted successfully");
		};
		socket.on("delete chat", deleteChatHandler);
		return () => socket.off("delete chat", deleteChatHandler);
	});

	useEffect(() => {
		const chatCreatedHandler = (chat) => {
			dispatch(addNewChat(chat));
			toast.success("Created & Selected chat");
		};
		socket.on("chat created", chatCreatedHandler);
		return () => socket.off("chat created", chatCreatedHandler);
	});

	/* ================= UI (LIGHT TELEGRAM STYLE) ================= */

	return (
	<div className="flex w-full h-[80vh] bg-black border-8 border-black border-b-0 rounded-lg shadow-sm relative overflow-hidden">
		{/* update white bg --- update after --- */}
		{/* LEFT PANEL */}
		<div
			className={`${
				selectedChat && "hidden"
			} sm:block sm:w-[40%] w-full h-full 
			bg-[#f7f8fa] 
			border-4 border-black
			bg-gradient-to-br from-[#1a0a53] via-[#421782] to-[#6D5D91] bg-cover
			relative`}
		>
			<div className="absolute bottom-4 right-4 cursor-pointer 
			                text-blue-600 hover:text-blue-700">
				<MdChat
					title="New Chat"
					fontSize={32}
					onClick={() => dispatch(setUserSearchBox())}
				/>
			</div>

			{isUserSearchBox ? <UserSearch /> : <MyChat />}
		</div>

		{/* RIGHT PANEL */}
		<div
			className={`${
				!selectedChat && "hidden"
			} sm:block sm:w-[60%] w-full h-full 
			bg-gradient-to-br from-[#1a0a53] via-[#421782] to-[#6D5D91] bg-cover
			border-8 border-black border-b-0 shadow-sm
			relative overflow-hidden`}
		>
			{selectedChat ? (
				<MessageBox chatId={selectedChat?._id} />
			) : (
				<ChatNotSelected />
			)}
		</div>
	</div>
);

};

export default Home;
