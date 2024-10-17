import "./profile.css"
import useFetch from '../../hooks/useFetch'
import Navbar from '../../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'


const Profile = ({socket}) => {
  const token = localStorage.getItem('access_token');
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const path = location.pathname.split("/")[2];
  const { data } = useFetch(`${apiUrl}/api/users/${path}`,{
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true,
  });

  const handleEdit = () => {
    navigate(`/register/${path}`);
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar socket={socket}/>
    <div className='profile'>
      <div className="profileContainer">
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={handleEdit}>Edit</div>
            <h1 className="title">Information</h1>
            <div className="itemProfile">
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
                  <span className="detailKey">Email:</span>
                  <span className="detailValue">{data.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Profile
