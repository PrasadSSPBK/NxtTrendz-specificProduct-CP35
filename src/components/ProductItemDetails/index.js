import {Component} from 'react'
import Cookies from 'js-cookie'
// import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  intial: 'INTIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetailsList: [],
    quantity: 1,
    similarProducts: [],
    apiStatus: apiStatusConstants.intial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    // const {productItemDetails} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        totalReviews: data.total_reviews,
        title: data.title,
      }
      const similarProductsList = data.similar_products.map(each => ({
        brand: each.brand,
        imageUrl: each.image_url,
        price: each.price,
        rating: each.rating,
        title: each.title,
        id: each.id,
      }))
      this.setState({
        productItemDetailsList: updatedData,
        similarProducts: similarProductsList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  plus = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  minus = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    } else {
      this.setState({quantity: 1})
    }
  }

  continueShoppingButton = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderSuccessView = () => {
    const {productItemDetailsList, quantity} = this.state
    const {
      title,
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      totalReviews,
    } = productItemDetailsList

    return (
      <div className="Container">
        <div className="mainContainer">
          <img src={imageUrl} alt="product" className="product" />
          <div className="secondContainer">
            <h1 className="head">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="reviewContainer">
              <div className="btnContainer">
                <p className="ratingPara">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviewPara">{totalReviews} Reviews</p>
            </div>
            <p className="descriptionPara">{description}</p>
            <p className="descriptionPara">
              <span className="availability">Availability</span>:{availability}
            </p>
            <p className="descriptionPara">
              <span className="availability">Brand</span>: {brand}
            </p>
            <hr />
            <hr className="line" />
            <div className="plusMinusContainer">
              <button
                type="button"
                testid="minus"
                className="plus"
                onClick={this.minus}
              >
                <BsDashSquare className="icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                testid="plus"
                className="plus"
                onClick={this.plus}
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button type="button" className="cartButton">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderLoaderView = () => (
    <div testid="loader" className="Loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view"
      />
      <h1 className="error-head">Product Not Found</h1>
      <button
        type="button"
        className="cartButton1"
        onClick={this.continueShoppingButton}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderSwitchCases = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderSuccessView()

      default:
        return null
    }
  }

  render() {
    const {similarProducts} = this.state

    return (
      <>
        <Header />
        {this.renderSwitchCases()}

        <ul className="ul">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              similarProducts={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </>
    )
  }
}
export default ProductItemDetails
