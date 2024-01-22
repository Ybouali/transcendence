import React from 'react'
import "./PodumStyle.css"

function Podum() {
  return (
    <div className="podium">
      <div className="level-2">
        <div className="leadboard-card">
          <div className="leadboard-card-content">
            <div className="leadboard-image">
              <img src="./images/avatars/member_2.png" alt="leader card" /> 
            </div>
            <div className="leadboard-infos">
              <a href="#" className="leadboard-username">
                Samantha
              </a>
            </div>
          </div>
        </div>
        <div className="stage"></div>
      </div>
      <div className="level-1">
        <div className="leadboard-card">
          <div className="leadboard-card-content">
            <div className="leadboard-image">
              <img src="./images/avatars/member_1.png" alt="leader card" />
            </div>
            <div className="leadboard-infos">
              <a href="#" className="leadboard-username">
                Karim
              </a>
            </div>
          </div>
        </div>
        <div className="stage"></div>
      </div>
      <div className="level-3">
        <div className="leadboard-card">
          <div className="leadboard-card-content">
            <div className="leadboard-image">
              <img src="./images/avatars/member_3.png" alt="leader card" /> 
            </div>
            <div className="leadboard-infos">
              <a href="#" className="leadboard-username">
                John
              </a>
            </div>
          </div>
        </div>
        <div className="stage"></div>
      </div>
    </div>
  )
}

export default Podum
