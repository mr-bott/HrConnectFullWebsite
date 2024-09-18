import React, { Component } from 'react';
import "./index.css";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

class Resumes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      uploadStatus: '',
      uploadId: null,
    };
  }

  handleFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { selectedFile } = this.state;

    if (!selectedFile) {
      this.setState({ uploadStatus: 'Please select a file first.' });
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    const token = Cookies.get('jwt_token');
    if (!token) {
      this.setState({ uploadStatus: 'No authentication token found.' });
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.loggedid;

    formData.append('userId', userId); 

    try {
      const response = await fetch(`${process.env.REACT_APP_Backend_url}/resumes`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ 
          uploadStatus: 'File uploaded successfully!',
          uploadId: data.id 
        });
      } else {
        this.setState({ uploadStatus: 'Failed to upload file.' });
      }
    } catch (error) {
      this.setState({ uploadStatus: 'Error uploading file.' });
    }
  };

  render() {
    const { uploadStatus, uploadId } = this.state;

    return (
      <div className='main-container'>
        <h1 className='upload-h1'>Upload Your Resume</h1>
        <form onSubmit={this.handleSubmit} className='upload-form'>
          <input type="file" accept="application/pdf" onChange={this.handleFileChange} className='upload-input'/>
          <button type="submit" className='upload-button'>Upload</button>
        </form>
        {uploadStatus && <p className='upload-p'>{uploadStatus}</p>}
        {uploadId && <p className='upload-id'>Uploaded Resume ID
           remember it  : {uploadId}</p>} 
      </div>
    );
  }
}

export default Resumes;
