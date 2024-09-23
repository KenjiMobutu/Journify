import React from 'react'
import Navbar from "../../components/navbar/Navbar"
import Friends from '../../components/friend/Friend'

const Friend = ({socket}) => {
  return (
    <div>
      <Navbar socket={socket}/>
      <Friends socket={socket}/>
    </div>
  )
}

export default Friend