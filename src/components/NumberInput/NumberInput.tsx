import NumberFormat from "react-number-format";
import Form from "react-bootstrap/Form";

type NumberInputProps = {
  name: string;
  value: number;
  dispatch: (action: any) => void;
  precision?: number;
};

function NumberInput({ name, value, dispatch, precision }: NumberInputProps) {
  return (
    <NumberFormat
      customInput={Form.Control}
      value={value}
      thousandSeparator={true}
      decimalScale={precision || 0}
      allowNegative={false}
      type="tel"
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
