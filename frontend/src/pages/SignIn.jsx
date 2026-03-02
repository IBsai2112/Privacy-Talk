import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import { checkValidSignInFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";
import rightSide from "../assets/rightSide.png";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const logInUser = (e) => {
		// SignIn ---
		toast.loading("Wait until you SignIn");
		e.target.disabled = true;
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				password: password,
			}),
		})
			.then((response) => response.json())
			.then((json) => {
				setLoad("");
				e.target.disabled = false;
				toast.dismiss();
				if (json.token) {
					localStorage.setItem("token", json.token);
					dispatch(addAuth(json.data));
					navigate("/");
					toast.success(json?.message);
				} else {
					toast.error(json?.message);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setLoad("");
				toast.dismiss();
				toast.error("Error : " + error.code);
				e.target.disabled = false;
			});
	};
	const handleLogin = (e) => {
		if (email && password) {
			const validError = checkValidSignInFrom(email, password);
			if (validError) {
				toast.error(validError);
				return;
			}
			setLoad("Loading...");
			logInUser(e);
		} else {
			toast.error("Required: All Fields");
		}
	};
	return (
		<div className="flex flex-row items-center justify-center gap-20 -my-20 min-h-screen text-slate-300 min-h-[80vh] bg-gradient-to-br from-[#1a0a53] via-[#421782] to-[#6D5D91] bg-cover bg-center">
			<div className="p-3 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[1000px] rounded-lg h-[30vw] ml-10  -mt-20 transition-all">
			{/* // style={{ backgroundImage: `url(${bgImage})` }}> */}
				<h2 className="text-2xl underline underline-offset-8 font-semibold text-slate-100 w-full text-center mb-4">
					SignIn ChatApp
				</h2>
				<form className="w-full flex flex-col space-y-4 bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
    {/* Email Section */}
    <div className="group">
        <label className="text-sm font-medium text-slate-400 ml-1 mb-2 block group-focus-within:text-purple-400 transition-colors">
            Email Address
        </label>
        <input
            className="w-full bg-slate-900/50 border border-slate-700/50 py-3 px-6 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all hover:bg-slate-800/50"
            type="email"
            placeholder="name@company.com"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
    </div>

    {/* Password Section */}
    <div className="group">
        <label className="text-sm font-medium text-slate-400 ml-1 mb-2 block group-focus-within:text-purple-400 transition-colors">
            Password
        </label>
        <div className="relative">
            <input
                className="w-full bg-slate-900/50 border border-slate-700/50 py-3 px-6 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all hover:bg-slate-800/50"
                type={isShow ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <span
                onClick={() => setIsShow(!isShow)}
                className="cursor-pointer text-slate-400 hover:text-white absolute right-4 top-1/2 -translate-y-1/2 transition-colors p-2"
            >
                {isShow ? (
                    <PiEyeClosedLight fontSize={20} />
                ) : (
                    <PiEye fontSize={20} />
                )}
            </span>
        </div>
    </div>

    {/* Sign In Button */}
    <button
        onClick={(e) => {
            e.preventDefault();
            handleLogin(e);
        }}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl mt-4 shadow-lg shadow-purple-900/20 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {load === "" ? "Sign In" : load}
    </button>

    {/* Dividers & Links */}
    <div className="space-y-3 pt-2">
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <span className="relative bg-[#1a0a53]/0 px-2 text-xs text-slate-500 uppercase tracking-wider">
                Account Actions
            </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm">
            <Link to={"#"} className="text-slate-400 hover:text-purple-400 transition-colors">
                Forgot Password?
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link to="/signup" className="text-white hover:text-purple-400 font-semibold transition-colors">
                Create New Account
            </Link>
        </div>
    </div>
</form>
			</div>
			<div>
				<img src={rightSide} alt="rightSide" className="a w-full h-[50vh] object-cover rounded-lg" />
			</div>
		</div>
	);
};

export default SignIn;
