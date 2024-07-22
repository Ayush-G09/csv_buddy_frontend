import { ChangeEvent, useEffect, useRef } from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import Label from "./Label";
import { truncateString } from "../utils";
import Papa from "papaparse";

type Props = {
  addNotification: (msg: string, type: "error" | "success") => void;
  setFile: (file: File | null) => void;
  setData: (data: any[]) => void;
  file: File | null;
};

function FileInput({ addNotification, setFile, setData, file }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const allowedTypes = ["text/csv"];

      if (allowedTypes.includes(file.type)) {
        setFile(file);
      } else {
        addNotification!("Please select a valid file type (CSV).", "error");
        setFile(null);
      }
    }
  };

  const readFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (text: string) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results: { data: any }) => {
        setData(results.data);
      },
    });
  };

  useEffect(() => {
    readFile();
  }, [file]);

  return (
    <Button
      sx={{ padding: "0.7rem 0.8rem" }}
      onClick={handleClick}
      icon={<FontAwesomeIcon icon={faPaperclip} />}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Label
        sx={{ color: "white" }}
        font="xsm"
        weight="b"
        content={file ? truncateString(file.name) : "Click here"}
      />
    </Button>
  );
}

export default FileInput;
