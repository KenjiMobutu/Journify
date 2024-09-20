export const selectChat = (chat) => ({
  type: "SELECT_CHAT",
  payload: chat,
});

const selectedChatReducer = (state = null, action) => {
  switch (action.type) {
    case "SELECT_CHAT":
      return action.payload;
    default:
      return state;
  }
};

export default selectedChatReducer;
