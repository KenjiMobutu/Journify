import './single.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'

const Single = () => {
  return (
    <div className='single'>
      <Sidebar/>
      <div className="singleContainer">
        <Navbar/>
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img src="https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">
                  John Doe
                </h1>
                <div className="detailItem">
                  <span className="detailKey">ID:</span>
                  <span className="detailValue">123</span>
                </div>
                <div className="detailItem">
                  <span className="detailKey">Birthday:</span>
                  <span className="detailValue">10.12.1999</span>
                </div>
                <div className="detailItem">
                  <span className="detailKey">Phone:</span>
                  <span className="detailValue">+123 456 789</span>
                </div>
                <div className="detailItem">
                  <span className="detailKey">Email:</span>
                  <span className="detailValue">JDoe@gmail.com</span>
                </div>
                <div className="detailItem">
                  <span className="detailKey">Status:</span>
                  <span className="detailValue">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Single
