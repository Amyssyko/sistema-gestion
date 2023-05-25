interface DataInput {
	id: string
	type: string
	name: string
	minLength?: number
	maxLength?: number
	label: string
	placeholder?: string
	value?: string
	defaultValue?: string
	onChange?: React.ChangeEventHandler<HTMLInputElement>
	props?: string
}

const Input = ({
	id,
	name,
	label,
	type,
	placeholder,
	value,
	minLength,
	maxLength,
	defaultValue,
	onChange,
	...props
}: DataInput) => {
	return (
		<fieldset>
			<label className="block mb-2 text-sm font-medium text-gray-950 dark:text-gray-950" htmlFor={id}>
				{label}
			</label>
			<input
				className="border text-sm rounded-lg block w-full p-2.5 bg-white/5 border-gray-600 placeholder-gray-500 text-gray-950 dark:text-black"
				type={type}
				id={id}
				name={name}
				placeholder={placeholder}
				onChange={onChange}
				value={value}
				minLength={minLength}
				maxLength={maxLength}
				//required
				{...props}
				//required
			/>
		</fieldset>
	)
}

export default Input
