export const userColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "userName",
    headerName: "User Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img || "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png" } alt="img" />
          {params.row.userName}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
  {
    field: "isAdmin",
    headerName: "Status",
    width: 160,
    align: "center",
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.isAdmin ? 'admin' : 'user'}`}>
        {params.row.isAdmin ? 'Admin' : 'User'}
      </div>
      );
    },
  },
  
];

export const lastUserColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "userName",
    headerName: "User Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img || "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png" } alt="img" />
          {params.row.userName}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
  {
    field: "isAdmin",
    headerName: "Status",
    width: 160,
    align: "center",
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.isAdmin ? 'admin' : 'user'}`}>
        {params.row.isAdmin ? 'Admin' : 'User'}
      </div>
      );
    },
  },
];

export const hotelColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 230,
  },
  {
    field: "city",
    headerName: "City",
    width: 100,
  },
];


export const roomColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "roomType",
    headerName: "Room Type",
    width: 230,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
  {
    field: "people",
    headerName: "Max People",
    width: 100,
  },
];

