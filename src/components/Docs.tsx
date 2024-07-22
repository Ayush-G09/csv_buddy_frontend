import {
  faArrowRight,
  faFile,
  faFolder,
  faTrash,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Label from "./Label";
import { formatDateString } from "../utils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DocsType } from "../types";

type Props = {
  data: DocsType;
  onDelete: (type: "file" | "folder", id: string) => void;
};

function Docs({ data, onDelete }: Props) {
  const navigate = useNavigate();

  const mode = useSelector((state: any) => state.mode);

  const navigateString =
    data.type === "file"
      ? `/dashboard/file/${data.file._id}`
      : `/dashboard/folder/${data.folder._id}`;

  return (
    <DocsCon>
      <div
        style={{
          width: "0.5%",
          height: "100%",
          backgroundColor: data.type === "file" ? "#4CBB17" : "#FDDA0D",
        }}
      />
      <IconCon>
        <FontAwesomeIcon
          icon={data.type === "file" ? faFile : faFolder}
          color={data.type === "file" ? "#4CBB17" : "#FDDA0D"}
        />
      </IconCon>
      <div
        style={{
          width: "42%",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Label
          font={"sm"}
          weight={"t"}
          content={data.type === "file" ? data.file.name : data.folder.name}
        />
        {data.type === "file" && data.from && (
          <FontAwesomeIcon
            style={{ marginLeft: "1rem" }}
            icon={faArrowRight}
            color={mode === "light" ? "black" : "white"}
          />
        )}
        {data.type === "file" && data.from && (
          <FontAwesomeIcon
            style={{ marginLeft: "1rem" }}
            icon={faFolder}
            color="#FDDA0D"
          />
        )}
        {data.type === "file" && data.from && (
          <Label
            sx={{ marginLeft: "0.5rem", color: "lightgrey" }}
            font={"xsm"}
            weight={"t"}
            content={data.from}
          />
        )}
      </div>
      <Label
        sx={{ width: "12%" }}
        font={"sm"}
        weight={"t"}
        content={
          data.type === "file"
            ? "1 item"
            : `${data.folder.files.length} ${
                data.folder.files.length > 1 ? "items" : "item"
              }`
        }
      />
      <Label
        sx={{ width: "14.5%" }}
        font={"sm"}
        weight={"t"}
        content={
          data.type === "file"
            ? formatDateString(data.file.addedOn)
            : formatDateString(data.folder.addedOn)
        }
      />
      <Label
        sx={{ width: "13%" }}
        font={"sm"}
        weight={"t"}
        content={
          data.type === "file"
            ? formatDateString(data.file.updatedOn)
            : formatDateString(data.folder.updatedOn)
        }
      />
      <div
        style={{
          height: "100%",
          width: "7.5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <IconCon
          style={{ cursor: "pointer" }}
          onClick={() => navigate(navigateString)}
        >
          <FontAwesomeIcon
            icon={faUpRightFromSquare}
            style={{ fontSize: "0.8rem" }}
            color="#0096FF"
          />
        </IconCon>
        <IconCon
          style={{ cursor: "pointer" }}
          onClick={() =>
            onDelete(
              data.type,
              data.type === "file" ? data.file._id : data.folder._id
            )
          }
        >
          <FontAwesomeIcon
            icon={faTrash}
            style={{ fontSize: "0.8rem" }}
            color="red"
          />
        </IconCon>
      </div>
    </DocsCon>
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

const DocsCon = styled.div`
  width: 90%;
  min-height: 50px;
  background-color: ${(p) => p.theme.colors.base100};
  margin-top: 1rem;
  border-radius: 5px;
  display: flex;
  overflow: hidden;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  gap: 1rem;
  align-items: center;
`;

export default Docs;
