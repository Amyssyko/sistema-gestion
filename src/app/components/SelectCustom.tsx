import React, { useState, useEffect } from "react"
import axios from "axios"

interface SelectProps {
	value: string
	onChange: (value: string) => void
}

interface Option {
	placa: string
}

const SelectCustom: React.FC<SelectProps> = ({ value, onChange }) => {
	const [options, setOptions] = useState<Option[]>([])

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = event.target.value
		onChange(selectedValue)
	}

	return (
		<select value={value} onChange={handleSelectChange}>
			{options.map((option) => (
				<option key={option.dni} value={option.dni}>
					{option.nombre} {option.apellido}
				</option>
			))}
		</select>
	)
}

export default SelectCustom
