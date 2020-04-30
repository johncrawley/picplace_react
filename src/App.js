import React from 'react';

import './App.css';
import { Route, Switch, withRouter } from 'react-router-dom';

import Login from './Containers/Login/Login';
import Logout from './Containers/Logout/Logout';
import Welcome from './Containers/Welcome/Welcome';
import Upload from './Containers/Upload/Upload';
import Layout from './Containers/Layout/Layout';
import Auth from './HOC/Auth';
import Signup from './Containers/Signup/Signup';
import Unregister from './Containers/Unregister/Unregister';


const App = props => {

  

 let welcome = Auth(Welcome);
 let upload = Auth(Upload);
 //let welcome = Welcome;

  let routes = (
    <Switch>
      <Route path="/" exact component={welcome} />
      <Route path="/upload" exact component={upload} />
      <Route path="/login" exact component={Login} />
      <Route path="/logout" exact component={Logout} />
      <Route path="/signup" exact component={Signup} />
      <Route path="/unregister" exact component={Unregister} />
    </Switch>
  );

  return (
    <div className = "App">
      <Layout>
        {routes}
      </Layout>
    </div>
  );
};


export default withRouter(App);

/*
class App2 { //extends Component{

  constructor (props) {

    super(props);
    this.state = {
      blah: false,
      photos: []
    };
  }


  uploadPhotosAsForm = () => {


    let config = {

      headers: 
      { 
        'Content-Type': 'multipart/form-data',
         'Accept' : 'text/plain'
      }

    };

    for(var file of this.state.photos){

      let formData = new FormData();
      formData.append("file", file);

      axios.post(
        "/uploadFile", 
        formData, 
        config
      );

    }
  }
  */

  /*
  uploadPhotos = () =>{

    for(var file of this.state.photos){


      
      var reader = new FileReader();
      
    
      reader.onload = (function(file) {
        return function(e) {
		      console.log("************* contents of " + file.name + " **************");
          console.log(e.target.result);
         // uploadFile();
         axios.post('/upload', )
          
        };
      })(file);


      reader.readAsDataURL(file);
      //reader.readAsText(file);
    }

  }

  uploadFile = () =>{
    console.log("entered uploadFile");
  }

  sendPost(){

    let config =  {
      headers:{
        'Content-Type': 'application/json'

      }
    };
    console.log("dummy post!");
    axios.get('/test1', {}, config)
    .then( response => {
        console.log("******** RESPONSE **********");
        console.log(response.data);
    })
    .catch( error => {
        console.log("ERROR ");
        console.log(error);
    });
  }

  blah(){
    console.log("blah");

  }


  handleFileSelect(evt) {
    var files = Array.from(evt.target.files);
    for(var i =0; i < files.length; i++){
      console.log(files[i]);
    }
    this.setState({photos: files});
  

    
  }
*/

    /*
    for(var m of files){
      console.log(m);
    }
    for (var i in files) {
      var name = files[i];
      var path = files[i].path;
      
      console.log("path: " + path + "name: "+ name);
      fetch(path)
    .then((result) => result.text())
    .then(text  => {
      console.log(text);
    })  
    */

/*
      reader.addEventListener("load", function(){
        console.log("^^^^^^^^^ Photo: ");readAsDataURL
        console.log(reader.result);

      }, false);
      //reader.readAsDataURL(photo);
      reader.readAsText(photo);
      */



    /*
      var reader = new FileReader();
      reader.addEventListener("load", function(){

      })
      // Closure to capture the file information.
      reader.onload = (function(file) {
        return function(e) {
		      console.log("************* contents of " + file.name + " **************");
          console.log(e.target.result);
          //var newPhotos = [...this.state.photos, e.target.result];
          //this.setState({photos: newPhotos })
          
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
      //reader.readAsText(f);
      */


      /*
  render(){


    return(
      <div className = "App">

        <button onClick={this.uploadPhotosAsForm}> post </button>

        <div>

        <label>Select files:
           <input name="file" onChange={ evt => this.handleFileSelect(evt)} type="file" multiple/>

        </label>

        </div>
      </div>


    );

  }

}

export default App;
*/