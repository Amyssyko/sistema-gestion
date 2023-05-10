//"use client"
import Select from "react-select"

const CustomSelect = ({ id, label, name, options, onChange, value, placeholder, isMulti }) => {
	return (
		<fieldset>
			<label className="block mb-2 text-sm font-medium text-gray-950  dark:text-white" htmlFor={id}>
				{label}
			</label>
			<Select
				className="block  bg-white/5  placeholder-gray-400 border  text-gray-950 dark:text-white border-gray-600   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5 dark:bg-gray-90 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-900 dark:focus:border-blue-900  "
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
