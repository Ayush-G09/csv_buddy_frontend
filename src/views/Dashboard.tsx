import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import InfoCards from '../components/InfoCards'
import styled, { css } from 'styled-components'
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'
import Label from '../components/Label'
import Button from '../components/Button'
import Docs, { DocsType } from '../components/Docs'
import Modal from '../components/Modal'
import { useLocation, useNavigate } from 'react-router-dom'
import Spacer from '../components/Spacer'
import InputField from '../components/InputField'

const fileDoc: DocsType = {
  type: 'file',
  file: {
      data: [],
      name: 'example.txt',
      addedOn: '2024-07-20',
      updatedOn: '2024-07-20'
  }
};

const folderDoc: DocsType = {
  type: 'folder',
  folder: {
      files: [],
      name: 'exampleFolder',
      addedOn: '2024-07-20',
      updatedOn: '2024-07-20'
  }
};

const docsData = [fileDoc, folderDoc, folderDoc, fileDoc, fileDoc, fileDoc, folderDoc, fileDoc, fileDoc, folderDoc];

type State = {
  modal: boolean,
  modalType: 'AddFile' | 'CreateFolder';
}

function Dashboard() {

  const [state, setState] = useState<State>({
    modal: false,
    modalType: 'AddFile',
  });

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
      setState((prev) => ({...prev, modal: true, modalType: 'AddFile'}));
    } else if(params.get("modal") === "createfolder") {
      setState((prev) => ({...prev, modal: true, modalType: 'CreateFolder'}));
    } else {
      setState((prev) => ({...prev, modal: false}));
    }
  }, [location.search]);
  
  return (
    <DashboardCon>
      <Header/>
      <div style={{width: '100%', height: '93%', display: 'flex', flexDirection: 'column'}}>
        <div style={{width: '100%', display: 'flex', alignItems: 'center', height: '27%'}}>
          <InfoCards icon={faFolder} placeholder={'Folder'} color='#FDDA0D'/>
          <InfoCards icon={faFile} placeholder={'File'} color='#4CBB17'/>
        </div>
        <div style={{width: '100%', height: '7%', display: 'flex', alignItems: 'center'}}>
        <Label sx={{fontSize: '1.5rem', marginLeft: '3rem'}} font={'md'} weight={'b'} content={'My Docs'}/>
        <div style={{display: 'flex', gap: '1rem', flex: 1, alignItems: 'center', justifyContent: 'end', paddingRight: '3rem'}}>
          <Button sx={{padding: '0.5rem 0.7rem', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.3)'}} placeholder={'Create Folder'} onClick={() => openModal('createfolder')}/>
          <Button sx={{padding: '0.5rem 0.7rem', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.3)'}} placeholder={'Add File'} onClick={() => openModal('addfile')}/>
        </div>
        </div>
        <div style={{width: '100%', marginTop: '1%', height: '6%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <TableHeader>
          <Label sx={{marginLeft: '5.5%'}} font={'sm'} weight={'b'} content={'Name'}/>
          <Label sx={{marginLeft: '40%'}} font={'sm'} weight={'b'} content={'items'}/>
          <Label sx={{marginLeft: '10%'}} font={'sm'} weight={'b'} content={'Created at'}/>
          <Label sx={{marginLeft: '10%'}} font={'sm'} weight={'b'} content={'Last modified at'}/>
          </TableHeader>
        </div>
        <DocsCon>
          {docsData.map((item, index) => (
            <Docs data={item} key={`${index}${item.type}`}/>
          ))}
        </DocsCon>
        {state.modal && <Modal onClose={closeModal}>
          <Label font={'md'} weight={'b'} content={state.modalType}/>
          <Spacer type={'vertical'} value={'2rem'}/>
          <Label font={'sm'} weight={'n'} content={'Attach your csv file here'}/>
          <Spacer type={'vertical'} value={'2rem'}/>
        </Modal>}
        <Navigator></Navigator>
      </div>
    </DashboardCon>
  )
};

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

const Navigator = styled.div`
width: 100%;
height: 10%;
display: flex;
align-items: center;
justify-content: end;
`;

const DocsCon = styled.div`
width: 100%;
height: 52%;
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
background-color: ${(p) => p.theme.colors.base200};
`;

export default Dashboard