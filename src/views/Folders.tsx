import React, { useEffect, useState } from "react";
import Label from "../components/Label";
import styled from "styled-components";
import { hideScrollbarStyles } from "./Dashboard";
import Spacer from "../components/Spacer";
import { useSelector } from "react-redux";
import Docs from "../components/Docs";
import Button from "../components/Button";
import CreateFolderModal from "../components/CreateFolderModal";
import { useLocation, useNavigate } from "react-router-dom";
import Notifications from "../components/Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
  modalType: "CreateFolder" | "Delete";
};

function Folders() {
  const [state, setState] = useState<State>({
    modal: false,
    cards: [],
    deleteData: { type: "file", id: "" },
    modalType: "CreateFolder",
  });

  const docs = useSelector((state: any) => state.docs);
  const mode = useSelector((state: any) => state.mode);

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
    if (params.get("modal") === "createfolder") {
      setState((prev) => ({ ...prev, modal: true }));
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
      <FoldersCon>
        <div
          style={{
            width: "95%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "1rem 0rem",
          }}
        >
          <div style={{ width: "100%", height: "7%", display: "flex" }}>
            <div
              style={{
                width: "5%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <FontAwesomeIcon
                onClick={() => navigate("/dashboard")}
                icon={faArrowLeft}
                style={{
                  cursor: "pointer",
                  color: mode === "light" ? "black" : "white",
                }}
              />
            </div>
            <div
              style={{
                width: "95%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Label
                sx={{ fontSize: "1.5rem" }}
                font={"md"}
                weight={"n"}
                content={"My Folders"}
              />
              <Button
                sx={{ padding: "0.5rem 1rem", marginRight: "5%" }}
                placeholder="Create Folder"
                onClick={() => openModal("createfolder")}
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
            {docs
              .filter((d: DocsType) => d.type === "folder")
              .map((item: DocsType, index: number) => (
                <Docs
                  onDelete={onDelete}
                  data={item}
                  key={`${index}${item.type}`}
                />
              ))}
          </DocsCon>
        </div>
      </FoldersCon>
      {state.modal &&
        (state.modalType === "CreateFolder" ? (
          <CreateFolderModal
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

const FoldersCon = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
align-items: center'
`;

const DocsCon = styled.div`
  width: 100%;
  height: 77%;
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

export default Folders;
