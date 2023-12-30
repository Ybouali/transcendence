import React from 'react'

function Login() {
    const loginIntra42 = () => {

        const linkIntra42 = process.env.REACT_APP_INTRA_42_LINK;

        window.open(linkIntra42)
    }

    return (
    <div className='flex items-center justify-center min-h-screen flex-col gap-y-4' >
        <button onClick={loginIntra42} className='border-2 border-gray-400 text-lg text-white bg-orange-500 rounded-xl p-2' >
        LOG IN INTRA 42
        </button>
    </div>
    );
}

export default Login
