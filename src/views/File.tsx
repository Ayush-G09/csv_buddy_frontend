import {
  faArrowLeft,
  faCircleChevronLeft,
  faCircleChevronRight,
  faCircleDot,
  faDownload,
  faFile,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import Label from "../components/Label";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spacer from "../components/Spacer";
import Cells from "../components/Cells";
import Button from "../components/Button";
import styled, { css } from "styled-components";
import Modal from "../components/Modal";
import isEqual from "lodash/isEqual";
import axiosInstance from "../config/axiosConfig";
import { setDocs, setIsUserLoggedIn } from "../store/action";
import CsvDownload from "react-csv-downloader";
import { DocsType, FileType, FolderType } from "../types";

type State = {
  edit: boolean;
  page: number;
  totalPage: number;
  tableData: { [key: string]: string }[];
  modal: boolean;
  deleteIndex: number;
  fileData: { [key: string]: string }[];
  changes: boolean;
  focusedIndex: number;
};

function File() {
  const { fileId } = useParams();

  const mode = useSelector((state: any) => state.mode);
  const docs = useSelector((state: any) => state.docs);

  const filesFromFolders = docs
    .filter((d: DocsType) => d.type === "folder")
    .flatMap((folderDoc: { type: "folder"; folder: FolderType }) =>
      folderDoc.folder.files.map((file: FileType) => ({
        type: "file",
        file: file,
        from: folderDoc.folder.name,
      }))
    );

  const files = docs.filter((d: DocsType) => d.type === "file");

  const allFiles = [...filesFromFolders, ...files];

  const file = allFiles.find((d: any) => d.file._id === fileId).file;

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = localStorage.getItem("authToken");
  const params = new URLSearchParams(location.search);

  const [state, setState] = useState<State>({
    edit: false,
    page: 1,
    totalPage: 0,
    tableData: [],
    modal: false,
    deleteIndex: -1,
    fileData: file.data,
    changes: false,
    focusedIndex: -1,
  });

  const headers = useMemo(() => {
    return Object.keys(
      state.fileData.reduce((maxObj: {}, currentObj: {}) => {
        return Object.keys(currentObj).length > Object.keys(maxObj).length
          ? currentObj
          : maxObj;
      }, {})
    );
  }, [state.fileData]);

  useEffect(() => {
    setState((prev) => ({ ...prev, fileData: file.data }));
  }, [docs]);

  useEffect(() => {
    const count = Math.floor(state.fileData.length / 10);
    const partialChunk = state.fileData.length % 10 > 0 ? 1 : 0;
    const arraysAreEqual = (
      arr1: { [key: string]: string }[],
      arr2: { [key: string]: string }[]
    ): boolean => {
      return isEqual(arr1, arr2);
    };
    setState((prev) => ({
      ...prev,
      totalPage: count + partialChunk,
      changes: arraysAreEqual(file.data, state.fileData),
    }));
    if (state.page > count + partialChunk) {
      setState((prev) => ({ ...prev, page: count + partialChunk }));
    }
    document.getElementById(`head-${state.focusedIndex}`)?.blur();
  }, [state.fileData, state.tableData]);

  useEffect(() => {
    const startIndex = (state.page - 1) * 10;
    const endIndex = startIndex + 10;
    const data = state.fileData.slice(startIndex, endIndex);
    setState((prev) => ({ ...prev, tableData: data }));
  }, [state.page, state.totalPage, state.fileData]);

  const addNewRow = () => {
    setState((prev) => ({ ...prev, page: state.totalPage }));
    const newRow = headers.reduce((obj, key) => {
      obj[key] = "";
      return obj;
    }, {} as { [key: string]: string });
    setState((prev) => ({ ...prev, fileData: [...state.fileData, newRow] }));
    if ([...state.fileData, newRow].length / 10 > state.totalPage) {
      setState((prev) => ({ ...prev, page: state.totalPage + 1 }));
    } else {
      setState((prev) => ({ ...prev, page: state.totalPage }));
    }
  };

  useEffect(() => {
    if (params.get("modal") === "deleterow") {
      setState((prev) => ({ ...prev, modal: true }));
    } else {
      setState((prev) => ({ ...prev, modal: false }));
    }
  }, [location.search]);

  const openModal = (type: string, index: number) => {
    setState((prev) => ({ ...prev, deleteIndex: index }));
    const searchParams = new URLSearchParams(location.search);

    searchParams.set("modal", type);

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const closeModal = () => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete("modal");

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const deleteRow = (index: number) => {
    if (index > 9) {
      const newData = [...state.tableData];
      newData.splice(index, 1);
      setState((prev) => ({ ...prev, tableData: newData }));
    } else if (index >= 0 && index <= 9) {
      const newData = [...state.fileData];
      const deleteIndex = (state.page - 1) * 10 + index;
      newData.splice(deleteIndex, 1);
      setState((prev) => ({ ...prev, fileData: newData }));
    }
    closeModal();
  };

  const revertChanges = () => {
    setState((prev) => ({ ...prev, fileData: file.data }));
  };

  const saveFile = async () => {
    try {
      const res = await axiosInstance.put(
        `/docs/file/${fileId}`,
        { data: state.fileData },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      dispatch(setDocs(res.data.docs));
    } catch (err: any) {
      if (err.response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("name");
        dispatch(setIsUserLoggedIn(false));
        navigate("/");
      }
    } finally {
      setState((prev) => ({ ...prev, edit: false }));
    }
  };

  const updateValue = (newValue: string, index: number, hindex: number) => {
    const updateIndex = (state.page - 1) * 10 + index;
    const header = headers[hindex];

    const updates = {
      [header]: newValue,
    };

    const updatedObject = {
      ...state.fileData[updateIndex],
      ...updates,
    };

    const updatedFileData = state.fileData.map((item, i) =>
      i === updateIndex ? updatedObject : item
    );

    setState((prev) => ({ ...prev, fileData: updatedFileData }));
  };

  const changeKeyInAllObjects = (newKey: string, index: number) => {
    const oldKey = headers[index];
    const updatedFileData = state.fileData.map((item) => {
      const updatedItem: { [key: string]: string } = {};
      Object.keys(item).forEach((key) => {
        if (key === oldKey) {
          updatedItem[newKey] = item[key];
        } else {
          updatedItem[key] = item[key];
        }
      });
      return updatedItem;
    });
    setState((prev) => ({
      ...prev,
      fileData: updatedFileData,
      focusedIndex: index,
    }));
  };

  useEffect(() => {
    if (state.focusedIndex !== null) {
      document.getElementById(`head-${state.focusedIndex}`)?.focus();
    }
  }, [headers, state.focusedIndex]);

  return (
    <React.Fragment>
      <FileCon>
        <div
          style={{
            width: "100%",
            height: "8%",
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
              onClick={() => navigate("/dashboard/file")}
              icon={faArrowLeft}
              style={{
                cursor: "pointer",
                color: mode === "light" ? "black" : "white",
              }}
            />
          </div>
          <FontAwesomeIcon
            icon={faFile}
            style={{ fontSize: "2.5rem" }}
            color="#4CBB17"
          />
          <Label
            sx={{ fontSize: "1.5rem" }}
            font={"md"}
            weight={"b"}
            content={file.name}
          />
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "end",
              justifyContent: "end",
              gap: "1rem",
            }}
          >
            <CsvDownload datas={state.fileData} filename={file.name}>
              <Button
                icon={<FontAwesomeIcon icon={faDownload} />}
                sx={{ padding: "0.68rem", backgroundColor: "#4CBB17" }}
                onClick={() => {}}
              />
            </CsvDownload>
            <Button
              sx={{
                padding: "0.5rem 1rem",
                marginRight: "5%",
                backgroundColor: `${state.edit ? "red" : ""}`,
              }}
              placeholder={state.edit ? "Cancel Editing" : "Edit File"}
              onClick={() =>
                setState((prev) => ({ ...prev, edit: !state.edit }))
              }
            />
          </div>
        </div>
        <Spacer type={"vertical"} value={"3%"} />
        <div
          style={{
            width: "100%",
            height: "87%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TableCon>
            <div
              style={{
                width: "100%",
                height: "10%",
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <div
                style={{
                  minWidth: "3rem",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon icon={faCircleDot} color="#39FF14" />
              </div>
              {headers.map((data, index) => (
                <Cells
                  id={`head-${index}`}
                  onChange={(e: string) => changeKeyInAllObjects(e, index)}
                  edit={state.edit}
                  header={true}
                  data={data}
                  key={`${index}${data}`}
                />
              ))}
            </div>
            <div
              style={{
                width: "100%",
                height: "90%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {state.tableData.map(
                (item: { [key: string]: string }, tindex: number) => (
                  <div
                    key={tindex}
                    style={{
                      width: "100%",
                      height: "45px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "3rem",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        onClick={() => openModal("deleterow", tindex)}
                        icon={faTrash}
                        color="red"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    {headers.map((data, hindex) => (
                      <Cells
                        onChange={(e: string) => updateValue(e, tindex, hindex)}
                        edit={state.edit}
                        header={false}
                        data={item[data]}
                        key={`${hindex}${data}`}
                      />
                    ))}
                  </div>
                )
              )}
              <div
                style={{
                  width: "3rem",
                  minHeight: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  sx={{ padding: "0.5rem 0.6rem" }}
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={addNewRow}
                />
              </div>
            </div>
          </TableCon>
          <div
            style={{
              width: "95%",
              height: "10%",
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: "1rem",
            }}
          >
            {(!state.changes || state.tableData.length > 10) && (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  height: "100%",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Button
                  sx={{ padding: "0.5rem 1rem", backgroundColor: "#4CBB17" }}
                  placeholder="Revert all changes"
                  onClick={revertChanges}
                />
                <Button
                  sx={{ padding: "0.5rem 1rem" }}
                  placeholder="Save"
                  onClick={saveFile}
                />
              </div>
            )}
            {state.page - 1 !== 0 && (
              <>
                <FontAwesomeIcon
                  onClick={() =>
                    setState((prev) => ({ ...prev, page: state.page - 1 }))
                  }
                  style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  icon={faCircleChevronLeft}
                  color={mode === "light" ? "black" : "white"}
                />
                <Label font={"sm"} weight={"b"} content={`${state.page - 1}`} />
              </>
            )}
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Label font={"sm"} weight={"n"} content={`${state.page}`} />
            </div>
            {state.page <= state.totalPage - 1 && (
              <>
                <Label font={"sm"} weight={"b"} content={`${state.page + 1}`} />
                <FontAwesomeIcon
                  onClick={() =>
                    setState((prev) => ({ ...prev, page: state.page + 1 }))
                  }
                  style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  icon={faCircleChevronRight}
                  color={mode === "light" ? "black" : "white"}
                />
              </>
            )}
          </div>
        </div>
      </FileCon>
      {state.modal && (
        <Modal width="30vw" onClose={closeModal}>
          <Label font={"md"} weight={"b"} content={"Delete Row"} />
          <Spacer type={"vertical"} value={"2rem"} />
          <Label font={"sm"} weight={"n"} content={"Are you sure ?"} />
          <Spacer type={"vertical"} value={"2rem"} />
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Button
              onClick={() => deleteRow(state.deleteIndex)}
              placeholder="Yes"
              sx={{ backgroundColor: "red" }}
            />
            <Button
              onClick={closeModal}
              placeholder="No"
              sx={{ backgroundColor: "#4CBB17" }}
            />
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
}

const FileCon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const styledScrollbar = css`
  &::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
    border-radius: 5px;
  }
`;

const TableCon = styled.div`
  width: 95%;
  height: 90%;
  overflow: scroll;
  overflow-x: scroll;
  ${styledScrollbar}
`;

export default File;
