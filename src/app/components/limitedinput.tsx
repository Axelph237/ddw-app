import React, { ChangeEvent, ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react';

// Custom props for LimitedInput element
interface LimitedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    maxChars: number;
}

// Custom handler for LimitedInput element
export interface LimitedInputHandle {
    validInput: boolean;
    focusInput: () => void;
    value: string;
    focus: () => void;
}

const LimitedInput = forwardRef<LimitedInputHandle, LimitedInputProps>(({maxChars, ...props}, ref: ForwardedRef<LimitedInputHandle>) => {
    const inputRef = useRef<HTMLInputElement>(null); // Ref to the input element

    const [remainingChars, setRemainingChars] = useState(maxChars);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) { // Call any parent-provided onChange handler
            props.onChange(e);
        }

        // Update the remaining characters
        setRemainingChars(maxChars - e.target.value.length);
    };

    // Use useImperativeHandle to expose custom properties and methods
    useImperativeHandle(ref, () => ({
        validInput: remainingChars >= 0,  // Custom validation property
        focusInput: () => inputRef.current?.focus(),  // Custom focus method
        value: inputRef.current?.value || '',  // Explicitly return the value of the input
        focus: () => inputRef.current?.focus(),  // Explicitly return the focus method
    }));

    return (
        <div className="flex flex-row items-center justify-center">
            <input
                {...props}
                ref={inputRef}
                // maxLength={maxChars} // More fun w/o it being enforced.
                onChange={handleChange}
            />
            {/* Display the remaining characters */}
            <p
                className={`w-0 ${remainingChars <= 0 ? 'text-red-500' : 'text-white'} ${remainingChars === 50 && 'hidden'}`}
            >
                {remainingChars}/{maxChars}
            </p>
        </div>
    );
});

// Set displayName for better debugging
LimitedInput.displayName = 'LimitedInput';

export default LimitedInput;
