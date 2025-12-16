import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
	setChatDetailsBox,
	setMessageLoading,
} from "../../redux/slices/conditionSlice";
import { useDispatch, useSelector } from "react-redux";
import AllMessages from "./AllMessages";
import MessageSend from "./MessageSend";
import { addAllMessages } from "../../redux/slices/messageSlice";
import MessageLoading from "../loading/MessageLoading";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import getChatName, { getChatImage } from "../../utils/getChatName";
import ChatDetailsBox from "../chatDetails/ChatDetailsBox";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

const MessageBox = ({ chatId }) => {
	const dispatch = useDispatch();
	const chatDetailsBox = useRef(null);
	const [isExiting, setIsExiting] = useState(false);

	const isChatDetailsBox = useSelector(
		(store) => store?.condition?.isChatDetailsBox
	);
	const isMessageLoading = useSelector(
		(store) => store?.condition?.isMessageLoading
	);
	const allMessage = useSelector((store) => store?.message?.message);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const authUserId = useSelector((store) => store?.auth?._id);

	useEffect(() => {
		const getMessage = (chatId) => {
			dispatch(setMessageLoading(true));
			const token = localStorage.getItem("token");
			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message/${chatId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((json) => {
					dispatch(addAllMessages(json?.data || []));
					dispatch(setMessageLoading(false));
					socket.emit("join chat", selectedChat._id);
				})
				.catch(() => {
					dispatch(setMessageLoading(false));
					toast.error("Message Loading Failed");
				});
		};
		getMessage(chatId);
	}, [chatId]);

	/* ================= CLICK OUTSIDE ================= */

	const handleClickOutside = (event) => {
		if (
			chatDetailsBox.current &&
			!chatDetailsBox.current.contains(event.target)
		) {
			setIsExiting(true);
			setTimeout(() => {
				dispatch(setChatDetailsBox(false));
				setIsExiting(false);
			}, 500);
		}
	};

	useEffect(() => {
		if (isChatDetailsBox) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isChatDetailsBox]);

	return (
		<>
			{/* ================= HEADER (LIGHT THEME) ================= */}
			<div
				className="py-4 sm:px-6 px-3 w-full h-[7vh] 
				           flex justify-between items-center 
				           bg-white border-b border-gray-300 
				           text-gray-900 cursor-pointer"
				onClick={() => dispatch(setChatDetailsBox(true))}
			>
				<div className="flex items-center gap-2">
					<div
						onClick={(e) => {
							e.stopPropagation();
							dispatch(addSelectedChat(null));
						}}
						className="sm:hidden bg-gray-200 hover:bg-gray-300 
						           h-8 w-8 rounded-md 
						           flex items-center justify-center cursor-pointer"
					>
						<FaArrowLeft title="Back" fontSize={14} />
					</div>

					<img
						src={getChatImage(selectedChat, authUserId)}
						alt=""
						className="h-9 w-9 rounded-full"
					/>

					<h1 className="line-clamp-1 font-semibold">
						{getChatName(selectedChat, authUserId)}
					</h1>
				</div>

				<CiMenuKebab
					fontSize={18}
					title="Menu"
					className="cursor-pointer text-gray-600"
				/>
			</div>

			{/* ================= CHAT DETAILS PANEL ================= */}
			{isChatDetailsBox && (
				<div
					className={`h-[60vh] w-full max-w-96 absolute top-0 left-0 z-20 p-1 ${
						isExiting ? "box-exit" : "box-enter"
					}`}
				>
					<div
						ref={chatDetailsBox}
						className="flex border border-gray-300 
						           bg-white overflow-hidden rounded-lg"
					>
						<ChatDetailsBox />
					</div>
				</div>
			)}

			{/* ================= MESSAGE AREA ================= */}
			<div className="flex-1 bg-[#eef3f8] overflow-y-auto">
				{isMessageLoading ? (
					<MessageLoading />
				) : (
					<AllMessages allMessage={allMessage} />
				)}
			</div>

			{/* ================= SEND BOX ================= */}
			<MessageSend chatId={chatId} />
		</>
	);
};

export default MessageBox;
