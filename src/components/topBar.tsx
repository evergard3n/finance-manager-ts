export const TopBar: React.FC<{title: string, synopsis: string}> = ({title, synopsis}) => {
    return (
        <div className="border-b border-slate-300 py-4 flex justify-between items-center">
            <div>
            <h1 className="font-[poppins]  text-3xl">{title}</h1>
            <p>{synopsis}</p>
            </div>
            <div className="rounded-full relative overflow-hidden w-16 h-16  border-pink-400 border-2">
                <img className=" absolute top-8 right-0 object-cover scale-[2]" src="\pfp.jpg" alt="" />
            </div>
        </div>
    )
}