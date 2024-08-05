import { Link } from "react-router-dom";

export default function AmazonAds() {
  return (
    <div className="Amazon-container">
      <div className="sale-banner">
        <img src="https://m.media-amazon.com/images/G/31/Laptops_AugArt24_T3/Dell_NonG_1500X300._CB568309026_.jpg"></img>
      </div>
      <div className="Product-container">
        <img src="https://static.vecteezy.com/system/resources/previews/014/018/563/non_2x/amazon-logo-on-transparent-background-free-vector.jpg"></img>
        <Link target="_blank" to="https://amzn.to/3WAuxXo">Get offer</Link>
      </div>
    </div>
  );
}
