import React from 'react'

const Flex = ({children,className, onClick}) => {
  return (
    <div onClick={onClick} className={className}>{children}</div>
  )
}

export default Flex