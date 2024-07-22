import InputField from "./InputField";
import styled from "styled-components";

type Props = {
  data: string;
  header: boolean;
  edit: boolean;
  onChange: (e: string) => void;
  id?: string;
};

function Cells({ data, header, edit, onChange, id }: Props) {
  return (
    <Cell>
      <InputField
        id={id}
        sx={{ pointerEvents: `${edit ? "auto" : "none"}`, boxShadow: "none" }}
        height={header ? "80%" : "40px"}
        width="10rem"
        placeholder={""}
        type={"text"}
        value={data}
        onChange={(e) => onChange(e)}
      />
    </Cell>
  );
}

const Cell = styled.div`
  height: 100%;
  padding: 0rem 0.5rem;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => p.theme.colors.base300};
`;

export default Cells;
