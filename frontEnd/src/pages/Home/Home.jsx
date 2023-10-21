import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import MailList from "../../components/mailList/MailList";
import PropertyList from "../../components/propertyList/propertyList";
import Cookies from 'js-cookie';
import "./home.css";

function Home() {
    console.log(Cookies.get("access_token"));
    return (
        Cookies.get("access_token") ? (< div >
            <Navbar />
            <Header />
            <div className="homeContainer">
                <Featured />
                <h1 className="homeTitle">Browse by Property Type</h1>
                <PropertyList />
                <h1 className="homeTitle">Homes Guests Love</h1>
                <FeaturedProperties />
                <MailList />
                <Footer />
            </div>
        </div >) : <h1>You are not Authorized!</h1>
    );
}

export default Home;