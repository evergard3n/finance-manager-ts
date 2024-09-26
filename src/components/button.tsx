import { NavLink } from "react-router-dom";

export default function NavButton({route, name}: {route: string, name: string}) {
    return (
        <div>
            <NavLink to={route} className={({isActive, isPending} : {isActive: boolean, isPending: boolean}) => (isActive ? "bg-blue-400" : isPending ? "bg-blue-300" : "")}>
                {name}
            </NavLink>
            
        </div>
    )
}