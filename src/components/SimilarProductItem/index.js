import './index.css'

const SimilarProductItem = props => {
  const {similarProducts} = props

  const {brand, imageUrl, price, rating, title} = similarProducts

  return (
    <li className="listItemContainer">
      <div className="container">
        <img
          src={imageUrl}
          alt={`similar product ${title}`}
          className="similarImg"
        />
        <h1 className="title">{title}</h1>
        <p className="para">by {brand}</p>
        <div className="lastContainer">
          <p className="cost">Rs {price}</p>
          <div className="btnContainer1">
            <p className="ratingPara">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
