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
	ref?: React.MutableRefObject<HTMLInputElement>
	step?: string
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
	step,
	ref,
	onChange,
	...props
}: DataInput) => {
	return (
		<fieldset>
			<label className="block mb-2 text-sm font-medium text-gray-950  dark:text-white" htmlFor={id}>
				{label}
			</label>
			<input
				className="block  bg-white/5  placeholder-gray-400 border  text-gray-950 dark:text-white border-gray-600   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5 dark:bg-gray-90 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-900 dark:focus:border-blue-900  "
				type={type}
				id={id}
				name={name}
				placeholder={placeholder}
				onChange={onChange}
				value={value}
				minLength={minLength}
				maxLength={maxLength}
				ref={ref}
				step={step}
				//required
				{...props}
				//required
			/>
		</fieldset>
	)
}

export default Input
