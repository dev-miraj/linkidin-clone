import React from 'react'

const Input = ({className, type, placeholder, onChange, name}) => {
  return (
    <input onChange={onChange} className={className} type={type} name={name} placeholder={placeholder}/>
  )
}

export default Input