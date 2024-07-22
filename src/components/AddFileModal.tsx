import { useState } from "react";
import Modal from "./Modal";
import Label from "./Label";
import Spacer from "./Spacer";
import FileInput from "./FileInput";
import Button from "./Button";
import axiosInstance from "../config/axiosConfig";
import { useDispatch } from "react-redux";
import { setDocs, setIsUserLoggedIn } from "../store/action";
import { useNavigate } from "react-router-dom";

type Props = {
  addNotification: (msg: string, type: "error" | "success") => void;
  closeModal: () => void;
  folderId?: string;
};

type State = {
  file: File | null;
  data: any[];
  loading: boolean;
};

function AddFileModal({ addNotification, closeModal, folderId }: Props) {
  const [state, setState] = useState<State>({
    file: null,
    data: [],
    loading: false,
  });

  const token = localStorage.getItem("authToken");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const close = () => {
    setState((prev) => ({ ...prev, data: [], file: null, loading: false }));
    closeModal();
  };

  const addFile = async () => {
    const data = {
      data: state.data,
      name: state.file?.name,
    };
    setState((prev) => ({ ...prev, loading: true }));

    const endpoint = folderId ? `/folder/${folderId}/file` : "/file/add";

    try {
      const res = await axiosInstance.post(endpoint, data, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      dispatch(setDocs(res.data.docs));
      addNotification(`file ${state.file?.name} added`, "success");
      close();
    } catch (err: any) {
      addNotification("Something is wrong try again", "error");
      if (err.response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("name");
        dispatch(setIsUserLoggedIn(false));
        navigate("/");
      }
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <Modal onClose={close}>
      <Label font={"md"} weight={"b"} content={"Add File"} />
      <Spacer type={"vertical"} value={"2rem"} />
      <Label font={"sm"} weight={"n"} content={"Attach your csv file here"} />
      <Spacer type={"vertical"} value={"2rem"} />
      <FileInput
        addNotification={addNotification}
        setFile={(e) => setState((prev) => ({ ...prev, file: e }))}
        setData={(e) => setState((prev) => ({ ...prev, data: e }))}
        file={state.file}
      />
      <Spacer type={"vertical"} value={"2rem"} />
      <Button
        loading={state.loading}
        disabled={!state.file}
        sx={{ padding: "0.6rem 1rem", width: "20%" }}
        onClick={addFile}
        placeholder="Add"
      />
    </Modal>
  );
}

export default AddFileModal;
