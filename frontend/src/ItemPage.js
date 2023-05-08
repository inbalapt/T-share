// src/components/ItemPage.js
import React from 'react';
import DetailsOfProduct from './DetailsOfProduct';
import NavigationBar from './NavigationBar';
import ImagesView from './ImagesView';
import logo from './logo.jpg'
import photo1 from './temp_clothes/photo1.jpg'
import photo2 from './temp_clothes/photo2.jpg'
import photo3 from './temp_clothes/photo3.jpg'
import photo4 from './temp_clothes/photo4.jpg'

import './ItemPage.css';
let item1 = {images: [photo1, photo2, photo3, photo4] , seller: "jon", description:"floweral dress" , price: "30" ,
 size: "s", collectionPoint: "tel aviv" , condition: "used" ,color: "multi" , brand: "zara"}

const ItemPage = ({ item }) => {
  item = item1
  return (
    <>
      <NavigationBar />
      <div className="item-page">
        <ImagesView images={item.images} />
        <DetailsOfProduct
          seller={item.seller}
          description={item.description}
          price={item.price}
          size={item.size}
          collectionPoint={item.collectionPoint}
          condition={item.condition}
          color={item.color}
          brand={item.brand}
        />
      </div>
    </>
  );
};

export default ItemPage;
