import React from "react";

const Animate = () => {
    return (
        <>
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl -top-32 -left-32 animate-pulse "></div>
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl -bottom-32 -right-32 animate-pulse"></div>
        </>
    )
}

export default Animate;