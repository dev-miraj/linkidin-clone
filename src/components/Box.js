import React from 'react'

const Box = ({className, children}) => {
  return (
    <div className={className}>{children}</div>
  )
}

export default Box