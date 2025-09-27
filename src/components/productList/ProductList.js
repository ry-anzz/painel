import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';
import './ProductList.css';

const ProductList = ({ adicionarAoCarrinho }) => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState(''); // Valor pré-definido como vazio
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('produtos').select('*');
        if (error) throw new Error(error.message);
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
      } finally {
        setCarregando(false);
      }
    };
    fetchData();
  }, []);
 
  const produtosFiltrados = produtos.filter(produto => {
    const matchesName = produto.name.toLowerCase().includes(filtro.toLowerCase());
    const matchesCategoria = categoriaFiltro ? produto.category.toLowerCase() === categoriaFiltro.toLowerCase() : true;
    return matchesName && matchesCategoria;
  });

  const categorias = produtosFiltrados.reduce((acc, produto) => {
    if (!acc[produto.category]) acc[produto.category] = [];
    acc[produto.category].push(produto);
    return acc;
  }, {}); 

  
  const handleCategoriaFiltro = (categoria) => {
    setCategoriaFiltro(categoria);
  };

  return (
    <div className="container-banner">
      <button onClick={() => navigate('/')}>
        Voltar para Home
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filtrar produtos..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            width: '50%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div className='button-div' style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>

<button onClick={() => handleCategoriaFiltro('DESTILADOS')}>Destilados</button>
<button onClick={() => handleCategoriaFiltro('LICOR')}>Licor</button>
<button onClick={() => handleCategoriaFiltro('CACHAÇA')}>Cachaça</button>
<button onClick={() => handleCategoriaFiltro('CERVEJA')}>Cervejas</button>
<button onClick={() => handleCategoriaFiltro('ENERGETICOS')}>Energéticos</button>
<button onClick={() => handleCategoriaFiltro('VINHO')}>Vinhos</button>
<button onClick={() => handleCategoriaFiltro('WHISKYS')}>Whiskys</button>
<button onClick={() => handleCategoriaFiltro('ESPECIARIAS')}>Especiarias</button>
<button onClick={() => handleCategoriaFiltro('FARDO-GELADO')}>Fardo Gelado</button>
<button onClick={() => handleCategoriaFiltro('FARDO-QUENTE')}>Fardo Quente</button>
<button onClick={() => handleCategoriaFiltro('BEBIDAS NAO ALCOÓLICAS')}>Bebidas Não Alcoólicas</button>
<button onClick={() => handleCategoriaFiltro('MERCEARIA')}>Mercearia</button>
<button onClick={() => handleCategoriaFiltro('PADARIA')}>Padaria</button>
<button onClick={() => handleCategoriaFiltro('FRIOS E LATICINIOS')}>Frios & Laticinios</button>
<button onClick={() => handleCategoriaFiltro('DOCES')}>Doces</button>
<button onClick={() => handleCategoriaFiltro('DOCES E BISCOITOS')}>Biscoitos Doces</button>
<button onClick={() => handleCategoriaFiltro('BISCOITOS SALGADOS')}>Biscoitos Salgados</button>
<button onClick={() => handleCategoriaFiltro('HIGIENE E LIMPEZA')}>Higiene & Limpeza</button> {/* --TIRAR */}
<button onClick={() => handleCategoriaFiltro('HIGIENE')}>Higiene</button>
<button onClick={() => handleCategoriaFiltro('LIMPEZA')}>Limpeza</button>
<button onClick={() => handleCategoriaFiltro('ESPUMANTES')}>Espumantes</button>
<button onClick={() => handleCategoriaFiltro('GELO')}>Gelos</button>
<button onClick={() => handleCategoriaFiltro('SORVETES')}>Sorvetes</button>
<button onClick={() => handleCategoriaFiltro('CIGARROS')}>Cigarros</button>
<button onClick={() => handleCategoriaFiltro('CONGELADOS')}>Congelados</button>
<button onClick={() => handleCategoriaFiltro('KITSEPROMOCOES')}>Kits e Promoções</button>
<button onClick={() => handleCategoriaFiltro('PROMOCÕES E BEBIDAS')}>Promoções e Bebidas</button>
<button onClick={() => handleCategoriaFiltro('PETSHOP')}>Petshop</button>
      </div>

      {carregando ? (
        <p>Carregando produtos...</p>
      ) : Object.keys(categorias).length > 0 ? (
        Object.keys(categorias).map((categoria) => (
          <div className='protudosCards' key={categoria} style={{ textAlign: 'center' }}>
            <h2 className="categoria-titulo">{categoria}</h2>
            <div className="produtos-container">
              {categorias[categoria].map((produto, index) => (
                <div className="produto-card" key={index}>
                  <img className="produto-imagem" src={produto.imagem_url} alt={produto.name} />
                  <div className="produto-info">
                    <h3>{produto.name}</h3>
                    <p>Preço: R${parseFloat(produto.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );
};

export default ProductList;
