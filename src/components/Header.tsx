import React, { useEffect, useState } from "react";
import { getGreeting } from "../utils";
import ModeToggle from "./ModeToggler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Label from "./Label";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { useLocation, useNavigate } from "react-router-dom";
import { setIsUserLoggedIn } from "../store/action";
import Spacer from "./Spacer";
import Button from "./Button";

function Header() {
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const mode = useSelector((state: any) => state.mode);

  const user = getGreeting() + ", " + localStorage.getItem("name");

  const params = new URLSearchParams(location.search);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("name");
    dispatch(setIsUserLoggedIn(false));
    setModal(false);
    navigate("/");
  };

  useEffect(() => {
    if (params.get("modal") === "logout") {
      setModal(true);
    } else {
      setModal(false);
    }
  }, [location.search]);

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
  return (
    <React.Fragment>
      <HeaderCon>
        <div style={{ marginLeft: "1rem" }}>
          <ModeToggle />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            flex: 1,
            marginRight: "2rem",
            gap: "1rem",
          }}
        >
          <Label font={"sm"} weight={"n"} content={user} />
          <UserIcon>
            <FontAwesomeIcon icon={faUser} color="#2336C4" />
          </UserIcon>
          <FontAwesomeIcon
            onClick={() => openModal("logout")}
            icon={faRightFromBracket}
            style={{
              marginLeft: "2rem",
              cursor: "pointer",
              color: mode === "light" ? "black" : "white",
            }}
          />
        </div>
      </HeaderCon>
      {modal && (
        <Modal onClose={closeModal}>
          <Label font={"md"} weight={"b"} content={"Logout"} />
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
              onClick={logout}
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

const HeaderCon = styled.div`
  width: 100%;
  height: 7%;
  background-color: ${(p) => p.theme.colors.base100};
  display: flex;
  align-items: center;
`;

const UserIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => p.theme.colors.base300};
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
`;

export default Header;
