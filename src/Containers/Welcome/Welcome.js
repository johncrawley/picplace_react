import React, { useEffect, useState } from 'react';
import Axios, { axiosAuth } from '../../axios';


const Welcome = (props) => {
    
    

    useEffect(()=> {
        
        retrieveListOfPhotoIDs();
        retrieveNumberOfPhotos();
    }, []);

    const [photoIds, setPhotoIds] = useState([]);
    const [photoCount, setPhotoCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);

    const photosPerPage = 5;

    const retrieveListOfPhotoIDs = () => {
        const pageParams = getPageParams(currentPage);
        axiosAuth.get('/photoIdsPage'+ pageParams)
        .then( response => {
            parsePhotoIdsFrom(response.data);
            updateLastPageStatus(response.data);
            updateCurrentPageNumber();
            
        }).catch(error => {
            handleError("Retrieving Photo IDs", error);
        })
    }

    const getPageParams = (currentPage) => {
        console.log("Current page: " + currentPage);
        return "?page=" + currentPage + "&size=" + photosPerPage + "&photoSize=thumbnail";
    }

    const parsePhotoIdsFrom = (responseData) => {
        let newIds = [];
        responseData.photos.map( photo => newIds.push(photo.id));
        setPhotoIds( existingIds => [...existingIds, ...newIds]);
    }

    const updateLastPageStatus = (responseData) => {
        setIsLastPage(responseData.last);
    }

    const updateCurrentPageNumber = () => {
        setCurrentPage(prevPageNum => prevPageNum + 1);
    }

    const retrieveNumberOfPhotos = () => {

        axiosAuth.get('/photocount')
        .then( response => { setPhotoCount(response.data);}).catch(error => {handleError("Retrieving Photo count", error);} );
    }


    const handleError = (label, error) => {
        console.log("Error (" + label + ") :" + error);
    }


   // const preloadImage = (url) =>{
    //    img1 =new Image();
   //     img1.src=url;
   // }

    //preloadImage("http://localhost:8090/svc/photo");

    

    const retrieveNextPage = () => {
        console.log("retrieve next page!");

        const pageParams = getPageParams(currentPage);
        axiosAuth.get('/photoIdsPage' + pageParams)
        .then( response => {
            parsePhotoIdsFrom(response.data);
            updateLastPageStatus(response.data);
            updateCurrentPageNumber();
        }).catch(error => {
            
        })
        
    }

    let photos = <h3> No Photos Found </h3>;
    let loadMoreButton = null;

    if(!isLastPage){
        loadMoreButton = <div><button onClick={retrieveNextPage}>Load More</button></div>
    }


    if(photoIds.length > 0){
       photos =  photoIds.map( photoId => <img key={photoId} src={"http://localhost:8090/svc/photo?size=thumbnail&id=" + photoId} alt={"id " + photoId}></img> );
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