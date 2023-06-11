//"use client"
import Select from "react-select"

const CustomSelect = ({ id, label, name, options, onChange, value, placeholder, isMulti }) => {
	return (
		<fieldset>
			<label
				className="block  placeholder-gray-900 border bg-white dark:bg-black text-gray-950 dark:text-white border-gray-600   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-900 dark:focus:border-blue-900  "
				htmlFor={id}
			>
				{label}

				<Select
					className="dark:bg-black  dark:text-white hover:bg-white hover:text-black"
					id={id}
					name={name}
					options={options}
					onChange={onChange}
					value={value}
					placeholder={placeholder}
					isMulti={isMulti}
				/>
			</label>
		</fieldset>
	)
}

export default CustomSelect
