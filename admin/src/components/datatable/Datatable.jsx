import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const Datatable = ({ columns, title }) => {
  console.log("TITLE", title);
  const location = useLocation();
  const path = location.pathname.split("/")[1] || "hotels/bookings";
  const [list, setList] = useState();
  const { data } = useFetch(`/api/${path}`);
  console.log("DATA", data);
  useEffect(() => {
    setList(data);
  }, [data]);

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Delete User',
      message: 'Are you sure to delete this user.',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.delete(`/api/${path}/${id}`);
              setList(list.filter((item) => item._id !== id));
            } catch (err) { }
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 180,
      headerAlign: 'center',  // Centrer le titre
    align: 'center',
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/${path}/${params.row._id}`} style={{ textDecoration: "none" }}>
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

  const handleDeleteBooking = async (id) => {
    confirmAlert({
      title: 'Delete Booking',
      message: 'Are you sure to delete this booking.',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.delete(`/api/hotels/bookings/${id}`);
              setList(list.filter((item) => item._id !== id));
            } catch (err) { }
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };


  const actionBookingColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 180,
      headerAlign: 'center',  // Centrer le titre
    align: 'center',
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="datatableDelete"
              onClick={() => handleDeleteBooking(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];



  const finalColumns = path === "hotels/bookings" ? columns.concat(actionBookingColumn) : columns.concat(actionColumn);

  return (
    <div className="datatable">
      <div className="datatableTitle">{title}</div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={finalColumns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
      {path !== "hotels/bookings" && (
        <button className="createUser">
          <Link to={`/${path}/new`} className="link">
            <div className="icon">
              + NEW
            </div>
          </Link>
        </button>
      )}
    </div>

  );
};

export default Datatable;
