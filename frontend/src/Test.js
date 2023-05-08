import NavigationBar from "./NavigationBar";
import Item from "./Item";
import logo from './logo.jpg'
import ItemScrollPage from "./ItemScrollPage";
import { Link } from 'react-router-dom';
//import dressPic from "./pictures/dresses.png"

function Test() {
    /*
    let categories = {Dresses: {image: logo},
                        Tops: {image: logo},
                        Skirts: {image: logo},
                        Pants: {image: logo}};
                        */

let items =  [{id:"1", photo:{logo}, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"1", photo:{logo}, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"2", photo:{logo}, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"3", photo:{logo}, seller:"John Doe", price:"50", description:"A beautiful dress"},
{id:"4", photo:{logo}, seller:"John Doe", price:"50", description:"A beautiful dress"}]
    return (
        <>
        <Link
        to={{
          pathname: `/clothing/dresses`,
          state: { items: items },
        }}
      ></Link>
    <ItemScrollPage items={items}></ItemScrollPage>
      
      
      </>
      
    );
  };
  
  export default Test;

  /*
   <NavigationBar></NavigationBar>

        
        <Item
        id="1"
        photo={logo}
        seller="John Doe"
        price="50"
        description="A beautiful dress"
        />

        */