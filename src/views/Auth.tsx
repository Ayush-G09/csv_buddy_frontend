import React, { useState } from 'react'
import Logo from '../assets/Logo'
import Button from '../components/Button'
import Spacer from '../components/Spacer'
import Modal from '../components/Modal'

type State = {
    modal: boolean;
}

function Auth() {

    const [state, setState] = useState<State>({
        modal: true,
    }); 

  return (
    <React.Fragment>
    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{width: '7rem', height: '7rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Logo/>
        </div>
        <Spacer type={'vertical'} value={'0.5rem'}/>
        <label style={{fontSize: '1.5rem', fontWeight: 'bold'}}>CSV Buddy</label>
        <Spacer type={'vertical'} value={'4rem'}/>
        <Button placeholder='Login' onClick={() => console.log('lo')}/>
        <Spacer type={'vertical'} value={'1.2rem'}/>
        <Button placeholder='Signup' onClick={() => console.log('lo')}/>
    </div>
    <Modal width='30vw' onClose={() => setState((prev) => ({...prev, modal: false}))}>
        <div>hhh</div>
    </Modal>
    </React.Fragment>
  )
}

export default Auth