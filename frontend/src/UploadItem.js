import React, { useState } from 'react';
import './UploadItem.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

const UploadItem = ({username, setUpdateProducts}) => {
    const navigate= useNavigate();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(false);
    const [item, setItem] = useState({
        category: '',
        description: '',
        price: '',
        size: '',
        condition: '',
        color: '',
        brand: '',
        images: [],  // <-- add this
    });

    const sizes = ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const categories = ['dresses', 'tops', 'pants' , 'skirts' , 'other']
    const handleChange = (event) => {
        setItem({
            ...item,
            [event.target.name]: event.target.value,
        });
    };

    const handleImageChange = async (event) => {  // <-- add this
        // if there is more than 4 images to the product
        if (event.target.files.length > 4) {
            alert("You can only upload up to 4 images.");
            event.target.value = null;  // <-- Clear the selected files
           
        } else {
            setItem({
                ...item,
                images: event.target.files,
            });
        }
    };
    

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(item);
        setUploadedImage(true);
        const uploadToServer = async () => {
            try {
                const formData = new FormData();
                formData.append('username', username);
                if(item.category == ''){
                    formData.append('category', "dresses");
                } else {formData.append('category', item.category);}
                if(item.size == ''){
                    formData.append('size', 32);
                } else {formData.append('size', item.size);}
                formData.append('description', item.description);
                formData.append('price', item.price);
                formData.append('condition', item.condition);
                formData.append('color', item.color);
                formData.append('brand', item.brand);
        
                for (let i = 0; i < item.images.length; i++) {
                    formData.append('images', item.images[i]);
                }
        
                const response = await axios.post(`http://localhost:3000/uploadItem`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                
                setShowSuccessMessage(true);
                setUpdateProducts(true);
               
                console.log(response.data);
                
                setTimeout(() => {
                    
                    setShowSuccessMessage(false);
                     setUploadedImage(false);
                    // Navigate to the homepage
                    //navigate("../HomePage", { state: { username: username } });
                }, 3000); // Adjust the duration as needed
            
                
            } catch (error) {
                console.log('Error uploading item:', error);
                // Handle error case, e.g., show an error message to the user
            }
        
        }
        uploadToServer();
        
    };

    return !uploadedImage ? (
        <form onSubmit={handleSubmit} className="upload-item-form">
            
            <label className="upload-item-label">
                <h1 className="upload-item-title">Upload Item</h1>
            </label>
            <label className="upload-item-label">
                Category:
                <select name="category" required onChange={handleChange} className="upload-item-input">
                    {categories.map(category => <option value={category} key={category}>{category}</option>)}
                </select>
            </label>
            <label className="upload-item-label">
                Product Description:
                <input type="text" name="description" required onChange={handleChange} className="upload-item-input"/>
            </label>
            <label className="upload-item-label">
                Price:
                <input type="number" name="price" required min="0" onChange={handleChange} className="upload-item-input"/>
            </label>
            <label className="upload-item-label">
                Size:
                <select name="size" required onChange={handleChange} className="upload-item-input">
                    {sizes.map(size => <option value={size} key={size}>{size}</option>)}
                </select>
            </label>
            <label className="upload-item-label">
                Condition:
                <input type="text" name="condition" required onChange={handleChange} className="upload-item-input"/>
            </label>
            <label className="upload-item-label">
                Color:
                <input type="text" name="color" onChange={handleChange} className="upload-item-input"/>
            </label>
            <label className="upload-item-label">
                Brand:
                <input type="text" name="brand" onChange={handleChange} className="upload-item-input"/>
            </label>
            <label className="upload-item-label">
                Product Images:
                <input type="file" name="images" required multiple onChange={handleImageChange} className="upload-item-input"/>
            </label>
            <input type="submit" value="Submit" className="upload-item-submit"/>
            
        </form>
        
    ) : 
    <>
    {!showSuccessMessage && (
         <div className="uploading-item">
      <h1>Uploading the item</h1>
      <Oval color="#000000" height={50} width={50} />
    </div>
    )}
    {showSuccessMessage && (
     <div className="success-message centered">
     The item uploaded successfully!
   </div>
    )}
    
    </>
}

export default UploadItem;
