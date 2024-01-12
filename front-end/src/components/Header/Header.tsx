import React, { useEffect, useRef, useState } from 'react'
import "./HeaderStyle.css"
import { LoginType } from '../../types/LoginTypes';
import { useNavigate } from 'react-router-dom';

function Header(props: LoginType) {

  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  
  useEffect(() => {

    if (props.isConnected) {

      const delayedTask = setTimeout(() => {
        const at: string | null = localStorage.getItem('access_token');
        const rt: string | null = localStorage.getItem('refresh_token');
        
        if (at === null || rt === null) {
          navigate('/chat');
          return;
        }
        
        getUserInfo(at, rt);

      }, 2000);
  
      // Cleanup function to clear the timeout in case the component unmounts before the delay
      return () => clearTimeout(delayedTask);
    }

  }, [])


  const getUserInfo = async (at: string, rt: string) => {
    const headers = new Headers({
      'access_token': at,
      'refresh_token': rt
    })

    console.log(at, rt)

    console.log({
      headers
    })
    
    const resData = await fetch('http://localhost:3333/users/me', {
      method: 'GET',
      headers: headers,
    })
    .then(response => {
      return response.json();
    })
    .catch (err => {
      console.error(err);
    })

    console.log({
       resData
    })

  }

  const isConnected: boolean = props.isConnected;

  return (
    <>
      {isConnected && (
        <header className="primary-header identified" data-status="online">
          <div className="container">
            <div className="primary-header-content">
              <a href="#" aria-label="home" className="logo">
                <svg
                  width="84"
                  height="40"
                  viewBox="0 0 84 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  id="logo"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M31.1308 51.9852C31.0706 45.986 28.9865 40.0795 25.286 35.404C21.6127 30.7115 16.3763 27.2841 10.637 25.8258L11.4055 25.9275C10.9253 25.9232 10.452 25.8132 10.0195 25.6054L10.6223 25.8281C10.4241 25.7747 10.2276 25.7151 10.0332 25.6495L12.1127 20.1295C12.0979 20.1164 12.0792 20.1085 12.0594 20.1069L12.6633 20.3285C12.2757 20.1301 11.8458 20.0277 11.4101 20.0301L12.1797 20.1318C19.1483 22.0547 25.379 26.3379 29.6733 32.0545C34.0015 37.7519 36.3433 44.8895 36.265 51.9852H31.1308Z"
                    fill="#979797"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24.7059 14.501C31.3312 18.2966 36.8276 23.7734 40.6353 30.3734C44.4266 36.9175 46.3915 44.4756 46.3223 51.9851H41.1881C41.1211 45.3596 39.272 38.7997 35.8643 33.1588C32.4535 27.497 27.6013 22.833 21.7988 19.6388L24.7059 14.501Z"
                    fill="#979797"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.313 0.769775C28.5463 3.7903 38.6343 10.6396 45.6074 19.8357C49.1098 24.431 51.8317 29.5673 53.6646 35.04C55.4874 40.5041 56.4037 46.2276 56.3776 51.9852H51.2434C51.204 46.7973 50.316 41.6505 48.6144 36.747C46.9112 31.8563 44.4137 27.2771 41.2213 23.1919C38.0351 19.1123 34.2021 15.5774 29.8733 12.7264C25.5534 9.88528 20.7939 7.77068 15.7852 6.46717L17.313 0.769775Z"
                    fill="#979797"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.45811 13.2927C7.44753 12.4373 7.60765 11.5884 7.92919 10.7951C8.25074 10.0019 8.72729 9.28019 9.33119 8.67186C9.9351 8.06353 10.6543 7.58072 11.4471 7.25145C12.2399 6.92217 13.0905 6.753 13.9495 6.75375C14.8084 6.7545 15.6587 6.92515 16.4509 7.25581C17.2431 7.58646 17.9615 8.07053 18.5643 8.67991C19.1672 9.28929 19.6425 10.0118 19.9626 10.8056C20.2828 11.5994 20.4414 12.4486 20.4293 13.304C20.4053 15.0021 19.7107 16.6226 18.4958 17.8145C17.2809 19.0064 15.6435 19.6738 13.9381 19.6724C12.2327 19.6709 10.5965 19.0006 9.38371 17.8065C8.17092 16.6125 7.47913 14.9909 7.45811 13.2927ZM26.7202 10.8328C26.2576 8.44639 25.1302 6.2377 23.4667 4.45918C21.8032 2.68067 19.6709 1.4041 17.3134 0.775359C15.6632 0.329274 13.9406 0.213583 12.2452 0.434983C10.5498 0.656383 8.91542 1.21048 7.43655 2.06518C5.9511 2.91606 4.64882 4.05045 3.60433 5.40336C2.56183 6.75249 1.8018 8.29624 1.36925 9.94318C-0.440158 16.6523 3.42498 23.5841 10.0281 25.6528C10.1177 25.6879 10.2074 25.7094 10.2857 25.732C10.2971 25.7421 10.3187 25.7421 10.3414 25.7421C10.4197 25.7761 10.4969 25.7975 10.5763 25.8213H10.6092L10.6206 25.8326C10.6433 25.8428 10.6649 25.8428 10.6989 25.8428C10.7103 25.8541 10.7216 25.8541 10.7318 25.8541C10.7736 25.8755 10.8199 25.8868 10.8669 25.8868H10.8771C11.8942 26.1321 12.9227 26.2554 13.9386 26.2554C16.5085 26.2554 18.9888 25.4867 21.0786 24.1177C22.3186 23.3193 23.4079 22.3099 24.2967 21.1356C25.328 19.8023 26.0835 18.2784 26.5193 16.6523C27.0349 14.7537 27.1036 12.7622 26.7202 10.8328ZM83.9764 24.8932C80.4235 24.8593 76.8274 25.5364 73.5264 26.859C70.199 28.2063 67.1678 30.1877 64.6031 32.6921C62.0316 35.2089 59.9794 38.2023 58.5619 41.5038C57.1527 44.8218 56.4104 48.3828 56.3768 51.9852H51.2425C51.2103 47.6978 52.0233 43.4458 53.6354 39.4701C56.9326 31.4162 63.2946 24.9879 71.3333 21.5878C75.3357 19.9049 79.632 19.0241 83.9764 18.9957V24.8932Z"
                    fill="black"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M74.3273 16.1356C66.4631 18.1546 59.2629 22.8459 54.2581 29.2747C51.7348 32.495 49.7574 36.1046 48.4042 39.9607C47.052 43.8278 46.3483 47.8903 46.3212 51.9851H41.187C41.1483 47.3209 41.8808 42.6821 43.3551 38.2548C44.8359 33.8187 47.0357 29.6538 49.8674 25.9252C55.5158 18.4496 63.6922 12.9116 72.7994 10.4382L74.3273 16.1356Z"
                    fill="black"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M60.3209 11.1664C53.0855 15.2686 47.0529 21.1834 42.8216 28.3242C38.6035 35.438 36.3196 43.6845 36.2651 51.9853H31.1309C31.0503 42.8039 33.4431 33.5795 38.0336 25.5659C42.6515 17.4951 49.3128 10.7705 57.3536 6.0625L60.3209 11.1664Z"
                    fill="black"
                  />
                </svg>
                <p className="sub-logo">Ping-ball</p>
              </a>
              <div className="search-bar">
                <i className="fa-solid fa-magnifying-glass fa-2x"></i>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search users, friends"
                />
              </div>
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="user-image dropdown-button"
              >
                <img src="/images/avatars/member_3.png" alt="user image" />
              </button>
              <button
                className={`dropdown-menu ${openMenu ? "open" : ""}`}
              >
                <div className="dropdown-menu-content">
                  <ul className="dropdown-list">
                    <li className="dropdown-item user-profile-item">
                      <div className="user-image dropdown-item-user-image">
                        <img
                          src="./images/avatars/member_3.png"
                          alt="user image"
                        />
                      </div>
                      <div className="user-infos">
                        <div className="username">JohnDoe</div>
                        <div className="user-status">Online</div>
                      </div>
                    </li>
                    <li className="dropdown-item">
                      <a href="#">
                        <div className="dropdown-item-icon">
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="dropdown-item-title">profile</div>
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="#">
                        <div className="dropdown-item-icon">
                          <i className="fa-solid fa-user-group"></i>
                        </div>
                        <div className="dropdown-item-title">friends</div>
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="#">
                        <div className="dropdown-item-icon">
                          <i className="fa-solid fa-message"></i>
                        </div>
                        <div className="dropdown-item-title">chat</div>
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="#">
                        <div className="dropdown-item-icon">
                          <i className="fa-solid fa-table-tennis-paddle-ball"></i>
                        </div>
                        <div className="dropdown-item-title">
                          play ping-pong
                        </div>
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="#">
                        <div className="dropdown-item-icon">
                          <i className="fa-solid fa-trophy"></i>
                        </div>
                        <div className="dropdown-item-title">leaderboard</div>
                      </a>
                    </li>

                    <li className="dropdown-item">
                      <a href="#">
                        <div className="dropdown-item-icon">
                          <i className="fa-solid fa-gear"></i>
                        </div>
                        <div className="dropdown-item-title">settings</div>
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="#">
                        <div className="dropdown-item-icon">
                          <i className="fa-solid fa-right-from-bracket"></i>
                        </div>
                        <div className="dropdown-item-title" >logout</div>
                      </a>
                    </li>
                  </ul>
                </div>
              </button>
            </div>
          </div>
        </header>
      )}

      {!isConnected && (
        <header className="primary-header">
          <div className="container">
            <div className="nav-wrapper">
              <a href="chat.html" aria-label="home" className="logo">
                <svg
                  width="84"
                  height="40"
                  viewBox="0 0 84 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  id="logo"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M31.1308 51.9852C31.0706 45.986 28.9865 40.0795 25.286 35.404C21.6127 30.7115 16.3763 27.2841 10.637 25.8258L11.4055 25.9275C10.9253 25.9232 10.452 25.8132 10.0195 25.6054L10.6223 25.8281C10.4241 25.7747 10.2276 25.7151 10.0332 25.6495L12.1127 20.1295C12.0979 20.1164 12.0792 20.1085 12.0594 20.1069L12.6633 20.3285C12.2757 20.1301 11.8458 20.0277 11.4101 20.0301L12.1797 20.1318C19.1483 22.0547 25.379 26.3379 29.6733 32.0545C34.0015 37.7519 36.3433 44.8895 36.265 51.9852H31.1308Z"
                    fill="#979797"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24.7059 14.501C31.3312 18.2966 36.8276 23.7734 40.6353 30.3734C44.4266 36.9175 46.3915 44.4756 46.3223 51.9851H41.1881C41.1211 45.3596 39.272 38.7997 35.8643 33.1588C32.4535 27.497 27.6013 22.833 21.7988 19.6388L24.7059 14.501Z"
                    fill="#979797"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.313 0.769775C28.5463 3.7903 38.6343 10.6396 45.6074 19.8357C49.1098 24.431 51.8317 29.5673 53.6646 35.04C55.4874 40.5041 56.4037 46.2276 56.3776 51.9852H51.2434C51.204 46.7973 50.316 41.6505 48.6144 36.747C46.9112 31.8563 44.4137 27.2771 41.2213 23.1919C38.0351 19.1123 34.2021 15.5774 29.8733 12.7264C25.5534 9.88528 20.7939 7.77068 15.7852 6.46717L17.313 0.769775Z"
                    fill="#979797"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.45811 13.2927C7.44753 12.4373 7.60765 11.5884 7.92919 10.7951C8.25074 10.0019 8.72729 9.28019 9.33119 8.67186C9.9351 8.06353 10.6543 7.58072 11.4471 7.25145C12.2399 6.92217 13.0905 6.753 13.9495 6.75375C14.8084 6.7545 15.6587 6.92515 16.4509 7.25581C17.2431 7.58646 17.9615 8.07053 18.5643 8.67991C19.1672 9.28929 19.6425 10.0118 19.9626 10.8056C20.2828 11.5994 20.4414 12.4486 20.4293 13.304C20.4053 15.0021 19.7107 16.6226 18.4958 17.8145C17.2809 19.0064 15.6435 19.6738 13.9381 19.6724C12.2327 19.6709 10.5965 19.0006 9.38371 17.8065C8.17092 16.6125 7.47913 14.9909 7.45811 13.2927ZM26.7202 10.8328C26.2576 8.44639 25.1302 6.2377 23.4667 4.45918C21.8032 2.68067 19.6709 1.4041 17.3134 0.775359C15.6632 0.329274 13.9406 0.213583 12.2452 0.434983C10.5498 0.656383 8.91542 1.21048 7.43655 2.06518C5.9511 2.91606 4.64882 4.05045 3.60433 5.40336C2.56183 6.75249 1.8018 8.29624 1.36925 9.94318C-0.440158 16.6523 3.42498 23.5841 10.0281 25.6528C10.1177 25.6879 10.2074 25.7094 10.2857 25.732C10.2971 25.7421 10.3187 25.7421 10.3414 25.7421C10.4197 25.7761 10.4969 25.7975 10.5763 25.8213H10.6092L10.6206 25.8326C10.6433 25.8428 10.6649 25.8428 10.6989 25.8428C10.7103 25.8541 10.7216 25.8541 10.7318 25.8541C10.7736 25.8755 10.8199 25.8868 10.8669 25.8868H10.8771C11.8942 26.1321 12.9227 26.2554 13.9386 26.2554C16.5085 26.2554 18.9888 25.4867 21.0786 24.1177C22.3186 23.3193 23.4079 22.3099 24.2967 21.1356C25.328 19.8023 26.0835 18.2784 26.5193 16.6523C27.0349 14.7537 27.1036 12.7622 26.7202 10.8328ZM83.9764 24.8932C80.4235 24.8593 76.8274 25.5364 73.5264 26.859C70.199 28.2063 67.1678 30.1877 64.6031 32.6921C62.0316 35.2089 59.9794 38.2023 58.5619 41.5038C57.1527 44.8218 56.4104 48.3828 56.3768 51.9852H51.2425C51.2103 47.6978 52.0233 43.4458 53.6354 39.4701C56.9326 31.4162 63.2946 24.9879 71.3333 21.5878C75.3357 19.9049 79.632 19.0241 83.9764 18.9957V24.8932Z"
                    fill="black"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M74.3273 16.1356C66.4631 18.1546 59.2629 22.8459 54.2581 29.2747C51.7348 32.495 49.7574 36.1046 48.4042 39.9607C47.052 43.8278 46.3483 47.8903 46.3212 51.9851H41.187C41.1483 47.3209 41.8808 42.6821 43.3551 38.2548C44.8359 33.8187 47.0357 29.6538 49.8674 25.9252C55.5158 18.4496 63.6922 12.9116 72.7994 10.4382L74.3273 16.1356Z"
                    fill="black"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M60.3209 11.1664C53.0855 15.2686 47.0529 21.1834 42.8216 28.3242C38.6035 35.438 36.3196 43.6845 36.2651 51.9853H31.1309C31.0503 42.8039 33.4431 33.5795 38.0336 25.5659C42.6515 17.4951 49.3128 10.7705 57.3536 6.0625L60.3209 11.1664Z"
                    fill="black"
                  />
                </svg>

                <p className="sub-logo">Ping-ball</p>
              </a>

              <button
                className="mobile-nav-toggle"
                aria-controls="primary-navigation"
                aria-expanded="false"
              >
                <img
                  className="icon-hamburger"
                  src="images/icon-hamburger.svg"
                  alt="Icon Hamburger"
                  aria-hidden="true"
                />
                <img
                  className="icon-close"
                  src="images/icon-close.svg"
                  alt="Icon Close"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Menu</span>
              </button>

              <nav id="primary-navigation" className="primary-navigation">
                <ul role="list" aria-label="Primary" className="nav-list">
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="#about">About the game</a>
                  </li>
                  <li>
                    <a href="#team">Team</a>
                  </li>
                </ul>
              </nav>

              <button
                onClick={props.logInFunc}
                className="button | display-sm-none display-md-inline-flex"
              >
                Login with intra
              </button>
            </div>
          </div>
        </header>
      )}
    </>
  )
}

export default Header
