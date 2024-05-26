"use client"

import { useEffect, useState } from "react";

const size_options = [
    { value: 'baby', label: 'Baby (5 vs 5)' },
    { value: 'medium', label: 'Seven (7 vs 7)' },
    { value: 'big', label: 'Big (9 vs 9)' },
    { value: 'full', label: 'Full (11 vs 11)' },
];

const grass_options = [
    { value: 'natural', label: 'Natural' },
    { value: 'sintetic', label: 'Sintetic' },
];

interface Field {
    field_number: number;
    size: string;
    field_type: string;
}

interface FieldsDetailsProps {
    number_of_fields: number;
    setFields: React.Dispatch<React.SetStateAction<Field[]>>;
}

const FieldsDetails: React.FC<FieldsDetailsProps> = ({number_of_fields, setFields}) => {
    const [localFields, setLocalFields] = useState<Field[]>(() => {
        return Array.from({ length: number_of_fields }).map((_, index) => ({
          field_number: index + 1,
          size: size_options[0].value,
          field_type: grass_options[0].value,
        }));
    });

    const handleFieldChange = (index: number, field: Partial<Field>) => {
        const newFields = [...localFields];
        newFields[index] = { ...newFields[index], ...field };
        setLocalFields(newFields);
    };

    useEffect(() => {
        if (number_of_fields > localFields.length) {
          const newFields = [
            ...localFields,
            ...Array.from({ length: number_of_fields - localFields.length }).map((_, index) => ({
              field_number: localFields.length + index + 1,
              size: size_options[0].value,
              field_type: grass_options[0].value,
            })),
          ];
          setLocalFields(newFields);
        } else if (number_of_fields < localFields.length) {
          setLocalFields(localFields.slice(0, number_of_fields));
        }
    }, [number_of_fields]);

    useEffect(() => {
        setFields(localFields)
    }, [localFields, setFields])
    
    return (
        <div className="flex flex-col w-full space-y-5">
            {Array.from({ length: number_of_fields }).map((_, index) => (
                <div key={index} className='flex space-x-2'>
                    <label className='flex flex-col w-1/3'>
                        <h3>Field Number</h3>
                        <input 
                            type="number" 
                            value={localFields[index]?.field_number || ''} 
                            onChange={(e) => handleFieldChange(index, { field_number: Number(e.target.value) })}
                            className='rounded-md w-full border-2'
                            min={1}
                            max={100}
                        />
                    </label>
                    <label className='flex flex-col w-1/3'>
                        <h3>Size</h3>
                        <select 
                            value={localFields[index]?.size} 
                            onChange={(e) => handleFieldChange(index, { size: String(e.target.value) })} 
                            className="rounded-md w-full border-2"
                        >
                            {size_options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col w-1/3">
                        <h3>Grass Type</h3>
                        <select 
                            value={localFields[index]?.field_type} 
                            onChange={(e) => handleFieldChange(index, { field_type: String(e.target.value) })} 
                            className="rounded-md w-full border-2"
                        >
                            {grass_options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            ))}
        </div>
    )
}

export default FieldsDetails;