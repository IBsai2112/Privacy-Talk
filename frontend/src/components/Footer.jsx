import React from "react";
import { FaPenAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<div className="w-full min-h-32 shadow-inner shadow-gray-700 
		                flex flex-col justify-between items-start 
		                px-4 py-8 bg-[black] text-white">
			
			<h1 className="font-bold text-lg flex items-center gap-4">
				<span>Privacy Talk</span>
				<FaPenAlt fontSize={16} />
			</h1>

			<div className="flex items-center justify-start w-full p-4 flex-wrap">
				
				<div className="flex flex-col min-w-[280px] w-[33%] my-3">
					<h1 className="font-semibold mb-2">Contact</h1>
					<span>Sainjal Kalnekar</span>
					<span>Goa</span>
					<span>Pincode - 403503</span>
					<span>
						<Link
							to={"mailto:contact.sainjalkalnekar21@gmail.com"}
							target="_blank"
							className="hover:text-blue-400 hover:underline"
						>
							contact.sainjalkalnekar21@gmail.com
						</Link>
					</span>
				</div>

				<div className="flex flex-col min-w-[280px] w-[33%] my-3">
					<h1 className="font-semibold mb-2">Pages</h1>
					<span>
						<Link
							className="hover:text-blue-400 hover:underline"
							to={"/"}
						>
							Chat App
						</Link>
					</span>
					<span>
						<Link
							className="hover:text-blue-400 hover:underline"
							to={"/signin"}
						>
							SignIn
						</Link>
					</span>
					<span>
						<Link
							className="hover:text-blue-400 hover:underline"
							to={"/signup"}
						>
							SignUp
						</Link>
					</span>
					<span>
						<Link
							className="hover:text-blue-400 hover:underline"
							to={"/home"}
						>
							Home
						</Link>
					</span>
				</div>

				<div className="flex flex-col min-w-[280px] w-[33%] my-3">
					<h1 className="font-semibold mb-2">Links</h1>
					<span>
						<a
							className="hover:text-blue-400 hover:underline"
							href="https://www.linkedin.com/in/sainjal/"
							target="_blank"
							rel="noreferrer"
						>
							LinkedIn
						</a>
					</span>
					<span>
						<a
							className="hover:text-blue-400 hover:underline"
							href="https://github.com/IBsai2112"
							target="_blank"
							rel="noreferrer"
						>
							Github
						</a>
					</span>
					<span>
						<a
							className="hover:text-blue-400 hover:underline"
							href="https://instagram.com/"
							target="_blank"
							rel="noreferrer"
						>
							Instagram
						</a>
					</span>
					<span>
						<a
							className="hover:text-blue-400 hover:underline"
							href="mailto:contact.sainjalkalnekar21@gmail.com"
							target="_blank"
							rel="noreferrer"
						>
							E-Mail
						</a>
					</span>
				</div>
			</div>

			<h1 className="font-bold">
				All rights reserved 2025 &copy; PrivacyTalk
			</h1>
		</div>
	);
};

export default Footer;
