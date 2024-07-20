import React, { useEffect, useState } from 'react'
import Logo from '../assets/Logo'
import Button from '../components/Button'
import Spacer from '../components/Spacer'
import Modal from '../components/Modal'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import Label from '../components/Label'
import { validateEmail } from '../utils'
import axiosInstance from '../config/axiosConfig'
import Notifications from '../components/Notifications'
import { setIsUserLoggedIn } from '../store/themeAction'

type Card = {
  msg: string;
  type: "error" | "success";
  id: number;
};

type State = {
    modal: boolean;
    modalChild: 'Login' | 'Signup';
    name: {
        value: string,
        error: boolean,
    };
    email: {
        value: string,
        error: boolean,
    };
    password: {
        value: string,
        error: boolean,
    };
    cnfPassword: {
        value: string,
        error: boolean,
    };
    cards: Card[];
}

function Auth() {

    const [state, setState] = useState<State>({
        modal: false,
        modalChild: 'Login',
        name: {
            value: '',
            error: false,
        },
        email: {
            value: '',
            error: false,
        },
        password: {
            value: '',
            error: false,
        },
        cnfPassword: {
            value: '',
            error: false,
        },
        cards: [],
    }); 

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isUserLoggedIn = useSelector((state: any) => state.isUserLoggedIn);

    const params = new URLSearchParams(location.search);

    useEffect(() => {
        if (params.get("modal") === "login") {
          setState((prev) => ({ ...prev, modalChild: "Login", modal: true }));
        } else if (params.get("modal") === "signup") {
          setState((prev) => ({ ...prev, modalChild: "Signup", modal: true }));
        } else {
          setState((prev) => ({ ...prev, modal: false }));
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

        resetErrors();
        resetValues();
      };

      const resetErrors = () => {
        setState(prev => ({
          ...prev,
          email: { ...prev.email, error: false },
          password: { ...prev.password, error: false },
          name: { ...prev.name, error: false},
          cnfPassword: { ...prev.cnfPassword, error: false}
        }));
      }

      const resetValues = () => {
        setState(prev => ({
          ...prev,
          email: { ...prev.email, value: '' },
          password: { ...prev.password, value: '' },
          name: { ...prev.name, value: ''},
          cnfPassword: { ...prev.cnfPassword, value: ''}
        }));
      }

      const signup = async () => {
        const { email, password, name, cnfPassword } = state;

        const nameIsValid = name.value !== '';
        const emailIsValid = email.value !== '' && validateEmail(email.value);
        const passwordIsValid = password.value !== '';
        const cnfPasswordIsValid = cnfPassword.value !== '' && cnfPassword.value === password.value;

        setState(prev => ({
          ...prev,
          email: { ...prev.email, error: !emailIsValid },
          password: { ...prev.password, error: !passwordIsValid },
          name: { ...prev.name, error: !nameIsValid},
          cnfPassword: { ...prev.cnfPassword, error: !cnfPasswordIsValid}
        }));

        if(nameIsValid && emailIsValid && passwordIsValid && cnfPasswordIsValid){
          resetErrors();
          const data = {name: name.value, email: email.value, password: password.value};
          try{
            await axiosInstance.post('/user', data);
            addNotification('Registered successfully.', 'success');
            closeModal();
          }catch(err: any) {
            addNotification(err.response.data.msg, 'error');
          }
        }
      }

      const login = async () => {
        const { email, password } = state;
      
        const emailIsValid = email.value !== '' && validateEmail(email.value);
        const passwordIsValid = password.value !== '';
      
        setState(prev => ({
          ...prev,
          email: { ...prev.email, error: !emailIsValid },
          password: { ...prev.password, error: !passwordIsValid },
        }));
      
        if (emailIsValid && passwordIsValid) {
          resetErrors();
          const data = {email: email.value, password: password.value};
          try {
            const response = await axiosInstance.post("/auth", data);
            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("name", response.data.user.name);
            resetValues();
            dispatch(setIsUserLoggedIn(true));
            navigate("/dashboard");
          } catch {
            addNotification("Invalid credentials", "error");
          }
        }
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
        console.log({cards: state.cards})
      }, [state.cards]);

  return (
    <React.Fragment>
    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{width: '7rem', height: '7rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Logo/>
        </div>
        <Spacer type={'vertical'} value={'0.5rem'}/>
        <Label font={'md'} weight={'b'} content={'CSV Buddy'}/>
        <Spacer type={'vertical'} value={'4rem'}/>
        <Button placeholder='Login' onClick={() => openModal('login')}/>
        <Spacer type={'vertical'} value={'1.2rem'}/>
        <Button placeholder='Signup' onClick={() => openModal('signup')}/>
    </div>
    {state.modal && <Modal width='30vw' onClose={closeModal}>
        <React.Fragment>
            <Label font={'md'} weight={'b'} content={state.modalChild}/>
            {state.modalChild === 'Signup' && <>
                <Spacer type={'vertical'} value={'2rem'}/>
            <InputField width='70%' placeholder={'Name'} type={'text'} value={state.name.value} ierror={state.name.error} onChange={(s) => setState((prev) => ({...prev, name: {...prev.name, value: s}}))}/>
            {state.name.error && (
                    <Label
                      sx={{ color: "red" }}
                      font={"xsm"}
                      weight={"b"}
                      content={"Name required"}
                    />
                  )}
            </>}
            <>
            <Spacer type={'vertical'} value={state.modalChild === 'Login' ? '2rem' : '1rem'}/>
            <InputField width='70%' placeholder={'email'} type={'email'} value={state.email.value} ierror={state.email.error} onChange={(s) => setState((prev) => ({...prev, email: {...prev.email, value: s}}))}/>
            {state.email.error && (
                    <Label
                      sx={{ color: "red" }}
                      font={"xsm"}
                      weight={"b"}
                      content={state.email.value.trim() === ""
                        ? "Email required"
                        : "Enter a valid email"}
                    />
                  )}
            </>
            <>
            <Spacer type={'vertical'} value={'1rem'}/>
            <InputField width='70%' placeholder={'Password'} type={'password'} value={state.password.value} ierror={state.password.error} onChange={(s) => setState((prev) => ({...prev, password: {...prev.password, value: s}}))}/>
            {state.password.error && (
                    <Label
                      sx={{ color: "red" }}
                      font={"xsm"}
                      weight={"b"}
                      content={"Password required"}
                    />
                  )}
            </>
            {state.modalChild === "Signup" && <>
            <Spacer type={'vertical'} value={'1rem'}/>
            <InputField width='70%' placeholder={'Confirm Password'} type={'password'} value={state.cnfPassword.value} ierror={state.cnfPassword.error} onChange={(s) => setState((prev) => ({...prev, cnfPassword: {...prev.cnfPassword, value: s}}))}/>
            {state.cnfPassword.error && (
                    <Label
                      sx={{ color: "red" }}
                      font={"xsm"}
                      weight={"b"}
                      content={state.cnfPassword.value === "" ? "Password required" : "Password is not same"}
                    />
                  )}
            </>}
            <Spacer type={"vertical"} value={"2rem"} />
              <Button
                sx={{ width: "5vw" }}
                placeholder={state.modalChild}
                onClick={state.modalChild === "Signup" ? signup : login}
              />
        </React.Fragment>
    </Modal>}
    <Notifications cards={state.cards} removeCard={removeNotification} />
    </React.Fragment>
  )
}

export default Auth