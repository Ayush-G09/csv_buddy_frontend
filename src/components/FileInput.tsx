import React, { ChangeEvent, useRef, useState } from 'react'
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import Label from './Label';
import { truncateString } from '../utils';

type Props = {
    addNotification: (msg: string, type: 'error' | 'success') => void;
}

function FileInput({addNotification}: Props) {

    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };

      const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
          const allowedTypes = ["application/pdf"];
    
          if (allowedTypes.includes(file.type)) {
            setFile!(file);
          } else {
            addNotification!("Please select a valid file type (CSV).", "error");
            setFile!(null);
          }
        }
      };
      
  return (
    <Button
            sx={{ padding: "0.7rem 0.8rem" }}
            onClick={handleClick}
            icon={<FontAwesomeIcon icon={faPaperclip} />}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              style={{ display: "none" }}
            />
              <Label
                font="xsm"
                weight="b"
                content={
                  file
                    ? truncateString(file.name)
                    : 'Click here'
                }
              />
          </Button>
  )
}

export default FileInput