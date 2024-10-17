export const userColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 250,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "userName",
    headerName: "User Name",
    width: 130,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={
              params.row.img ||
              "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png"
            }
            alt="img"
          />
          {params.row.userName}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "isAdmin",
    headerName: "Status",
    width: 130,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      return (
        <div
          className={`cellWithStatus ${params.row.isAdmin ? "admin" : "user"}`}
        >
          {params.row.isAdmin ? "Admin" : "User"}
        </div>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 100,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString(); // Formate la date en string
    },
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    width: 100,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString(); // Formate la date en string
    },
  },
  {
    field: "bookings",
    headerName: "Have Booking",
    width: 120,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      const hasBookings =
        params.row.bookings.length > 0 ||
        params.row.flightBookings.length > 0 ||
        params.row.taxiBookings.length > 0;
      return hasBookings ? "YES" : "NO";
    },
  },
];

export const bookingsColumns = [
  {
    field: "userName",
    headerName: "User Name",
    width: 150,

    renderCell: (params) => {
      console.log(params);
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={
              params.row.img ||
              "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png"
            }
            alt="img"
          />
          {params.row.userName}
        </div>
      );
    },
  },
  {
    field: "hotelName",
    headerName: "Hotel",
    width: 180,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "city",
    headerName: "City",
    width: 120,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "checkIn",
    headerName: "Arrival",
    width: 130,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString(); // Formate la date en string
    },
  },
  {
    field: "checkOut",
    headerName: "Departure",
    width: 130,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString(); // Formate la date en string
    },
  },
  {
    field: "numberOfNights",
    headerName: "Nights",
    width: 80,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "adultsCount",
    headerName: "People",
    width: 80,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      const totalPeople = params.row.adultsCount + params.row.childrenCount;
      return `${totalPeople}`; // Additionne les adultes et les enfants
    },
  },
  {
    field: "rooms",
    headerName: "Room(s)",
    width: 80,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "paid",
    headerName: "Status",
    width: 130,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      return (
        <span
          style={{
            backgroundColor: params.value ? "#d4edda" : "#f8d7da",
            color: params.value ? "#155724" : "#721c24",
            padding: "5px",
            borderRadius: "5px",
            textAlign: "center",
            width: "80%",
            height: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "7px",
          }}
        >
          {params.value ? "Paid" : "Unpaid"}
        </span>
      );
    },
  },
  {
    field: "canceled",
    headerName: "canceled",
    width: 100,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      return (
        <span
          style={{
            backgroundColor: params.value ? "#f8d7da" : "#d4edda",
            color: params.value ? "#721c24" : "#155724",
            padding: "5px",
            borderRadius: "5px",
            textAlign: "center",
            fontSize: "12px",
            width: "90%",
            height: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "7px",
          }}
        >
          {params.value ? "Canceled" : "Not Canceld"}
        </span>
      );
    },
  },
  {
    field: "totalCost",
    headerName: "Price",
    width: 100,
    headerAlign: "center", // Centrer le titre
    align: "center",
    renderCell: (params) => {
      return `${params.value} €`;
    },
  },
];

export const hotelColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 250,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "type",
    headerName: "Type",
    width: 80,
  },
  {
    field: "description",
    headerName: "Description",
    width: 230,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "city",
    headerName: "City",
    width: 100,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
];

export const roomColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 250,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "roomType",
    headerName: "Room Type",
    width: 230,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "price",
    headerName: "Price",
    width: 150,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
  {
    field: "people",
    headerName: "Max People",
    width: 100,
    headerAlign: "center", // Centrer le titre
    align: "center",
  },
];
