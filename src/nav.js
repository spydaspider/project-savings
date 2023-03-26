import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Store from './helpers/storage';
import { useState, useEffect } from 'react';


import graIcon from './images/gra.png';
const Navigation = () =>{
   const history = useHistory();

   const [logged, setLogged] = useState(false);

   useEffect(()=>{
      let log = Store.getLocalStorage('log');
      console.log(log.logged);
      if(log.logged === true || (localStorage.getItem('log') !== null))
      {
        
        setLogged(log.logged);
        
      }
   
      
   },[])

  
   const toLogin = () =>{
      history.push('/');
   }
   const handleLogout =()=>{
      let logData = Store.getLocalStorage('log');
      logData.logged = false;
      localStorage.setItem('log',JSON.stringify(logData));
      history.push('/');
     /*  window.location.reload(); */
  }
    const navLinkStyles = ({ isActive }) =>{
      return{
         backgroundColor: isActive ? 'blue':'',
         textDecoration: isActive ? 'underline':'none',
      }
    }    
   return(
    <header>
      <div className = "container">
      <NavLink to = "/search"> <img className = "gra-icon" src = {graIcon} alt = "gra icon"/></NavLink>

   
    <nav>
      {logged &&(
        <div className = "links">
        <NavLink style = {navLinkStyles} to = "/membership">Membership</NavLink>
        <NavLink style = {navLinkStyles} to = "/backlogEntries">BacklogEntries</NavLink>        

        <NavLink style = {navLinkStyles} to = "/search">Search</NavLink>
{/*         <NavLink style = {navLinkStyles} to = "/beneficiaries">Beneficiaries</NavLink>
 */}       
{/*   <NavLink style = {navLinkStyles} to = "/loans">Loans</NavLink>
 */}        
        <NavLink style = {navLinkStyles} to = "/deductions">Deductions</NavLink>
{/*         <NavLink style = {navLinkStyles} to = "/hirePurchase">Purchase</NavLink>

 */}
           
        <span onClick = {handleLogout} className = "log-style">logout</span>
 
      
 </div>
      )}
      {!logged &&  <span onClick = {toLogin} className = "login-style">login</span>}
        </nav>
        </div>
      
    </header>
   )
}
export default Navigation;