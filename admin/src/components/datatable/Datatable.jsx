import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";


const Datatable = ({ columns, title }) => {
  console.log("TITLE", title);
  const location = useLocation();
  const path = location.pathname.split("/")[1] || "users";
  const [list, setList] = useState();
  const { data} = useFetch(`/api/${path}`);
  console.log("DATA", data);
  useEffect(() => {
    setList(data);
  }, [data]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/${path}/${id}`);
      setList(list.filter((item) => item._id !== id));
    } catch (err) { }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/${path}/${params.row._id}`}  style={{ textDecoration: "none" }}>
              <div className="datatableEdit">Edit</div>
            </Link>
            <div
              className="datatableDelete"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">{title}</div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
      <button className="createUser">
        <Link to={`/${path}/new`} className="link">
          <div className="icon">
            + NEW
          </div>
        </Link>
      </button>
    </div>

  );
};

export default Datatable;
