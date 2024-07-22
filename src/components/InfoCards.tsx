import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Label from "./Label";
import styled from "styled-components";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Button from "./Button";

type Props = {
  icon: IconProp;
  placeholder: string;
  color: string;
  data: number;
  onClick: () => void;
};

function InfoCards({ icon, placeholder, color, data, onClick }: Props) {
  return (
    <InfoCardsCon>
      <div style={{ display: "flex", alignItems: "end", gap: "1rem" }}>
        <IconCon>
          <FontAwesomeIcon icon={icon} color={color} />
        </IconCon>
        <Label font={"sm"} weight={"b"} content={placeholder} />
      </div>
      <Label
        font="xsm"
        weight="n"
        content={`you have ${data} ${placeholder}`}
      />
      <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
        <Button
          sx={{
            padding: "0.4rem 0.5rem",
            fontSize: "0.8rem",
            gap: "0.5rem",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
          }}
          onClick={onClick}
          placeholder="Open"
          icon={
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              style={{ fontSize: ".5rem" }}
            />
          }
        />
      </div>
    </InfoCardsCon>
  );
}

const IconCon = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: ${(p) => p.theme.colors.base300};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InfoCardsCon = styled.div`
  width: 15%;
  height: 60%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-left: 3rem;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  align-items: start;
  background-color: ${(p) => p.theme.colors.base100};
  gap: 1rem;
`;

export default InfoCards;
