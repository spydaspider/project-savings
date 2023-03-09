import useFetch from "./useFetch";
import {useState,useEffect} from "react";
const ShowWithdrawals = ({staffNumber}) =>{
    const {data:individualSavings,error} = useFetch('http://localhost:8060/withdrawals');
    const {data: netSavings} = useFetch('http://localhost:8060/withdrawals');
    const { data: withdrawalAccum } = useFetch('http://localhost:8060/withdrawalsAccum');
     const [filteredIS,setFilteredIS] = useState([]);
     const [totalSavings,setTotalSavings] = useState('');
     const [netSaving, setNetSaving] = useState('');
     const [totalAmountWithdrawn,setTotalAmountWithdrawn] = useState('');
     useEffect(()=>{
        if(individualSavings)
        {
            let totalSavings = 0;
            let netBalance = 0;

            if(withdrawalAccum)
            {

               withdrawalAccum.forEach((ns)=>{
                  if((ns.staffNumber === staffNumber))
                  {
                    netBalance = Number(ns.totalWithdrawals);
                  }
               })
               
               setNetSaving(netBalance);

               
            }
            

         let filteredIs = individualSavings.filter((is)=>is.staffNumber === staffNumber);
         setFilteredIS(filteredIs);
         filteredIS.forEach((fis)=>{
             totalSavings = totalSavings + Number(fis.withdrawalAmount);
         })
         setTotalSavings(totalSavings);
        }
     },[individualSavings])
return(
       
    <div className = "show-is">
       {individualSavings && filteredIS && <h1 className = "total-savings-title">All Savings made by applicant</h1>}
         <div className = "total-savings">
                        <span className = "tsa">Gross Amount Withdrawn: {netSaving && Number(netSaving).toFixed(2)}cedis</span>

                    </div>
    <table>
                        <thead>
                           <tr>
                            <th>Applicant Name</th>
                            <th>Staff Number</th>
                            <th>District</th>
                            <th>Telephone</th>
                            <th>Amount Withdrawn</th>
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
                                <td>{Number(fis.withdrawalAmount).toFixed(2)}cedis</td>
                                <td>{fis.date}</td>
                                <td>{fis.time}</td>
                            </tr>
                            ))}

                        </tbody>
                    </table>
                   
    </div>
)
}
export default ShowWithdrawals;