import React, { ChangeEvent, forwardRef, useImperativeHandle, useRef, useState } from 'react';

interface LimitedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    maxChars: number;
}

interface LimitedInputHandle {
    validInput: boolean;
    focusInput: () => void;
}

export interface LimitedInputElement extends HTMLInputElement {
    validInput: boolean;
}

const LimitedInput = forwardRef<LimitedInputHandle, LimitedInputProps>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null); // Ref passed from DOM

    // Ensure remainingChars is initialized based on maxChars
    const [remainingChars, setRemainingChars] = useState(props.maxChars);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) { // Percolate super onChange
            props.onChange(e);
        }

        // Update remaining characters based on input length
        setRemainingChars(props.maxChars - e.target.value.length);
    };

    useImperativeHandle(ref, () => ({
        // Custom properties or methods
        validInput: remainingChars >= 0,
        focusInput: () => inputRef.current?.focus(), // A custom method to focus the input
    }));

    return (
        <div className="flex flex-row items-center justify-center">
            <input
                {...props}
                ref={inputRef} // Attach the ref to the input element
                maxLength={props.maxChars} // Ensure maxLength is set on the input element
                onChange={handleChange}
            />
            {/* Display remaining characters */}
            <p
                className={`w-0 ${remainingChars <= 0 ? 'text-red-500' : 'text-white'} ${remainingChars === 50 && 'hidden'}`}
            >
                {remainingChars}/{props.maxChars}
            </p>
        </div>
    );
});

// Set displayName for better debugging
LimitedInput.displayName = 'LimitedInput';

export default LimitedInput;
