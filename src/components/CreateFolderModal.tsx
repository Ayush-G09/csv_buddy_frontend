import { useState } from "react";
import Modal from "./Modal";
import Label from "./Label";
import Spacer from "./Spacer";
import InputField from "./InputField";
import Button from "./Button";
import axiosInstance from "../config/axiosConfig";
import { useDispatch } from "react-redux";
import { setDocs, setIsUserLoggedIn } from "../store/action";
import { useNavigate } from "react-router-dom";

type Props = {
  addNotification: (msg: string, type: "error" | "success") => void;
  closeModal: () => void;
};

type State = {
  name: {
    value: string;
    error: boolean;
  };
  loading: boolean;
};

function CreateFolderModal({ addNotification, closeModal }: Props) {
  const [state, setState] = useState<State>({
    name: {
      value: "",
      error: false,
    },
    loading: false,
  });

  const token = localStorage.getItem("authToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const close = () => {
    setState((prev) => ({
      ...prev,
      name: { value: "", error: false },
      loading: false,
    }));
    closeModal();
  };

  const create = async () => {
    if (state.name.value === "") {
      setState((prev) => ({ ...prev, name: { ...prev.name, error: true } }));
    } else {
      setState((prev) => ({
        ...prev,
        name: { ...prev.name, error: false },
        loading: true,
      }));
      try {
        const res = await axiosInstance.post(
          "/folder/add",
          { name: state.name.value },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
        dispatch(setDocs(res.data.docs));
        addNotification(`folder ${state.name.value} added`, "success");
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
    }
  };
  return (
    <Modal onClose={close}>
      <Label font={"md"} weight={"b"} content={"Create Folder"} />
      <Spacer type={"vertical"} value={"2rem"} />
      <Label font={"sm"} weight={"n"} content={"Attach your csv file here"} />
      <Spacer type={"vertical"} value={"2rem"} />
      <InputField
        ierror={state.name.error}
        width="80%"
        placeholder={"Folder name"}
        type={"text"}
        value={state.name.value}
        onChange={(e) =>
          setState((prev) => ({ ...prev, name: { ...prev.name, value: e } }))
        }
      />
      {state.name.error && (
        <Label
          sx={{ color: "red" }}
          font={"xsm"}
          weight={"b"}
          content={"Name required"}
        />
      )}
      <Spacer type={"vertical"} value={"2rem"} />
      <Button
        loading={state.loading}
        sx={{ padding: "0.6rem 1rem", width: "20%" }}
        onClick={create}
        placeholder="Create"
      />
    </Modal>
  );
}

export default CreateFolderModal;
