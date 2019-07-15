import React from "react";
import NumberFormat from "react-number-format";

type NumberInputProps = {
  name: string;
  value: number;
  dispatch: (action: any) => void;
  precision?: number;
};

function NumberInput({ name, value, dispatch, precision }: NumberInputProps) {
  return (
    <NumberFormat
      className="form-control"
      value={value}
      thousandSeparator={true}
      decimalScale={precision || 0}
      allowNegative={false}
      type={"tel"}
      onValueChange={values => {
        dispatch({
          type: "setProperty",
          payload: { name: name, value: +values.value }
        });
      }}
    />
  );
}

export default NumberInput;
