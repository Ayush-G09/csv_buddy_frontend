import React, { useState } from "react";
import styled, { CSSProperties } from "styled-components";

type Props = {
  placeholder: string;
  type: "text" | "password" | "email" | "date" | "file";
  width?: string;
  height?: string;
  value: string;
  onChange: (value: string) => void;
  ierror?: boolean;
  sx?: CSSProperties;
};

type State = {
  inputType: "text" | "password" | "email" | "date" | "file";
};

function InputField({
  placeholder,
  type,
  width,
  height,
  value,
  onChange,
  ierror = false,
  sx,
}: Props) {
  const [state, setState] = useState<State>({
    inputType: type === "date" ? "text" : type,
  });

  const handleFocus = () => {
    if (type === "date") {
      setState((prev) => ({ ...prev, inputType: "date" }));
    }
  };

  return (
        <Field
          width={width}
          height={height}
          id={placeholder}
          placeholder={placeholder}
          type={state.inputType}
          onFocus={handleFocus}
          value={value}
          onChange={(e) => onChange!(e.target.value)}
          ierror={ierror}
          autoComplete="off"
          style={sx}
        />
  );
}

const Field = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== "ierror",
})<{ width?: string; height?: string; ierror: boolean }>`
  outline: none;
  width: ${(p) => (p.width ? p.width : "50%")};
  height: ${(p) => (p.height ? p.height : "45px")};
  border-radius: 10px;
  border: none;
  background-color: ${(p) => p.theme.colors.base300};
  padding-left: 10px;
  padding-right: 10px;
  font-size: ${(p) => p.theme.fontSize.small};
  box-shadow: 0px 0px 5px 0px
    ${(p) => (p.ierror ? "red" : "rgba(0, 0, 0, 0.1)")};
  color: ${(p) => p.theme.colors.font100};
  transition: 0.3s, transform 0.1s;
`;

export default InputField;
