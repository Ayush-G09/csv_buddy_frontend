import { faFile, faFolder, faTrash, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import styled from 'styled-components';
import Label from './Label';

type File = {
    data: [],
    name: string,
    addedOn: string,
    updatedOn: string,
}

type Folder = {
    files: File[],
    name: string,
    addedOn: string,
    updatedOn: string,
}

export type DocsType = 
  { type: 'file'; file: File }
  | { type: 'folder'; folder: Folder };

type Props = {
    data: DocsType,
}

function Docs({data}: Props) {
  return (
    <DocsCon>
        <div style={{width: '0.5%', height: '100%', backgroundColor: data.type === 'file' ? '#4CBB17' : '#FDDA0D'}}/>
        <IconCon>
            <FontAwesomeIcon icon={data.type === 'file' ? faFile : faFolder} color={data.type === 'file' ? '#4CBB17' : '#FDDA0D'}/>
        </IconCon>
        <Label sx={{width: '42%'}} font={'sm'} weight={'t'} content={data.type === 'file' ? data.file.name : data.folder.name}/>
        <Label sx={{width: '12%'}} font={'sm'} weight={'t'} content={data.type === 'file' ? '1 item' : `${data.folder.files.length} ${data.folder.files.length > 1 ? 'items' : 'item'}`}/>
        <Label sx={{width: '14.5%'}} font={'sm'} weight={'t'} content={data.type === 'file' ? data.file.addedOn : data.folder.addedOn}/>
        <Label sx={{width: '13%'}} font={'sm'} weight={'t'} content={data.type === 'file' ? data.file.updatedOn : data.folder.updatedOn}/>
        <div style={{height: '100%', width: '7.5%', display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
            <IconCon style={{cursor: 'pointer'}}>
                <FontAwesomeIcon icon={faUpRightFromSquare} style={{fontSize: '0.8rem'}} color='#0096FF' />
            </IconCon>
            <IconCon style={{cursor: 'pointer'}}>
                <FontAwesomeIcon icon={faTrash} style={{fontSize: '0.8rem'}} color='red' />
            </IconCon>
        </div>
    </DocsCon>
  )
};

const IconCon = styled.div`
width: 2rem;
height: 2rem;
background-color: ${(p) => p.theme.colors.base300};
border-radius: 5px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center
`;

const DocsCon = styled.div`
width: 90%;
min-Height: 50px;
background-color: ${(p) => p.theme.colors.base100};
margin-top: 1rem;
border-radius: 5px;
display: flex;
overflow: hidden;
box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
gap: 1rem;
align-items: center;
`;

export default Docs