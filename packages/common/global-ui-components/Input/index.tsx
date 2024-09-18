/* eslint-disable react/jsx-props-no-spreading */

import { Input as AntDInput, InputProps } from 'antd';

interface IInputProps extends InputProps {
	className?: string;
}

const Input = ({ className, ...props }: IInputProps) => {
	return (
		<AntDInput
			{...props}
			className='text-sm font-normal m-0 leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white'
		/>
	);
};

export default Input;
