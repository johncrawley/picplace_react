  import React, { useState, useEffect } from 'react';
  import { axiosAuth } from '../../axios';


  const Upload = props => {

    const [ filesState, setFilesState] = useState({files: []});
    const [ imgData, setImgData] = useState({sources: []});
    const [, setUpdated] = useState(false);


    /*
    useEffect( () => {
      console.log("useEffect(), ImgData sources length: " + imgData.sources.length);

      if(updated === false){
        setUpdated(true);
      }
    },[imgData, updated]);
  */

    const uploadPhotosAsForm = () => {    

      let config = createRequestConfig();
      
      for(var file of filesState.files){
        sendUploadRequest(file, config);
      }  
    }

    const createRequestConfig = () => {
      return  {
        headers: 
        { 
          'Content-Type': 'multipart/form-data',
          'Accept' : 'text/plain'
        }
      };
    }

    const sendUploadRequest = (file, config) => {

      let formData = new FormData();
      formData.append("file", file);

      axiosAuth.post(
        "/uploadFile", 
        formData, 
        config
      );
    }

    const savePreviewImagesToState = (array, numberOfFiles) => {
      console.log("Entered savePReviewImagesToState");
      if(array.length === numberOfFiles){
        setImgData( (prevState) => ({
          sources : array
        })); 
      }
    }

    const handleFileSelect = (evt) => {
      console.log("Entered handleFileSelect()");
      var selectedFiles = Array.from(evt.target.files);

      let array = [];
      setUpdated(false);
      for(var i =0; i < selectedFiles.length; i++){
        
        let file = selectedFiles[i];
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);
        const numberOfFiles = selectedFiles.length;
        console.log("handleFileSelect() number of files: " + numberOfFiles);
        
        reader.onload = function(e){
          array.push(e.target.result);
          console.log("reader.onload()");
          savePreviewImagesToState(array, numberOfFiles);
        }
      }

      setFilesState( (prevState) => ({
          files : selectedFiles
      }));
    }


    const areFilesSelected = () => {
      return filesState.files != null && filesState.files.length > 0;
    }


    const previewStyle = {
      width: "250px",
      height: "250px"
    };
  
    const previews = imgData.sources.map( (previewSrc, i) => (<div key={"previewItem_" + i}><img key={"previewImg_" + i} alt="preview" src={previewSrc} style={previewStyle} ></img></div>));
    

    let thumbnailsOfFilesToUpload =  areFilesSelected() ? <div><h3> some files here!</h3>{previews}</div> : null;
  
    let uploadButton = areFilesSelected() ? <button onClick={uploadPhotosAsForm}> Upload </button> : null;
   

    const fileSelector = (
      <div>
        <label>Select files to upload:
          </label>
          <br></br>
          <input name="file" onChange={ evt => handleFileSelect(evt)} type="file" multiple/>
      </div>
    );

      return (
        <div>
          {fileSelector}
          {thumbnailsOfFilesToUpload}
          {uploadButton}
        </div>
      );
  }

  export default Upload;


