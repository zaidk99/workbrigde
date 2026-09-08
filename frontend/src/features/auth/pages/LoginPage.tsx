import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const LoginPage = () => {
 const [showPassword , setShowPassword] = useState(false);
 function handlePassword(){
    setShowPassword((prev) => (!prev));
 };
 
  return (
    <div className="grid min-h-screen w-full grid-cols-1 pt-16 sm:pt-24 font-family-[inter]">
      <div className="flex w-full flex-col items-center gap-4 px-4 sm:gap-6">
        <div className="flex h-22 items-center">
          <h1 className="text-2xl font-light sm:text-3xl">WorkBridge</h1>
        </div>
        <div>
          <p className="text-3xl font-bold sm:text-4xl">Login Now</p>
        </div>
        <div>
          <p className="text-xs font-light">Hi, Welcome back 👋 </p>
        </div>
        <hr className="w-24 bg-gray-600" />
        <form className="flex w-full max-w-88 flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-lg font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your username"
              className="h-10 w-full rounded-lg border-2 border-gray-300 p-1.5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-lg font-semibold">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="h-10 w-full rounded-lg border-2 border-gray-300 p-1.5 pr-10"
              />
              <button
                type="button"
                onClick={handlePassword}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
              >
                {showPassword ? <LuEye /> : <LuEyeOff /> }
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="h-10 w-full rounded-lg bg-[#474BCA] text-xl font-medium text-white hover:bg-blue-600">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
