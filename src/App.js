import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Home from './components/Home'; 
import CardAdd from './components/cardAdd/CardAdd'; 
import ProductList from './components/productList/ProductList'; 
import ProductDelete from './components/productDelete/ProductDelete';
import ProductEdit from './components/productEdit/ProductEdit'; // Componente de edição
import ProductEditForm from './components/productEditForm/ProductEditForm';
import Imprimi from './components/imprimi/Imprimi';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>Painel de Gerenciamento - Depósito e Mercearia da Lagoa</h1>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adicionar" element={<CardAdd />} />
          <Route path="/lista" element={<ProductList />} />
          <Route path="/deletar" element={<ProductDelete />} />
          <Route path="/modificar/:id" element={<ProductEditForm />} /> {/* Formulário de edição */}
          <Route path="/atualizar" element={<ProductEdit />} /> {/* Lista com filtro e atualização */}
          <Route path='/imprimir' element={<Imprimi></Imprimi>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


