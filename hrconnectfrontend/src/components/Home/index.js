import React, { Component } from "react";
import {jwtDecode} from 'jwt-decode'; 
import Cookie from 'js-cookie';
import JobHome from "../JobHome";
import HrHome from "../HrHome";
import Hrconnect from "../../context";

class Home extends Component {
  static contextType = Hrconnect;

  state = {
    id: 0,
    rolee: "", 
  };

  async componentDidMount() {
    const token = Cookie.get('jwt_token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const Id = decodedToken.loggedid;
        //this.setState({ id: userId });

        const url = `${process.env.REACT_APP_Backend_url}/users/${Id}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          //console.log(data.role)
          this.context.setrole(data.role); 
        
          this.setState({ rolee: data.role });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error decoding token or fetching user data", error);
      }
    }
  }

  render() {
    const { rolee } = this.state;

    let ComponentToRender;
    if (rolee === "job_seeker") {
      ComponentToRender = <JobHome />;
    } else {
      ComponentToRender = <HrHome />;
    }

    return (
      <>
        {ComponentToRender}
      </>
    );
  }
}

export default Home;
