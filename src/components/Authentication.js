import React from 'react'
import { Link } from 'react-router-dom'

const Authentication = ({className,title,href,hreftitle,onClick}) => {
  return (
    <p className={className}>
        {title} 
        {href ? (
          <Link onClick={onClick} to={href}>{hreftitle}</Link>
        ) : (
          <button onClick={onClick}>{hreftitle}</button>
        )} 
    </p>
  )
}

export default Authentication