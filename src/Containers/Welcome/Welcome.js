import React, { useEffect, useState } from 'react';
import { axiosAuth } from '../../axios';


const Welcome = (props) => {
    
    useEffect(()=> {
        retrievePageOfPhotoIDs();
    }, []);

    const [photoIds, setPhotoIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);

    const photosPerPage = 5;

    const retrievePageOfPhotoIDs = () => {
        console.log("Welcome.js : About to retrieve page of photo IDs");
        axiosAuth().get('/photoIdsPage'+ getPageParams(currentPage))
        .then( response => {
            parsePhotoIdsFrom(response.data);
            setIsLastPage(response.data.last);
            setCurrentPage(pageNum => pageNum + 1);
            
        }).catch(error => {
            handleError("Retrieving Photo IDs", error);
        })
    }


    const getPageParams = (currentPage) => {
        return "?page=" + currentPage + "&size=" + photosPerPage + "&photoSize=thumbnail";
    }


    const parsePhotoIdsFrom = (responseData) => {
        let newIds = [];
        responseData.content.map( photo => newIds.push(photo.id));
        setPhotoIds( existingIds => [...existingIds, ...newIds]);
    }


    const handleError = (label, error) => {
        console.log("Error (" + label + ") :" + error);
    }

    
    let photos = <h3> No Photos Found </h3>;
    let loadMoreButton = null;
    if(!isLastPage ){        
        loadMoreButton = <div><button onClick={retrievePageOfPhotoIDs}>Load More</button></div>
    }


    if(photoIds.length > 0){
        console.log("photos count : " + photoIds.length);
       photos =  photoIds.map( photoId => 
        <object key={photoId} 
                id={"photoImg_" + photoId} 
                data={"http://localhost:8090/svc/photo?size=thumbnail&id=" + photoId} 
                type="image/jpg"
                alt={"id " + photoId}>
            </object> );
    }

    
    return(
    <div>
        <h1>welcome!</h1>
        {photos}
        {loadMoreButton}

    </div>

    );

}

export default Welcome;