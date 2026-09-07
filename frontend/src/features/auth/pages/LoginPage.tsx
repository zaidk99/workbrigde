import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen mt-16 px-24 pb-24 grid grid-cols-1 lg:grid-cols-2 font-family-[inter] ">
      <div className="flex flex-col gap-6 pl-1.5">
        <div className="h-22 flex items-center">
          <h1 className="text-3xl font-light">WorkBridge</h1>
        </div>
        <div>
          <p className="text-4xl font-bold">Login Now</p>
        </div>
        <div className="">
          <p className="font-light text-xs">Hi, Welcome back 👋 </p>
        </div>
        <hr className="bg-gray-600 w-24" />
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-lg font-semibold">User name</label>
            <input type="text" id="username" placeholder="Enter your username" className="w-88 h-10 rounded-lg p-1.5 border-2 border-gray-300"/>
          </div>
          <div className="flex flex-col gap-2" >
            <label htmlFor="password" className="text-lg font-semibold">Password</label>
            <input type="password" id="password" placeholder="Enter your password" className="w-88 h-10 rounded-lg p-1.5 border-2 border-gray-300"/>
            <button className="text-xl font-medium w-88 h-10 text-white bg-[#474BCA] rounded-lg hover:bg-blue-600">Login</button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default LoginPage;
