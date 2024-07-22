import { faArrowLeft, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Label from "../components/Label";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Docs from "../components/Docs";
import Spacer from "../components/Spacer";
import styled from "styled-components";
import { hideScrollbarStyles } from "./Dashboard";
import Button from "../components/Button";
import AddFileModal from "../components/AddFileModal";
import Notifications from "../components/Notifications";
import DeleteModal from "../components/DeleteModal";
import { DocsType } from "../types";

type Card = {
  msg: string;
  type: "error" | "success";
  id: number;
};

type State = {
  modal: boolean;
  cards: Card[];
  deleteData: { type: "file" | "folder"; id: string };
  modalType: "AddFile" | "Delete";
};

function Folder() {
  const [state, setState] = useState<State>({
    modal: false,
    cards: [],
    deleteData: { type: "file", id: "" },
    modalType: "AddFile",
  });

  const { folderid } = useParams();

  const mode = useSelector((state: any) => state.mode);
  const docs = useSelector((state: any) => state.docs);

  const folders = docs.filter((d: DocsType) => d.type === "folder");

  const folderName = folders.find((d: any) => d.folder._id === folderid).folder
    .name;

  const files = folders
    .find((d: any) => d.folder._id === folderid)
    .folder.files.map((d: DocsType) => ({
      type: "file",
      file: d,
    }));

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const openModal = (type: string) => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.set("modal", type);

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const closeModal = () => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete("modal");

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  useEffect(() => {
    if (params.get("modal") === "addfile") {
      setState((prev) => ({ ...prev, modal: true, modalType: "AddFile" }));
    } else if (params.get("modal") === "delete") {
      setState((prev) => ({ ...prev, modal: true, modalType: "Delete" }));
    } else {
      setState((prev) => ({ ...prev, modal: false }));
    }
  }, [location.search]);

  const addNotification = (msg: string, type: "error" | "success") => {
    const id = new Date().getTime();
    setState((prev) => ({
      ...prev,
      cards: [...prev.cards, { id, msg, type }],
    }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        cards: prev.cards.filter((card) => card.id !== id),
      }));
    }, 10000);
  };

  const removeNotification = (id: number) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== id),
    }));
  };

  const onDelete = (type: "file" | "folder", id: string) => {
    setState((prev) => ({ ...prev, deleteData: { type, id } }));
    openModal("delete");
  };

  return (
    <React.Fragment>
      <FolderCon>
        <div
          style={{
            width: "100%",
            height: "10%",
            display: "flex",
            alignItems: "end",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "5%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon
              onClick={() => navigate("/dashboard/folder")}
              icon={faArrowLeft}
              style={{
                cursor: "pointer",
                color: mode === "light" ? "black" : "white",
              }}
            />
          </div>
          <FontAwesomeIcon icon={faFolder} size="3x" color="#FDDA0D" />
          <Label
            sx={{ fontSize: "1.5rem" }}
            font={"md"}
            weight={"b"}
            content={folderName}
          />
          <div style={{ display: "flex", flex: 1, justifyContent: "end" }}>
            <Button
              sx={{ padding: "0.5rem 1rem", marginRight: "6%" }}
              placeholder="Add File"
              onClick={() => openModal("addfile")}
            />
          </div>
        </div>
        <Spacer type={"vertical"} value={"3%"} />
        <div
          style={{
            width: "100%",
            height: "6%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TableHeader>
            <Label
              sx={{ marginLeft: "5.5%" }}
              font={"sm"}
              weight={"b"}
              content={"Name"}
            />
            <Label
              sx={{ marginLeft: "40%" }}
              font={"sm"}
              weight={"b"}
              content={"items"}
            />
            <Label
              sx={{ marginLeft: "10%" }}
              font={"sm"}
              weight={"b"}
              content={"Created at"}
            />
            <Label
              sx={{ marginLeft: "10%" }}
              font={"sm"}
              weight={"b"}
              content={"Last modified at"}
            />
          </TableHeader>
        </div>
        <Spacer type={"vertical"} value={"1%"} />
        <DocsCon>
          {files.map((item: DocsType, index: number) => (
            <Docs
              onDelete={onDelete}
              data={item}
              key={`${index}${item.type}`}
            />
          ))}
        </DocsCon>
      </FolderCon>
      {state.modal &&
        (state.modalType === "AddFile" ? (
          <AddFileModal
            folderId={folderid}
            addNotification={addNotification}
            closeModal={closeModal}
          />
        ) : (
          <DeleteModal
            addNotification={addNotification}
            closeModal={closeModal}
            data={state.deleteData}
          />
        ))}
      <Notifications cards={state.cards} removeCard={removeNotification} />
    </React.Fragment>
  );
}

const FolderCon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DocsCon = styled.div`
  width: 100%;
  height: 78%;
  display: flex;
  flex-direction: column;
  overflow: none;
  overflow-y: scroll;
  ${hideScrollbarStyles};
  align-items: center;
`;

const TableHeader = styled.div`
  width: 90%;
  height: 100%;
  background-color: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  background-color: ${(p) => p.theme.colors.base100};
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
`;

export default Folder;
