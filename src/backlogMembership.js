import {useState} from 'react';
import useFetch from './useFetch.js';
import CreateMember from './helpers/createMember.js';
import SecondNavigation from './nav2.js';
import Navigation from './nav.js';
import CreateIndividualSavingsAccum from './helpers/createIndividualSavingAccum.js';
import CreateWithdrawals from './helpers/createWithdrawals.js';
import CreateWithdrawalsAccum from './helpers/createWithdrawalsAccum.js';
const BacklogMembership = () =>{
    const [applicantName,setApplicantName] = useState('');
    const [staffNumber,setStaffNumber] = useState('');
    const [district,setDistrict] = useState('');
    const [telephone, setTelephone] = useState('');
    const [monthlySavings,setMonthlySavings] = useState('');
    const [witnessName, setWitnessName] = useState('');
    const [witnessContact, setWitnessedContact] = useState('');
    const [nomineeName1,setNomineeName1] = useState('');
    const [nomineeName2,setNomineeName2] = useState('');
    const [nomineeName3,setNomineeName3] = useState('');
    const [nRelationship1,setNRelationship1] = useState('');
    const [nRelationship2,setNRelationship2] = useState('');
    const [nRelationship3, setNRelationship3] = useState('');
    const [nPercentage1,setNPercentage1] = useState('');
    const [nPercentage2,setNPercentage2] = useState('');
    const [nPercentage3,setNPercentage3] = useState('');
    const [negativeNumber,setNegativeNumber] = useState(null);
    const {data:members} = useFetch('http://localhost:8060/Members');
    const [error,setError] = useState(null);
    const [staffNumberExists, setStaffNumberExists] = useState(null);
    const [totalSavingsMade,setTotalSavingsMade] = useState('');
    const [totalWithdrawals, setTotalWithdrawals] = useState('')
    const [dateStarted,setDateStarted] = useState('');
    const [currentSavingsAmount, setCurrentSavingsAmount] = useState('');
    const handleSubmit = (e) =>{
e.preventDefault();
let dateTime = new Date();
let time = dateTime.toISOString().split('T')[1];
let date = dateTime.toISOString().split('T')[0];
let searchCounter = 0;
if(members && members.length !== 0)
{
    members.forEach((member)=>{
        if(member.staffNumber.toLowerCase() === staffNumber.toLowerCase())
        {
             searchCounter = searchCounter + 1;
        }
    })
    if(searchCounter === 0)
    {
        if(nPercentage1 < 0 || nPercentage2 < 0 || nPercentage3 < 0 || monthlySavings < 0 || totalSavingsMade < 0 || totalWithdrawals < 0|| currentSavingsAmount < 0)
        {
            setNegativeNumber(true);
        }
        else{
        //save member
        setNegativeNumber(null);
        setError(null);
        const member = new CreateMember(applicantName,staffNumber,district,telephone,currentSavingsAmount,witnessName,witnessContact,nomineeName1,nomineeName2,nomineeName3,nRelationship1,nRelationship2,nRelationship3,nPercentage1,nPercentage2,nPercentage3,dateStarted,time,false);
             
        //send to the database.
        fetch('http://localhost:8060/Members',{
            method: 'POST',
            headers: {"Content-type": "Application/json"},
            body: JSON.stringify(member)
        }).then(()=>{
            const backLogWithdrawer = new CreateWithdrawalsAccum(applicantName,staffNumber,district,telephone,Number(totalWithdrawals),currentSavingsAmount,false);

              const individualSaver = new CreateIndividualSavingsAccum(applicantName,staffNumber,district,telephone,Number(totalSavingsMade)-Number(totalWithdrawals),"",false);
/*               const individualWithdrawer = new CreateWithdrawals(applicantName,staffNumber,district,telephone,total)
 */              fetch('http://localhost:8060/individualSavingsAccum',{
                  method: "POST",
                  headers: {"Content-type":"Application/json"},
                  body: JSON.stringify(individualSaver)
                  }) 
                  
                  fetch('http://localhost:8060/withdrawalsAccum',{
                        method: "POST",
                        headers: {"Content-type":"Application/json"},
                        body: JSON.stringify(backLogWithdrawer)
                        })   

                  
            window.location.reload();
        }).catch((err)=>{
            setError(err.message);
        })
        }
    }
    else
    {
        setStaffNumberExists(true);
        setNegativeNumber(null);
        setError(null);
    }
    }
    else{
        if(nPercentage1 < 0 || nPercentage2 < 0 || nPercentage3 < 0 || monthlySavings < 0)
        {
            setNegativeNumber(true);
        }
        else
        {
            setNegativeNumber(null);
            setError(null);
            const member = new CreateMember(applicantName,staffNumber,district,telephone,currentSavingsAmount,witnessName,witnessContact,nomineeName1,nomineeName2,nomineeName3,nRelationship1,nRelationship2,nRelationship3,nPercentage1,nPercentage2,nPercentage3,dateStarted,time,false);

            fetch('http://localhost:8060/Members',{
                method: 'POST',
                headers: {"Content-type": "Application/json"},
                body: JSON.stringify(member)
            }).then(()=>{
                const backLogWithdrawer = new CreateWithdrawalsAccum(applicantName,staffNumber,district,telephone,Number(totalWithdrawals),"",false);
                const individualSaver = new CreateIndividualSavingsAccum(applicantName,staffNumber,district,telephone,Number(totalSavingsMade)-Number(totalWithdrawals),"",false);
                fetch('http://localhost:8060/individualSavingsAccum',{
                     method: "POST",
                     headers: {"Content-type":"Application/json"},
                     body: JSON.stringify(individualSaver)
                     })   


                     fetch('http://localhost:8060/withdrawalsAccum',{
                        method: "POST",
                        headers: {"Content-type":"Application/json"},
                        body: JSON.stringify(backLogWithdrawer)
                        })   

                window.location.reload();
            }).catch((err)=>{
                setError(err.message);

            })
        
        }
    }
      
    }
    return(
        <div className = "membership-form">
            <SecondNavigation/>
            <Navigation/>
            <h1>Backlog M<span>e</span>mb<span>ers</span>hi<span>p F</span>o<span>r</span>m</h1>
            {error && <p className = "error">Server error, restart the server.</p>}
            {staffNumberExists&& <p className = "error">Staff number already exists.</p>}
            {negativeNumber&&<p className = "error">Negative number detected.</p>}
            <form onSubmit = {handleSubmit}>                
                <fieldset className = "field-set">
                    <legend className = "header-2">Applicant</legend>
                    <label className = "label-style">Applicants Name</label>
                    <input type = "text" value = {applicantName} onChange = {(e)=>setApplicantName(e.target.value)} required/>
                    <label className = "label-style">Staff Number</label>
                    <input type = "text" value = {staffNumber} onChange = {(e)=>setStaffNumber(e.target.value)} required/>

            
                    <label className = "label-style">District/Station</label>
                    <input type = "text" value = {district} onChange = {(e)=>setDistrict(e.target.value)} required/>
    
                    <label className = "label-style">Telephone</label>
                    <input type = "text" value = {telephone} onChange = {(e)=>setTelephone(e.target.value)} required/>
            
                    <label className = "label-style">Total Savings Made</label>
                    <input type = "number" value = {totalSavingsMade} onChange = {(e)=>setTotalSavingsMade(e.target.value)}/>
                    <label className = "label-style">Total Withdrawals Made</label>
                    <input type = "number" value = {totalWithdrawals} onChange = {(e)=>setTotalWithdrawals(e.target.value)}/>
                    <label className = "label-style">Current monthly savings</label>
                    <input type = "number" value = {currentSavingsAmount} onChange = {(e)=>setCurrentSavingsAmount(e.target.value)}/>
                    <label className = "label-style">Date in the format(year(2023)-month(01)-day(26))</label>
                    <input type = "text" value = {dateStarted} onChange = {(e)=>setDateStarted(e.target.value)}required/>
                

                </fieldset>
                <fieldset className = "nominee-field">

                <legend className = "header-2">Nominee</legend>
                <table>
                    <thead>
                    <tr>
                    <th>S/No</th>
                    <th>Name</th>
                    <th>Relationship</th>
                    <th>Percentage</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1.</td>
                        <td><input type = "text" value = {nomineeName1} onChange = {(e)=>setNomineeName1(e.target.value)} required/></td>
                        <td><input type = "text" value = {nRelationship1} onChange = {(e)=>setNRelationship1(e.target.value)} required/></td>
                        <td><input type = "number" value = {nPercentage1} onChange = {(e)=>setNPercentage1(e.target.value)} required/></td>
                    </tr>
                    <tr>
                    <td>2.</td>
                        <td><input type = "text" value = {nomineeName2} onChange = {(e)=>setNomineeName2(e.target.value)}/></td>
                        <td><input type = "text" value = {nRelationship2} onChange = {(e)=>setNRelationship2(e.target.value)}/></td>
                        <td><input type = "number" value = {nPercentage2} onChange = {(e)=>setNPercentage2(e.target.value)}/></td>
                    </tr>
                    <tr>
                    <td>3.</td>
                        <td><input type = "text" value = {nomineeName3} onChange = {(e)=>setNomineeName3(e.target.value)}/></td>
                        <td><input type = "text" value = {nRelationship3} onChange = {(e)=>setNRelationship3(e.target.value)}/></td>
                        <td><input type = "number" value = {nPercentage3} onChange = {(e)=>setNPercentage3(e.target.value)}/></td>
                    </tr>
                    </tbody>
                
                </table>
                
                    <label>Witnessed Name</label>
                    <input type = "text" value = {witnessName} onChange = {(e)=>setWitnessName(e.target.value)} required/>
                
                    <label>Witness Contact</label>
                    <input type = "text" value = {witnessContact} onChange = {(e)=>setWitnessedContact(e.target.value)} required/>

                </fieldset>
                <div className = "button">
                <button className = "register-button">Register Member</button>
                </div>
            </form>
        </div>
    )
}
export default BacklogMembership;