import NumberFormat from "react-number-format";

type NumberTextProps = {
  value: number;
  precision?: number;
};

function NumberText({ value, precision }: NumberTextProps) {
  return (
    <NumberFormat
      value={value}
      thousandSeparator={true}
      displayType="text"
      decimalScale={precision || 0}
    />
  );
}
export default NumberText;
