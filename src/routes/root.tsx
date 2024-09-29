import { Outlet } from "react-router";

import { NavButton } from "../components/button";
function SideBar() {
    return (
        <div className="bg-white w-1/6 flex flex-col items-center">

            <h1 className="text-2xl font-bold mt-6 -ml-16">Finance <br /> Tracker</h1>

            <NavButton route='/'>
                <i className="fa-solid fa-house"></i>
                <p>Home</p>
            </NavButton>
            
            <NavButton route='/subscriptions'>
            <i className="fa-solid fa-money-bill-wave"></i>
                    <p>Subscriptions</p>
            </NavButton>
            <NavButton route='/todo'>
            <i className="fa-solid fa-list"></i>
                    <p>To-do List</p>
            </NavButton>

        </div>
    )
}

export default function Root() {
    return (
        <div className="w-full flex flex-row h-dvh">
            <SideBar />
            <Outlet />
        </div>
    )
}