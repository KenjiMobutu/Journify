export const userInputs = [
  {
    id:"userName",
    label: "Username",
    type: "text",
    placeholder: "john_doe",
  },
  {
    id: "email",
    label: "Email",
    type: "mail",
    placeholder: "john_doe@gmail.com",
  },
  {
    id: "password",
    label: "Password",
    type: "password",

  },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    type: "password",
  },
];

export const hotelInputs = [
  {
    id: "name",
    label: "Hotel Name",
    type: "text",
    placeholder: "Hilton",
  },
  {
    id: "type",
    label: "Type",
    type: "text",
    placeholder: "Lagos",
  },
  {
    id: "price",
    label: "Price",
    min:1,
    type: "number",
    placeholder: "1000",
  },
  {
    id: "rating",
    label: "Rating",
    type: "number",
    min: 1,
    max: 5,
    placeholder: "5",
  },
  {
    id: "description",
    label: "Description",
    type: "text",
    placeholder: "A beautiful hotel",
  },
  {
    id: "city",
    label: "City",
    type: "text",
    placeholder: "Brussels",
  },
  {
    id: "country",
    label: "Country",
    type: "text",
    placeholder: "Belgium",
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    placeholder: "Rue de la Loi, 125",
  },
];

export const roomInputs = [
  // {
  //   id: "roomType",
  //   label: "Room Type",
  //   type: "text",
  //   placeholder: "Single",
  // },
  {
    id: "description",
    label: "Description",
    type: "text",
    placeholder: "A beautiful room",
  },
  {
    id: "price",
    label: "Price",
    type: "number",
    min: 1,
    placeholder: "100",
  },
  {
    id: "people",
    label: "Max People",
    type: "number",
    min: 1,
    placeholder: "1",
  },
];
