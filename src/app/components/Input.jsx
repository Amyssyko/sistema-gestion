const Input = ({ id, name, label, type, placeholder, onChange, ...props }) => {
	return (
		<fieldset>
			<label className="block mb-2 text-sm font-medium text-gray-950  dark:text-white" htmlFor={id}>
				{label}
			</label>
			<input
				className="border text-sm rounded-lg block w-full p-2.5 bg-white/5 border-gray-600 placeholder-gray-500 text-gray-950 dark:text-white"
				type={type}
				id={id}
				name={name}
				placeholder={placeholder}
				onChange={onChange}
				{...props}
				//required
			/>
		</fieldset>
	)
}

export default Input
