import './single.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import useFetch from '../../hooks/useFetch'
import { useLocation } from 'react-router-dom'

const Single = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const { data } = useFetch(`/api/users/${path}`);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className='single'>
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img src={data.img || "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">
                  {data.userName || "John Doe"}
                </h1>
                <div className="detailItem">
                  <span className="detailKey">ID:</span>
                  <span className="detailValue">{data._id}</span>
                </div>
                <div className="detailItem">
                  <span className="detailKey">Birthday:</span>
                  <span className="detailValue">{data.birthday || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="detailKey">Phone:</span>
                  <span className="detailValue">{data.phone || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="detailKey">Email:</span>
                  <span className="detailValue">{data.email}</span>
                </div>
                <div className="detailItem">
                  <span className="detailKey">Status:</span>
                  <span className="detailValue">{data.isAdmin ? "Admin" : "User"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Single;
