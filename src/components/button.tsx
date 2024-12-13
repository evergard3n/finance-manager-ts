import { NavLink } from "react-router-dom";

export const NavButton: React.FC<{ route: string, children: React.ReactNode }> = ({ route, children }) => {
    return (
        
            <NavLink to={route} className={({ isActive, isPending }: { isActive: boolean, isPending: boolean }) => (isActive ? "font-bold" : isPending ? "bg-blue-300" : "") + " mt-2 w-[90%] h-12 rounded-lg flex items-center pl-2 hover:bg-slate-50 transition-all duration-150 ease-in-out "}>
                <div className="flex flex-row gap-2 items-center font-poppins">
                    {children}
                </div>
            </NavLink>

        
    )
}
export const Button: React.FC<{children?: React.ReactNode, onClick: () => void}> = ({children, onClick}) => {
    if (children === null || children === undefined) {
        throw new Error("Button component's children prop is null or undefined");
    }
    if (typeof onClick !== "function") {
        throw new Error("Button component's onClick prop is not a function");
    }
    return (
        <button type="submit" className="text-sm text-gray-500 font-poppins hover:bg-slate-100 p-2 rounded-lg transition-colors duration-300 ease-in-out w-24 flex flex-row justify-start items-center gap-1" onClick={onClick}>{children}</button>
    )
}