import useFetch from "./useFetch";
import {useState,useEffect} from "react";
const ShowIndividualSavings = ({staffNumber}) =>{
    const {data:individualSavings,error} = useFetch('http://localhost:8060/individualSavings');
    const {data: members} = useFetch('http://localhost:8060/members');
    const {data: netSavings} = useFetch('http://localhost:8060/individualSavingsAccum');
     const [filteredIS,setFilteredIS] = useState([]);
     const [totalSavings,setTotalSavings] = useState('');
     const [netSaving, setNetSaving] = useState('');
     const [dateCommenced, setDateCommenced] = useState('');
     useEffect(()=>{
        if(individualSavings && members)
        {
            let totalSavings = 0;
            if(netSavings)
            {
               let netBalance;
               let dateCommenced;
               members.forEach((member)=>{
                if((member.staffNumber === staffNumber)&& (members.dropout !== true))
                {
                    dateCommenced = member.date;
                }
               })
               netSavings.forEach((ns)=>{
                  if((ns.staffNumber === staffNumber)&&(ns.dropout !== true))
                  {
                    netBalance = ns.totalSavings;
                  }
               })
               setNetSaving(netBalance);
               setDateCommenced(dateCommenced);
            }
            

         let filteredIs = individualSavings.filter((is)=>is.staffNumber === staffNumber);
         setFilteredIS(filteredIs);
         filteredIS.forEach((fis)=>{
             totalSavings = totalSavings + Number(fis.pledge);
         })
         setTotalSavings(totalSavings);
        }
     },[individualSavings])
return(
       
    <div className = "show-is">
       {individualSavings && filteredIS && <h1 className = "total-savings-title">All Savings made by applicant</h1>}
         <div className = "total-savings">
                        <span className = "tsa">Gross Savings Amount since: {Number(totalSavings).toFixed(2)}cedis</span>
                       {netSaving && <span className = "tsa">Net balance: {Number(netSaving).toFixed(2)}cedis</span>}
                       {!netSaving && <span className = "tsa">Net balance: 0.00cedis</span>}

                        <span className = "tsa">Date Commenced:  {dateCommenced}</span>
                    </div>
    <table>
                        <thead>
                           <tr>
                            <th>Applicant Name</th>
                            <th>Staff Number</th>
                            <th>District</th>
                            <th>Telephone</th>
                            <th>Monthly Savings</th>
                            <th>Date</th>
                            <th>Time</th>

                           </tr>
                        </thead>
                        <tbody>
                            { individualSavings && filteredIS && filteredIS.map((fis)=>(
                                <tr key = {fis.id}>
                                <td>{fis.appName}</td>
                                <td>{fis.staffNumber}</td>
                                <td>{fis.district}</td>
                                <td>{fis.telephone}</td>
                                <td>{Number(fis.pledge).toFixed(2)}cedis</td>
                                <td>{fis.date}</td>
                                <td>{fis.time}</td>
                            </tr>
                            ))}

                        </tbody>
                    </table>
                   
    </div>
)
}
export default ShowIndividualSavings;