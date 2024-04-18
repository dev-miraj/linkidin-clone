import React from 'react'
import './error.css'
import { useNavigate } from 'react-router-dom';

const Error404 = () => {

    const navigate = useNavigate();

  return (
    <>
        <div className='error_main'>
            <button onClick={() => navigate(-1)}>Back to Previous Page</button>
            <h1>404 Error</h1>
            <h1>Page Not Found</h1>
        </div>
    </>
  )
}

export default Error404