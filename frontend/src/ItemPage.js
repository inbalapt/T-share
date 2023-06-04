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
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ItemPage.css';

let item1 = {images: [photo1, photo2, photo3, photo4] , seller: "jon", description:"floweral dress" , price: "30" ,
 size: "s", collectionPoint: "tel aviv" , condition: "used" ,color: "multi" , brand: "zara"}


 const getItemDetails = async (id, setItem, setIsBought, setIsDeleded) => {
  try {
    const response = await axios.get(`http://localhost:3000/getItemById?id=${id}`);
    setIsBought(response.data.isBought);
    setItem(response.data);
    
    return response.data;
  } catch (error) {
    setIsDeleded(true);
    console.error(error);
    return null; 
  }
};

const ItemPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isBought, setIsBought] = useState(false);
  const [isDeleted, setIsDeleded] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      const itemDetails = await getItemDetails(id, setItem,setIsBought, setIsDeleded);
      setItem(itemDetails);
    };
    fetchItem();
  }, [id]);

 /* if(isBought){
    setTimeout(()=>{
      navigate("../HomePage", { state: { username: username } });
    }, 3000);
    return <div>Item is already sold!</div>
  }
  if(isDeleted){
    setTimeout(()=>{
      navigate("../HomePage", { state: { username: username } });
    }, 3000);
    return <div>Item is deleted by the seller.</div>
  }*/

  /*if (item === null) {
    return <div>Loading...</div>
  }*/

 
  const NotValidItem = () => {
    setTimeout(()=>{
      navigate("../HomePage", { state: { username: username } });
    }, 1800);
    return (
      <div className="modal">
        <div className="modal-content">
          {isBought && <h3>The item is already sold!</h3>}
          {isDeleted && <h3>The item is deleted by the seller.</h3>}
        </div>
      </div>
    );
  };

  return (
    <>
      {(isBought || isDeleted) && (
        <NotValidItem/>
      )}
      {(!isBought && !isDeleted && item !== null) && (
      <><NavigationBar username={username}/>
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
      </>)}
    </>
  );
};

export default ItemPage;