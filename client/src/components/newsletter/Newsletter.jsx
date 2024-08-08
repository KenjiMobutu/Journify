import "./Newsletter.css";

const Newsletter = () => {
  return(
    <div className="email"> 
      <div className="emailContainer">
        <h1 className="emailTitle">Save time, save money!</h1>
        <span className="emailDesc">Stay up to date with the latest news, offers and special announcements</span>
        <div className="emailInput">
          <input type="email" placeholder="Your email" className="emailInput"/>
          <button className="emailButton">Sign Up</button>
        </div>
      </div>
    </div>
  )
}

export default Newsletter
