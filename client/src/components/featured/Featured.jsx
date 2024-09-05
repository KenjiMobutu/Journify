import "./featured.css";
import useFetch from "../../hooks/useFetch";

const Featured = () => {

  const { data, loading, error } = useFetch("/api/hotels/countByCity?cities=Brussels,London,New-york")
  if (error) return <p>Error loading data</p>;
  
  return (
    <div className="featured">
      {loading ? ("Loading...") : (
      <><div className="featuredItem">
        <img src="https://cf.bstatic.com/xdata/images/city/600x600/968269.jpg?k=f7d9cda728263b0436bc3a8f68fdbd80dd2352c40c507ab4adad035debc5dc00&o="
          alt="ost"
          className="featuredImage" />
        <div className="featuredTitles">
          <h1>Ostend 🇧🇪</h1>
          <h2>{data[0]} properties</h2>
        </div>
      </div>
      <div className="featuredItem">
        <img src="https://cf.bstatic.com/xdata/images/city/600x600/976539.jpg?k=0a7263960952588dc71a60f1f9c2e738b5c0af9b2d9d3c3df79677d630b8a665&o="
          alt="amst"
          className="featuredImage" />
        <div className="featuredTitles">
          <h1>Amsterdam 🇳🇱</h1>
          <h2>{data[1]} properties</h2>
        </div>
      </div>
      <div className="featuredItem">
        <img src="https://cf.bstatic.com/xdata/images/city/600x600/972602.jpg?k=3c33b4dfcf76b7f7059b6c292d484a266e2ea1109eb4cd50cc7b1f16d1037628&o="
          alt="amst"
          className="featuredImage" />
        <div className="featuredTitles">
          <h1>Brussels 🇧🇪</h1>
          <h2>{data[2]} properties</h2>
        </div>
      </div>
      </>)}
    </div>
  )
}

export default Featured
