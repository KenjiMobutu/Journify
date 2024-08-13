import "./featured.scss"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CallReceivedOutlinedIcon from '@mui/icons-material/CallReceivedOutlined';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';

const Featured = () => {
  return (
    <div className="featured ">
      <div className="top">
        <h1 className="title">Revenue</h1>
        <MoreVertIcon className="moreIcon" fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={75} text="75%" />
        </div>
        <p className="title">Total sales today</p>
        <p className="amount">2,345€</p>
        <p className="bottomText">Compared to last month</p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Daily sales</div>
            <div className="itemResult positive">
              <ArrowOutwardOutlinedIcon className="icon" />
              <div className="resultAmount">3455€</div>
            </div>
          </div>

          <div className="item">
            <div className="itemTitle">Last week</div>
            <div className="itemResult negative">
              <CallReceivedOutlinedIcon className="icon" />
              <div className="resultAmount">3455€</div>
            </div>
          </div>

          <div className="item">
            <div className="itemTitle">Last month</div>
            <div className="itemResult negative">
              <CallReceivedOutlinedIcon className="icon" />
              <div className="resultAmount">3455€</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Featured
