const TextArea = ({ id, name, label, type, placeholder, rows, cols, ...props }) => {
	return (
		<fieldset>
			<label className="block mb-2 text-sm font-medium text-gray-950  dark:text-white" htmlFor={id}>
				{label}
			</label>
			<textarea
				className="border text-sm rounded-lg block w-full p-2.5 bg-white/5 border-gray-600 placeholder-gray-600 text-black dark:text-white"
				type={type}
				id={id}
				name={name}
				placeholder={placeholder}
				rows={rows}
				cols={cols}
				//required
				{...props}
			/>
		</fieldset>
	)
}

export default TextArea
