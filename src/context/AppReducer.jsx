const AppReducer = (state, action) => {
	if (action.type === "ADD_TRANSACTION") {
		return {
			...state,
			transactions: [action.payload, ...state.transactions],
		}
	}
	if (action.type === "DELETE_TRANSACTION") {
		return {
			...state,
			transactions: state.transactions.filter((transaction) => transaction.id !== action.payload),
		}
	}
	return state
}

export default AppReducer
