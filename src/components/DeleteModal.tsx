import Modal from "./Modal";
import Label from "./Label";
import Spacer from "./Spacer";
import Button from "./Button";
import axiosInstance from "../config/axiosConfig";
import { useDispatch } from "react-redux";
import { setDocs, setIsUserLoggedIn } from "../store/action";
import { useNavigate } from "react-router-dom";

type Props = {
  addNotification: (msg: string, type: "error" | "success") => void;
  closeModal: () => void;
  data: { type: "file" | "folder"; id: string };
};

function DeleteModal({ addNotification, closeModal, data }: Props) {
  const token = localStorage.getItem("authToken");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const remove = async () => {
    try {
      const res = await axiosInstance.delete(`/docs/${data.type}/${data.id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      dispatch(setDocs(res.data.docs));
    } catch (err: any) {
      addNotification("Something is wrong try again", "error");
      if (err.response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("name");
        dispatch(setIsUserLoggedIn(false));
        navigate("/");
      }
    } finally {
      closeModal();
    }
  };

  return (
    <Modal onClose={closeModal}>
      <Label
        font={"md"}
        weight={"b"}
        content={data.type === "file" ? "Remove file" : "Remove folder"}
      />
      <Spacer type={"vertical"} value={"2rem"} />
      <Label
        font={"sm"}
        weight={"n"}
        content={
          data.type === "file"
            ? "Are you sure ?"
            : "Are you sure removing folder will also remove its contents ?"
        }
      />
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
          onClick={remove}
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
  );
}

export default DeleteModal;
