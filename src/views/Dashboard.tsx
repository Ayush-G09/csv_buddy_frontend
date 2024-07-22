import React, { useEffect, useState } from "react";
import InfoCards from "../components/InfoCards";
import styled, { css } from "styled-components";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import Label from "../components/Label";
import Button from "../components/Button";
import Docs from "../components/Docs";
import { useLocation, useNavigate } from "react-router-dom";
import Notifications from "../components/Notifications";
import AddFileModal from "../components/AddFileModal";
import CreateFolderModal from "../components/CreateFolderModal";
import axiosInstance from "../config/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setDocs, setIsUserLoggedIn } from "../store/action";
import DeleteModal from "../components/DeleteModal";
import { DocsType } from "../types";

type Card = {
  msg: string;
  type: "error" | "success";
  id: number;
};

type State = {
  modal: boolean;
  modalType: "AddFile" | "CreateFolder" | "Delete";
  cards: Card[];
  deleteData: { type: "file" | "folder"; id: string };
};

function Dashboard() {
  const [state, setState] = useState<State>({
    modal: false,
    modalType: "AddFile",
    cards: [],
    deleteData: { type: "file", id: "" },
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const docs = useSelector((state: any) => state.docs);
  const params = new URLSearchParams(location.search);
  const token = localStorage.getItem("authToken");

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

  useEffect(() => {
    if (params.get("modal") === "addfile") {
      setState((prev) => ({ ...prev, modal: true, modalType: "AddFile" }));
    } else if (params.get("modal") === "createfolder") {
      setState((prev) => ({ ...prev, modal: true, modalType: "CreateFolder" }));
    } else if (params.get("modal") === "delete") {
      setState((prev) => ({ ...prev, modal: true, modalType: "Delete" }));
    } else {
      setState((prev) => ({ ...prev, modal: false }));
    }
  }, [location.search]);

  const fetchDocs = async () => {
    try {
      const res = await axiosInstance.get("/docs", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      dispatch(setDocs(res.data.docs));
    } catch (err: any) {
      if (err.response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("name");
        dispatch(setIsUserLoggedIn(false));
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const countFilesInFolders = () => {
    return docs.reduce((acc: any, doc: any) => {
      if (doc.type === "folder" && doc.folder) {
        acc += doc.folder.files.length;
      }
      return acc;
    }, 0);
  };

  const topLevelFileCount = docs.filter((d: any) => d.type === "file").length;

  const folderFileCount = countFilesInFolders();

  const totalFileCount = topLevelFileCount + folderFileCount;

  const onDelete = (type: "file" | "folder", id: string) => {
    setState((prev) => ({ ...prev, deleteData: { type, id } }));
    openModal("delete");
  };

  return (
    <React.Fragment>
      <DashboardCon>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            height: "27%",
          }}
        >
          <InfoCards
            onClick={() => navigate("/dashboard/folder")}
            data={docs.filter((d: any) => d.type === "folder").length}
            icon={faFolder}
            placeholder={"Folder"}
            color="#FDDA0D"
          />
          <InfoCards
            onClick={() => navigate("/dashboard/file")}
            data={totalFileCount}
            icon={faFile}
            placeholder={"File"}
            color="#4CBB17"
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "7%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Label
            sx={{ fontSize: "1.5rem", marginLeft: "3rem" }}
            font={"md"}
            weight={"b"}
            content={"My Docs"}
          />
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flex: 1,
              alignItems: "center",
              justifyContent: "end",
              paddingRight: "3rem",
            }}
          >
            <Button
              sx={{
                padding: "0.5rem 0.7rem",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
              }}
              placeholder={"Create Folder"}
              onClick={() => openModal("createfolder")}
            />
            <Button
              sx={{
                padding: "0.5rem 0.7rem",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
              }}
              placeholder={"Add File"}
              onClick={() => openModal("addfile")}
            />
          </div>
        </div>
        <div
          style={{
            width: "100%",
            marginTop: "1%",
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
        <DocsCon>
          {docs.map((item: DocsType, index: number) => (
            <Docs
              onDelete={onDelete}
              data={item}
              key={`${index}${item.type}`}
            />
          ))}
        </DocsCon>
        {state.modal &&
          (state.modalType === "AddFile" ? (
            <AddFileModal
              addNotification={addNotification}
              closeModal={closeModal}
            />
          ) : state.modalType === "CreateFolder" ? (
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
      </DashboardCon>
      <Notifications cards={state.cards} removeCard={removeNotification} />
    </React.Fragment>
  );
}

export const hideScrollbarStyles = css`
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
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

const DocsCon = styled.div`
  width: 100%;
  height: 62%;
  display: flex;
  flex-direction: column;
  overflow: none;
  overflow-y: scroll;
  ${hideScrollbarStyles};
  align-items: center;
`;

const DashboardCon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default Dashboard;
