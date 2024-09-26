import { Outlet } from "react-router";
import {  NavLink } from "react-router-dom";

function SideBar() {
    return (
        <div className="bg-white w-1/6 flex flex-col items-center">

                <h1 className="text-2xl font-bold mt-4 -ml-16">Finance <br/> Tracker</h1>
                <NavLink to='/' className={({ isActive, isPending }: { isActive: boolean, isPending: boolean }) => (isActive ? "bg-slate-200" : isPending ? "bg-blue-300" : "" ) + " mt-4 w-[90%] h-12 rounded-lg flex items-center pl-6"}>
                    <div className="flex flex-row gap-2 items-center">
                        <i className="fa-solid fa-house"></i>
                        <p>Home</p>
                    </div>
                </NavLink>
                <NavLink to='/test' className={({ isActive, isPending }: { isActive: boolean, isPending: boolean }) => (isActive ? "bg-slate-200" : isPending ? "bg-blue-300" : "" ) + " mt-4 w-[90%] h-12 rounded-lg flex items-center pl-6"}>
                    <div className="flex flex-row gap-2 items-center">
                    <i className="fa-solid fa-flask-vial"></i>
                        <p>Test</p>
                    </div>
                </NavLink>
                <NavLink to='/cart' className={({ isActive, isPending }: { isActive: boolean, isPending: boolean }) => (isActive ? "bg-slate-200" : isPending ? "bg-blue-300" : "" ) + " mt-4 w-[90%] h-12 rounded-lg flex items-center pl-6"}>
                    <div className="flex flex-row gap-2 items-center">
                    <i className="fa-solid fa-cart-shopping"></i>
                        <p>Cart</p>
                    </div>
                </NavLink>
            
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