import React from "react"

interface ErrorState {
	message: string
}

const useError = () => {
	const [myError, setError] = React.useState<ErrorState | null>(null)

	const handleError = (errorMessage: string) => {
		setError({ message: errorMessage })
	}

	const resetError = () => {
		setError(null)
	}

	const isErrored = myError !== null

	return { myError, isErrored, handleError, resetError }
}

export { useError }
