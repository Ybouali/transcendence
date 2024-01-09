import React from 'react'
import "./FooterStyle.css"

function Footer() {
    const year = new Date().getFullYear();
  return (
    <footer>
        &copy; &nbsp; {year} &nbsp; FT_Trencendance
    </footer>
  )
}

export default Footer
