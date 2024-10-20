import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Datatable = ({ columns, title }) => {
  const token = localStorage.getItem("access_token");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  console.log("TITLE", title);
  const location = useLocation();
  const path = `api/${location.pathname.split("/")[1] || "hotels/bookings"}`;
  const [list, setList] = useState([]);

  // Utiliser useEffect pour récupérer les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fullPath = `${backendUrl}/${path}`;
        console.log("Requesting data from:", fullPath);
        const { data } = await axios.get(fullPath, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        });
        setList(data);
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
      }
    };
    fetchData();
  }, [path, token, backendUrl]);

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Delete User',
      message: 'Are you sure to delete this user.',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.delete(`${backendUrl}/api/${path}/${id}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true
              });
              setList((prev) => prev.filter((item) => item._id !== id));
            } catch (err) {
              console.error("Erreur lors de la suppression :", err);
            }
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };

  const handleDeleteBooking = async (id) => {
    confirmAlert({
      title: 'Delete Booking',
      message: 'Are you sure to delete this booking.',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.delete(`${backendUrl}/api/hotels/bookings/${id}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true
              });
              setList((prev) => prev.filter((item) => item._id !== id));
            } catch (err) {
              console.error("Erreur lors de la suppression de la réservation :", err);
            }
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

  const actionBookingColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 180,
      headerAlign: 'center',
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
