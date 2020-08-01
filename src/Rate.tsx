import React, { useState } from "react";
import { FieldProps } from "formik";
import { Field } from "formik-antd";

export interface IRateCharacterProps {
  focused: boolean;
  index: number;
  onClick: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
}
export const RateCharacter = (props: IRateCharacterProps) => {
  const { index, onClick, focused } = props;
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick(e, index);
  };

  let className = "rate-character";
  if (focused) {
    className += " rate-character-focus";
  }
  return (
    <div className={className} onClick={handleClick}>
      {index + 1}
    </div>
  );
};

export interface IRateProps {
  defaultValue?: number;
  value?: number;
  count: number;
  onChange?: (value: number) => void;
}
export const Rate = (props: IRateProps) => {
  const { defaultValue, value: inputValue, count, onChange } = props;
  const [value, setValue] = useState(inputValue || defaultValue || 0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    setValue(index + 1);
    onChange && onChange(index + 1);
  };

  const renderCharacter = () => {
    const characters = [];
    for (let i = 0; i < count; i++) {
      characters.push(
        RateCharacter({
          focused: i + 1 === value,
          index: i,
          onClick: handleClick,
        })
      );
    }
    return characters;
  };

  return (
    <div className="rate">
      <div className="rate-character-container">{renderCharacter()}</div>
      <div className="rate-footer-container">
        <div>Not at all likely</div>
        <div>Extremely likely</div>
      </div>
    </div>
  );
};

interface FormikFieldProps {
  name: string;
  validate?: (value: any) => undefined | string | Promise<any>;
  fast?: boolean;
}

export type FormRateProps = FormikFieldProps & IRateProps;

/**
 * Bind Rate component to formik state
 */
export const FormRate = ({
  name,
  validate,
  fast,
  onChange,
  ...restProps
}: FormRateProps) => (
  <Field name={name} validate={validate} fast={fast}>
    {({
      field: { value },
      form: { setFieldValue, setFieldTouched },
    }: FieldProps) => (
      <Rate
        value={value}
        onChange={(value) => {
          setFieldValue(name, value != null ? value.valueOf() : value);
          setFieldTouched(name, true);
          onChange && onChange(value);
        }}
        {...restProps}
      />
    )}
  </Field>
);
