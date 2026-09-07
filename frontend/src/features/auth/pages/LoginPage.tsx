import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen mt-16 px-24 pb-24 grid grid-cols-1 lg:grid-cols-2 font-family-[inter] ">
        <div className="flex flex-col gap-6">
          <div className="h-22 flex items-center">
            <h1 className="text-3xl font-light">WorkBridge</h1>
          </div>
          <div>
             <p className="text-4xl font-bold">Login Now</p>
          </div>
          <div className="">
             <p className="font-light text-xs">Hi, Welcome back 👋 </p>
          </div>
             <hr className="bg-gray-600 w-24"/>
           
        </div>
        <div className="sm:hidden">
        </div>
    </div>
  );
};

export default LoginPage;
