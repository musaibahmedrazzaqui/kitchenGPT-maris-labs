import React from "react";
import Chatbot from "./IngredientForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1 style={{fontSize:'35px',fontStyle:"bold",margin:'auto',marginLeft:'22%',alignItems:'center',justifyContent:'center',alignSelf:'center'}}>Pharmaceutical Drug Review Chatbot</h1>
      {/* <h3 style={{fontSize:'15px',margin:'auto',marginLeft:'15px',alignItems:'center',justifyContent:'center',alignSelf:'center',color:"white"}}>PHARMACEUTICAL DRUG REVIEW CHATBOT</h3> */}
      <Chatbot />
      <h3 style={{fontSize:'15px',margin:'auto',marginLeft:'15px',alignItems:'center',justifyContent:'center',alignSelf:'center',color:"white"}}>For research purposes. The chatbot is made from a dataset for research purposes only to study the effect of incororporating user-generated data while training chatbots.</h3>
    </div>
  );
}

export default App;
