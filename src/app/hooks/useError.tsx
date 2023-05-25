import { useState } from "react"

interface ErrorState {
	message: string
}

export const useError = () => {
	const [error, setError] = useState<ErrorState | null>(null)

	const handleError = (errorMessage: string) => {
		setError({ message: errorMessage })
	}

	const handleNotError = () => {
		setError(null)
	}

	const isErrored = error !== null

	return { error, isErrored, handleError, handleNotError }
}

export default useError // Agregar esta línea para exportar el custom hook por defecto
