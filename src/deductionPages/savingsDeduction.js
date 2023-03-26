import useFetch from '../useFetch.js';
import { useHistory } from "react-router-dom";
import {useState,useEffect} from 'react';
import CreateIncomes from "../helpers/createIncomes";
import Navigation from '../nav.js';
import SecondNavigation from '../nav2.js';
import CreateStepIncomes from '../helpers/createStepIncomes.js';
import jsPDF from 'jspdf';
import CreateIndividualSavings from '../helpers/createIndividualSavings.js';
import graLogo from '../images/gra.png';
import CreateIndividualSavingsAccum from '../helpers/createIndividualSavingAccum.js';
const SavingsDeductions = () =>{
  const [prompt,setPrompt] = useState(null);
  const [checkboxError,setCheckboxError] = useState(null);
  const [date,setDate] = useState('');
  const [numberSavings,setNumberSavings] = useState('');
  const [totalSavingsAmount,setTotalSavingsAmount] = useState('');
  const [filteredMembers,setFilteredMembers] = useState([]);
  const [showOk,setShowOk] = useState(true);
    const history = useHistory();
    const {data: members} = useFetch('http://localhost:8060/members');
    const {data: incomes} = useFetch('http://localhost:8060/incomes');
    const { data: savingsAccum } = useFetch('http://localhost:8060/individualSavingsAccum');
     useEffect(()=>{
      let dateTime = new Date();
      let time = dateTime.toISOString().split('T')[1];
      let date = dateTime.toISOString().split('T')[0];
      if(members)
      {
        let filteredMembers = members.filter((member)=>member.dropout !== true);
      setNumberSavings(filteredMembers.length);
let totalSavingsAmount = 0;
filteredMembers.forEach((member)=>{
  totalSavingsAmount = totalSavingsAmount + Number(member.monthlySavings);
}
)
setTotalSavingsAmount(totalSavingsAmount);
setFilteredMembers(filteredMembers);

      }
      setDate(date);
     },[members])
     const handlePrompt = () =>{
         setPrompt(true);
     }
   /*  const handleIndividualSavings = () =>{
      if(members)
      {
        members.forEach((member)=>{
          console.log(member);
           fetch('http://localhost:8060/individualSavings',{
            method: "POST",
            headers: {"Content-type": "Application/json"},
            body: JSON.stringify(member)
           })   
        })
     
      }
    } */
    const handlePrintDeductionsOnly = () =>{
      const doc = new jsPDF("p","pt","a4");
      doc.html(document.querySelector('.savings-deductions'),{
        callback: function(pdf){
          pdf.save("SavingsDeductions.pdf");
        }
      }
      );

    }
    const handlePrintDeductions = (e) =>{
      e.preventDefault();
       const doc = new jsPDF("p","pt","a4");
      doc.html(document.querySelector('.savings-deductions'),{
        callback: function(pdf){
          pdf.save("SavingsDeductions.pdf");
        }
      }
      ) ; 
      let dateTime = new Date();
      let time = dateTime.toISOString().split('T')[1];
      let date = dateTime.toISOString().split('T')[0];
      //After deduction there will be an income.
      let cumulativeSavings = 0;
      if(members)
      {
        setShowOk(false);
         
          if(savingsAccum.length === 0)
          {
            //create new individual savings accum.
            members.forEach((member)=>{
              let isAccum = new CreateIndividualSavingsAccum(member.appName,member.staffNumber,member.district,member.telephone,member.monthlySavings,"",false);
             
              fetch('http://localhost:8060/individualSavingsAccum',{
              method: "POST",
              headers: {"Content-type": "Application/json"},
              body: JSON.stringify(isAccum)
             }).then(()=>{
              
             })   
          })
       
            setPrompt(null);
          }
          else if(savingsAccum.length !== members.length)
          {
            let staffExists = 0;
            members.forEach((member)=>{
          
               for(let i = 0; i < savingsAccum.length; i++)
              {
            
                 if(member.staffNumber === savingsAccum[i].staffNumber)
                 {
                  
                      staffExists = 1;
                
                 }
      
      
              } 

               if(staffExists === 0)
              {
              let isAccum = new CreateIndividualSavingsAccum(member.appName,member.staffNumber,member.district,member.telephone,member.monthlySavings,"",false);
               fetch('http://localhost:8060/individualSavingsAccum',{
              method: "POST",
              headers: {"Content-type": "Application/json"},
              body: JSON.stringify(isAccum)
             }).then(()=>{
            
             }
             ) 
            }
              staffExists = 0;
            }).then(()=>{
              
            }) 
             setPrompt(null);
          }
          else if(savingsAccum.length !== 0)
          {

            
              //look for the id's and patch the accumulations.
              let id = 1;
            for(let i = 0; i < savingsAccum.length; i++)
            {
             
              
              fetch('http://localhost:8060/individualSavingsAccum/'+id,{
                  method: "PATCH",
                  headers: {"Content-type":"Application/json"},
                  body: JSON.stringify({
                     totalSavings: Number(savingsAccum[i].totalSavings)+Number(members[i].monthlySavings),
                  })
                }
              )
              id = id + 1;
            }
          }
          filteredMembers.forEach((member)=>{
              let is = new CreateIndividualSavings(member.appName,member.staffNumber,member.district,member.telephone,member.monthlySavings,date,time);
             
              fetch('http://localhost:8060/individualSavings',{
              method: "POST",
              headers: {"Content-type": "Application/json"},
              body: JSON.stringify(is)
             })   
          })
       
        
        members.forEach((member)=>{      
          cumulativeSavings = cumulativeSavings + Number(member.monthlySavings);

        })
       if(incomes.length === 0)
       {
        let income = new CreateIncomes(cumulativeSavings);
          fetch('http://localhost:8060/incomes',{
           method: "POST",
           headers: {"Content-type": "Application/json"},
           body: JSON.stringify(income)
         }).then(()=>{
          
         
            
             }) 
           
          let stepIncome = new CreateStepIncomes(date,time,cumulativeSavings);
       fetch('http://localhost:8060/stepIncomes',{
        method: "POST",
        headers: {"Content-type": "Application/json"},
        body: JSON.stringify(stepIncome)
       }).then(()=>{
        setPrompt(null);
       }) 
       }
       else
       {
              let existingIncome = 0;
              incomes.forEach((income)=>{
                existingIncome = existingIncome + Number(income.income);
              })
              let overallIncome = cumulativeSavings + existingIncome;
              let income = new CreateIncomes(overallIncome);

                fetch('http://localhost:8060/incomes/'+1,{
          method: "PUT",
          headers: {"Content-type": "Application/json"},
          body: JSON.stringify(income)
        }).then(()=>{
             
             //Set individual savings.
    
             
                  
          
           
        })
      
         let stepIncome = new CreateStepIncomes(date,time,cumulativeSavings);
       fetch('http://localhost:8060/stepIncomes',{
        method: "POST",
        headers: {"Content-type": "Application/json"},
        body: JSON.stringify(stepIncome)
       }).then(()=>{
              
       })   
       }
    
  
        
      }
    
      

     
    }
    const handleClose = () =>{
      setPrompt(null);
      window.location.reload();
    }
    
   
    return (
        <div className = "loan-deductions-wrapper">
          
{/*         {successPrompt && <SuccessPrompt message = "Monthly savings have been successfully deducted." handleSuccessClose = {handleSuccessClose}/>}
 */}        {prompt && <div className = "prompt-dialog-background">
          <div onClick = {handleClose} className = "prompt-dialog-close">
            <span className = "bar"></span>
            <span className = "bar"></span>
            <span className = "bar"></span>

            </div>
           <form className = "prompt-dialog" onSubmit = {handlePrintDeductions}>
            {checkboxError && <p className = "error">Please select one.</p>}
            <p className = "prompt-message">This operation can be hardly reversed. However, quickly contact developer if reversal is needed.</p>
            
             <div className = "ok-flex">
          
            {showOk && <button className = "ok">Ok</button>}
            {!showOk && <button className = "ok-disabled" disabled>Ok</button>}
            </div>
            </form>  
        </div>
}
<button onClick = {handlePrompt} className = "print-deductions">Generate PDF and Deduct</button>
<button onClick = {handlePrintDeductionsOnly} className = "print-deductions">Generate PDF Only</button>


      <div className = "savings-deductions">
      <img className = "gra-logo" src = {graLogo} alt = "gra-icon"/>

      <h2 className = "loan-deduction-header">ALL MONTHLY SAVINGS DEDUCTIONS {date}</h2>

          {
            members && filteredMembers && <table>
                <thead> 
                    <tr>
                        <th>STAFF ID</th>
                        <th>FULL NAME</th>
                        <th>AMOUNT</th>
                    </tr>
                   
                </thead>
                <tbody>
                        {filteredMembers.map((member)=>(
                            <tr>
                            <td>{member.staffNumber}</td>
                            <td>{member.appName}</td>
                            <td>{member.monthlySavings}cedis</td>
                           </tr>
                        ))}
                       
                    </tbody>
            </table>
          }
          <div className = "row-flex-savings">
          <strong>Total:</strong>
          <p className = "savers">{numberSavings}</p>
          <p className = "total-savings-amount">{totalSavingsAmount}cedis</p>
          </div>
      </div>
      </div>
    )
  }
  export default SavingsDeductions;