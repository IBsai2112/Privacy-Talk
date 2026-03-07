import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { VscCheckAll } from "react-icons/vsc";
import { CgChevronDoubleDown } from "react-icons/cg";
import {
	SimpleDateAndTime,
	SimpleDateMonthDay,
	SimpleTime,
} from "../../utils/formateDateTime";

const AllMessages = ({ allMessage }) => {
	const chatBox = useRef();
	const adminId = useSelector((store) => store.auth?._id);
	const isTyping = useSelector((store) => store?.condition?.isTyping);

	const [scrollShow, setScrollShow] = useState(true);

	const handleScrollDownChat = () => {
		if (chatBox.current) {
			chatBox.current.scrollTo({
				top: chatBox.current.scrollHeight,
			});
		}
	};

	useEffect(() => {
		handleScrollDownChat();
		if (chatBox.current.scrollHeight === chatBox.current.clientHeight) {
			setScrollShow(false);
		}

		const handleScroll = () => {
			const currentScrollPos = chatBox.current.scrollTop;
			if (
				currentScrollPos + chatBox.current.clientHeight <
				chatBox.current.scrollHeight - 30
			) {
				setScrollShow(true);
			} else {
				setScrollShow(false);
			}
		};

		const chatBoxCurrent = chatBox.current;
		chatBoxCurrent.addEventListener("scroll", handleScroll);

		return () => {
			chatBoxCurrent.removeEventListener("scroll", handleScroll);
		};
	}, [allMessage, isTyping]);

	return (
		<>
			{scrollShow && (
				<div
					className="absolute bottom-16 right-4 cursor-pointer z-20 
					           text-gray-700 bg-white border border-gray-300 
					           hover:bg-gray-100 p-1.5 rounded-full"
					onClick={handleScrollDownChat}
				>
					<CgChevronDoubleDown title="Scroll Down" fontSize={22} />
				</div>
			)}

			<div
				className="flex flex-col w-full px-3 gap-1 py-2 
						   bg-[#110d23] bg-cover
						   border-4 border-black border-b-0
				           overflow-y-auto scroll-style h-[66vh]"
				ref={chatBox}
			>
				{allMessage?.map((message, idx) => (
					<Fragment key={message._id}>
						{/* DATE SEPARATOR */}
						<div className="sticky top-0 flex w-full justify-center z-10">
							{new Date(
								allMessage[idx - 1]?.updatedAt
							).toDateString() !==
								new Date(message?.updatedAt).toDateString() && (
								<span className="text-xs font-light mb-2 mt-1 
								                 text-gray-600 bg-gray-200 
								                 h-7 px-4 rounded-full 
								                 flex items-center">
									{SimpleDateMonthDay(message?.updatedAt)}
								</span>
							)}
						</div>

						{/* MESSAGE ROW */}
						<div
							className={`flex items-start gap-1 ${
								message?.sender?._id === adminId
									? "flex-row-reverse"
									: "flex-row"
							}`}
						>
							{/* AVATAR (GROUP CHAT) */}
							{message?.chat?.isGroupChat &&
								message?.sender?._id !== adminId &&
								(allMessage[idx + 1]?.sender?._id !==
								message?.sender?._id ? (
									<img
										src={message?.sender?.image}
										alt=""
										className="h-9 w-9 rounded-full"
									/>
								) : (
									<div className="h-9 w-9" />
								))}

							{/* MESSAGE BUBBLE */}
							<div
								className={`py-2 px-3 min-w-10 flex flex-col relative 
								            max-w-[85%] rounded-2xl ${
									message?.sender?._id === adminId
										? "bg-[#9d7dfa]"
										: "bg-[#211844]"
								}`}
							>
								{/* GROUP SENDER NAME */}
								{message?.chat?.isGroupChat &&
									message?.sender?._id !== adminId && (
										<span className="text-xs font-semibold text-blue-700">
											{message?.sender?.firstName}
										</span>
									)}

								{/* MESSAGE TEXT */}
								<div
									className={`mt-1 pb-1 ${
										message?.sender?._id === adminId
											? "pr-15"
											: "pr-12"
									}`}
								>
									<span className="text-white">
										{message?.message}
									</span>

									{/* TIME + TICKS */}
									<span
										className="text-[8px] text-gray-300 
										           absolute bottom-1 right-2
										           flex items-end gap-1.5"
										title={SimpleDateAndTime(
											message?.updatedAt
										)}
									>
										{SimpleTime(message?.updatedAt)}
										{message?.sender?._id === adminId && (
											<VscCheckAll
												className="text-blue-600"
												fontSize={14}
											/>
										)}
									</span>
								</div>
							</div>
						</div>
					</Fragment>
				))}

				{/* TYPING INDICATOR */}
				{isTyping && (
					<div id="typing-animation">
						<span></span>
						<span></span>
						<span></span>
					</div>
				)}
			</div>
		</>
	);
};

export default AllMessages;
