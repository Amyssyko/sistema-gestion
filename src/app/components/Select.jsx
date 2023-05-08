//"use client"
import Select from "react-select"

const CustomSelect = ({ id, label, name, options, onChange, value, placeholder, isMulti }) => {
	return (
		<fieldset>
			<label className="block mb-2 text-sm font-medium text-gray-950  dark:text-white" htmlFor={id}>
				{label}
			</label>
			<Select
				className="border text-sm rounded-lg block w-full p-2.5 bg-white/5  border-gray-600 placeholder-gray-400 text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
				id={id}
				name={name}
				options={options}
				onChange={onChange}
				value={value}
				placeholder={placeholder}
				isMulti={isMulti}
			/>
		</fieldset>
	)
}

export default CustomSelect
