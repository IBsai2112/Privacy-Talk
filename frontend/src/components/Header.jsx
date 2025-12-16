import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdNotificationsActive,
} from "react-icons/md";
import {
	setHeaderMenu,
	setLoading,
	setNotificationBox,
	setProfileDetail,
} from "../redux/slices/conditionSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";

const Header = () => {
	const user = useSelector((store) => store.auth);
	const isHeaderMenu = useSelector((store) => store?.condition?.isHeaderMenu);
	const newMessageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const getAuthUser = (token) => {
		dispatch(setLoading(true));
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addAuth(json.data));
				dispatch(setLoading(false));
			})
			.catch(() => dispatch(setLoading(false)));
	};

	useEffect(() => {
		if (token) {
			getAuthUser(token);
			navigate("/");
		} else {
			navigate("/signin");
		}
		dispatch(setHeaderMenu(false));
	}, [token]);

	const { pathname } = useLocation();
	useEffect(() => {
		if (user) {
			navigate("/");
		} else if (pathname !== "/signin" && pathname !== "/signup") {
			navigate("/signin");
		}
		handleScrollTop();
	}, [pathname, user]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
		navigate("/signin");
	};

	useEffect(() => {
		let prevScrollPos = window.pageYOffset;
		const handleScroll = () => {
			const currentScrollPos = window.pageYOffset;
			const header = document.getElementById("header");
			if (prevScrollPos < currentScrollPos && currentScrollPos > 80) {
				header.classList.add("hiddenbox");
			} else {
				header.classList.remove("hiddenbox");
			}
			prevScrollPos = currentScrollPos;
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const headerMenuBox = useRef(null);
	const headerUserBox = useRef(null);

	const handleClickOutside = (event) => {
		if (
			headerMenuBox.current &&
			!headerUserBox?.current?.contains(event.target) &&
			!headerMenuBox.current.contains(event.target)
		) {
			dispatch(setHeaderMenu(false));
		}
	};

	useEffect(() => {
		if (isHeaderMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isHeaderMenu]);

	return (
		<div
			id="header"
			className="w-full h-16 md:h-20 fixed top-0 z-50 
			           flex justify-between items-center p-4 font-semibold 
			           bg-[black] text-white
			           border-b border-gray-600 shadow-sm"
		>
			<div className="flex items-center gap-2">
				<Link to={"/"}>
					<img
						src={Logo}
						alt="ChatApp"
						className="h-12 w-12 rounded-full"
					/>
				</Link>
				<Link to={"/"}>
					<span>ChatApp</span>
				</Link>
			</div>

			{user ? (
				<div className="flex items-center">
					<span
						className={`relative mr-2 cursor-pointer ${
							newMessageRecieved.length > 0 ? "animate-bounce" : ""
						}`}
						title={`You have ${newMessageRecieved.length} new notifications`}
						onClick={() => dispatch(setNotificationBox(true))}
					>
						<MdNotificationsActive fontSize={24} />
						<span className="absolute -top-1 -right-1 text-xs font-bold">
							{newMessageRecieved.length}
						</span>
					</span>

					<span className="ml-2 whitespace-nowrap">
						Hi, {user.firstName}
					</span>

					<div
						ref={headerUserBox}
						onClick={() => dispatch(setHeaderMenu(!isHeaderMenu))}
						className="flex items-center ml-3 
						           border border-gray-500 rounded-full 
						           bg-gray-600 hover:bg-gray-500 
						           cursor-pointer"
					>
						<img
							src={user.image}
							alt="user"
							className="w-10 h-10 rounded-full"
						/>
						<span className="m-2">
							{isHeaderMenu ? (
								<MdKeyboardArrowDown fontSize={20} />
							) : (
								<MdKeyboardArrowUp fontSize={20} />
							)}
						</span>
					</div>

					{isHeaderMenu && (
						<div
							ref={headerMenuBox}
							className="absolute top-16 right-4 z-40 
							           w-40 py-2 rounded-md 
							           bg-gray-700 border border-gray-600"
						>
							<div
								onClick={() => {
									dispatch(setHeaderMenu(false));
									dispatch(setProfileDetail());
								}}
								className="flex items-center justify-center gap-2 
								           py-2 cursor-pointer 
								           hover:bg-gray-600"
							>
								<PiUserCircleLight fontSize={20} />
								<span>Profile</span>
							</div>

							<div
								onClick={handleLogout}
								className="flex items-center justify-center gap-2 
								           py-2 cursor-pointer 
								           hover:bg-gray-600"
							>
								<IoLogOutOutline fontSize={20} />
								<span>Logout</span>
							</div>
						</div>
					)}
				</div>
			) : (
				<Link to={"/signin"}>
					<button className="py-2 px-4 border border-gray-400 rounded-full bg-gray-600 hover:bg">
						SignIn
					</button>
				</Link>
			)}
		</div>
	);
};

export default Header;
