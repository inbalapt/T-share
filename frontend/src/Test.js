import NavigationBar from "./NavigationBar";
import Item from "./Item";
import logo from './logo.jpg'
function Test() {
    return (
        <>
        <NavigationBar></NavigationBar>

        
        <Item
        id="1"
        photo={logo}
        seller="John Doe"
        price="50"
        description="A beautiful dress"
        />
      
      </>
      
    );
  };
  
  export default Test;
  