import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("Fetching data from: ", url);
      try {
        const res = await axios.get(url, options);
        setData(res.data);
        console.log(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [url, options]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url, options);
      setData(res.data);
      console.log("refetch ");
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
