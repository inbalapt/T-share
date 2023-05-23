import React, { useState } from 'react';
import './UploadItem.css';

const UploadItem = () => {
    const [item, setItem] = useState({
        description: '',
        price: '',
        size: '',
        condition: '',
        color: '',
        brand: '',
        images: [],  // <-- add this
    });

    const sizes = ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    const handleChange = (event) => {
        setItem({
            ...item,
            [event.target.name]: event.target.value,
        });
    };

    const handleImageChange = (event) => {  // <-- add this
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
        // TODO: Add logic to send the data to the server.
    };

    return (
        <form onSubmit={handleSubmit} className="upload-item-form">
            <label className="upload-item-label">
                <h1 className="upload-item-title">Upload Item</h1>
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
    );
}

export default UploadItem;
