import {Component} from "react"
import {BrowserRouter as Router,Routes , Route} from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"
import Products from "./components/Products"
import CartContext from "./context/CartContext"
import ProductItemDetails from "./components/ProductItemDetails"
import Cart from "./components/Cart"
import NotFound from "./components/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

class App extends Component {
  state = {
    cartList: [],
    }

    addCartItem = product => {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    }

    deleteCartItem = (id) => {

      //const updatedCartList=cartList.filter(cart=>cart.id!==id)
      this.setState(prevState=>({cartList : [...prevState.cartList.filter(cart=>cart.id!==id)]}))
    }
  render(){
    const {cartList}=this.state
    // console.log(cartList)
    
  return(
    <Router>
      <CartContext.Provider
          value={{
            cartList,
            addCartItem: this.addCartItem,
            deleteCartItem: this.deleteCartItem,
          }}
        >
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
            <Route path="/products" element={<ProtectedRoute><Products/></ProtectedRoute>}/>
            <Route path="/productsList/:id" element={<ProtectedRoute><ProductItemDetails/></ProtectedRoute>}/>
            <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
      </CartContext.Provider>
    </Router>

  )
}
}

export default App
