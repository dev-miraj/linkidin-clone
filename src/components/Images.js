import React from 'react'

const Images = ({onClick, src, className}) => {
  return (
    <img onClick={onClick} src={src} alt="Not_Found" className={className}/>
  )
}

export default Images