import { useEffect, useState } from "react";
import axios from 'axios';
import "./App.css";

function App() {

   const [data, setData] = useState([]);

   useEffect(() => {
      
      axios.get('/api/github')
      .then((response) => {

         setData(response.data);
      })
      .catch((error) => {

         console.log(error);
      })

   });
   
   return (
      <>
      <h2>First Frontend application with backend.</h2>

      <p>Fetch Data from custom created backend.</p>

      <h3>Github Data</h3>

      <h4>Length of Data: {data.length}</h4>

      <div>
         {
            data.map((detail, index) => {          
               
               // explicitly return data

               return <div key={detail.id}>
                  <p>
                     User: {detail.user.id}
                     &nbsp; &nbsp; 
                     Login with: {detail.user.login}
                  </p>
               </div>
            })
         }
      </div>
      </>
   );

}

export default App;
