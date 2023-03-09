import Navigation from "./nav";
import SecondNavigation from "./nav2";
const Withdrawal = () =>{
    return(
        <div className = "withdrawal-wrapper">
            <SecondNavigation/>
            <Navigation/>
            <div className = "withdrawal">
                <h1>Welcome to the withdrawals</h1>
            </div>
        </div>
    )

}
export default Withdrawal;