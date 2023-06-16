// MyDetails.js
import React, { useState, useEffect, useRef } from 'react';
import './MyDetails.css';
import axios from 'axios';
import Select from 'react-select';
import cityCSV from '../auth/city_list.csv';
import Papa from 'papaparse'; 

const getUserDetails = async(username,setUserDetails)=>{
    try {
        const response = await axios.get(`http://localhost:3000/user/getUserDetails?username=${username}`);
        console.log(response.data)
        setUserDetails((prevUserDetails) => ({
            ...prevUserDetails,
            city: response.data.city,
            size: response.data.size || '', 
            credit: response.data.credit,
            email: response.data.email,
            image: response.data.image
          }));
        return response.data.fullName;
      } catch (error) {
        console.error(error);
      }
}


const MyDetails = ({username}) => {
    const [editMode, setEditMode] = useState(false);
    const [userDetails, setUserDetails] = useState({
        city: '',
        size: '', 
        credit: '',
        email: '',
        image: '',
    });
    const sizes = ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50'];

    const sizeOptions = sizes.map(size => ({value: size, label: size}));
    
    const handleSizeChange = (selectedOption) => {
        setUserDetails((prevUserDetails) => ({
            ...prevUserDetails,
            size: selectedOption ? selectedOption.value : ""
        }));
    };

    const [cityList, setCityList] = useState([]);


  useEffect(() => {
    Papa.parse(cityCSV, {
      download: true,
      header: true,
      complete: function(results) {
        console.log(results); // Add this line to inspect the results
        const cities = results.data.map(row => row.City);
        setCityList(cities);
      },
       error: function(err) {
        console.log('An error occurred:', err); // This should print the error if one occurred
      }
    });
  }, []);
    const cityOptions = cityList.map(city => ({ value: city, label: city })); 
    const handleCityChange = (selectedOption) => {
        setUserDetails(prevState => ({
        ...prevState,
        city: selectedOption ? selectedOption.value : ""
        }));
    };

    useEffect(() => {
        getUserDetails(username, setUserDetails);
        console.log(userDetails);
        // TODO: Fetch user data from the server and set it in the state
    }, []);

    const handleInputChange = (event) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value,
        });
    };

    const handleImageChange = (event) => {  
        // if there is more than 4 images to the product
        if (event.target.files.length > 1) {
            alert("You can only upload 1 image.");
            event.target.value = null;  // <-- Clear the selected files
           
        } else {
            setUserDetails({
                ...userDetails,
                image: event.target.files[0],
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Add logic to send the updated data to the server
        
        const uploadChangesToServer = async () => {
            try {
                const formData = new FormData();
                formData.append('username', username);
                if(userDetails.city !== null){
                    formData.append('city', userDetails.city);
                } 
                if(userDetails.email !== null){
                    formData.append('email', userDetails.email);
                }
                if(userDetails.size !== null){
                    formData.append('size', userDetails.size);
                }
               
                if (userDetails.image !== null) {
                    console.log("good");
                    formData.append('image', userDetails.image);
                }

                const response = await axios.post(`http://localhost:3000/user/updateUserDetails`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
        
               console.log(response.data);
            } catch (error) {
                console.log('Error updating user:', error);
                // Handle error case, e.g., show an error message to the user
            }
        
        }
        uploadChangesToServer();
        setEditMode(false);
    };

    if (editMode) {
        return (
            <form onSubmit={handleSubmit} className="my-details-form">
                <h1 className="my-details-title">My Details</h1>
                <label className='my-details-label'>
                      <div>City:</div>
                        <Select 
                          options={cityOptions} 
                          placeholder={userDetails.city || "Enter City"}
                          onChange={handleCityChange}
                          styles={{
                              placeholder: base => ({
                                  ...base,
                                  color: '#ddd',
                                  opacity: 1,
                              }),
                          }}
                        />
                  </label>

                <label className="my-details-label">

                    <div>
                    Size:  
                    </div>
                    <Select name="size" onChange={handleSizeChange}
                      options={sizeOptions} 
                      placeholder={userDetails.size || "Enter Size"}
                      styles={{
                        placeholder: base => ({
                            ...base,
                            color: '#ddd',
                            opacity: 1,
                        }),
                    }}
                    />



                </label>
                <label className="my-details-label">
                    Email:
                    <input type="email" name="email" /*value={userDetails.email}*/ placeholder={userDetails.email} onChange={handleInputChange} />
                </label>
                <label className="my-details-label">
                Profile Image:
                <input type="file" name="images" onChange={handleImageChange} className="upload-item-input"/>
            </label>
                <button type="submit" className="my-details-button">Save Changes</button>
            </form>
        );
    }

    return (
        <div className="my-details-view" >
            <h1 className="my-details-title">My Details</h1>
            <p className="my-details-item">City: {userDetails.city}</p>
            <p className="my-details-item">Size: {userDetails.size}</p>
            <p className="my-details-item">Email: {userDetails.email}</p>
            <button onClick={() => setEditMode(true)} className="my-details-button">Edit</button>
        </div>
    );
};

export default MyDetails;
