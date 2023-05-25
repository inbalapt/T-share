// src/components/ItemPage.js
import React, { useState, useEffect } from 'react';
import DetailsOfProduct from './DetailsOfProduct';
import NavigationBar from './NavigationBar';
import ImagesView from './ImagesView';
import logo from './logo.jpg'
import photo1 from './temp_clothes/photo1.jpg'
import photo2 from './temp_clothes/photo2.jpg'
import photo3 from './temp_clothes/photo3.jpg'
import photo4 from './temp_clothes/photo4.jpg'
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ItemPage.css';

let item1 = {images: [photo1, photo2, photo3, photo4] , seller: "jon", description:"floweral dress" , price: "30" ,
 size: "s", collectionPoint: "tel aviv" , condition: "used" ,color: "multi" , brand: "zara"}


 const getItemDetails = async (id, setItem) => {
  try {
    const response = await axios.get(`http://localhost:3000/getItemById?id=${id}`);
    setItem(response.data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return null; 
  }
};

const ItemPage = () => {
  const location = useLocation();
  const username = location.state?.username;
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const itemDetails = await getItemDetails(id, setItem);
      setItem(itemDetails);
    };

    fetchItem();
  }, []);

  if (item === null) {
    return <div>Loading...</div>;
  }

 

  return (
    <>
      <NavigationBar username={username}/>
      <div className="item-page">
        {item.pictures && <ImagesView images={item.pictures} />}
        <DetailsOfProduct
          id={id}
          username={username}
          seller={item.sellerFullName}
          description={item.description}
          price={item.price}
          size={item.size}
          collectionPoint={item.itemLocation}
          condition={item.condition}
          color={item.color}
          brand={item.brand}
          sellerUsername={item.sellerUsername}
          pictures={item.pictures}
        />
      </div>
    </>
  );
};

export default ItemPage;