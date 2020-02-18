import React, { useState } from 'react';
import axios from '../../axios';


const Upload = props => {

  const [ filesState, setFilesState] = useState({files: []});

      const uploadPhotosAsForm = () => {    
        let config = {
    
          headers: 
          { 
            'Content-Type': 'multipart/form-data',
            'Accept' : 'text/plain'
          }
    
        };
    
        for(var file of filesState.files){
    
          let formData = new FormData();
          formData.append("file", file);
    
          axios.post(
            "/uploadFile", 
            formData, 
            config
          );
    
        }
      }
    
      const handleFileSelect = (evt) => {
        var selectedFiles = Array.from(evt.target.files);
        for(var i =0; i < selectedFiles.length; i++){
          console.log(selectedFiles[i]);
        }
        
        setFilesState( (prevState) => ({
            files : selectedFiles
        }));
      }
    
        return (
          <div>
    
            <button onClick={uploadPhotosAsForm}> Upload </button>
    
            <div>
              <label>Select files to upload:
                <input name="file" onChange={ evt => handleFileSelect(evt)} type="file" multiple/>
    
              </label>
            </div>
          </div>
        );
}

export default Upload;


