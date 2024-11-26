import React from 'react'
import style from './Loader.module.scss'

export default function Loader({ text }) {
  return (
    <div className={style.loaderContainer}>
    <div className={style.loadingDots}>
    <span className={style.loadingDot}></span>
    <span className={style.loadingDot}></span>
    <span className={style.loadingDot}></span>
    </div>
    <p style={{ marginTop: "8px", fontSize: "1rem", color: "#333" }}>{text}</p>
    </div>
  )
}

