// src/components/ProductDelete.js
import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import { useNavigate } from 'react-router-dom'; // Importa o hook de navegação
import './ProductDelete.css';

const ProductDelete = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate(); // Inicializa o hook de navegação

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

  const deletarProduto = async (id) => {
    try {
      const confirmar = window.confirm('Tem certeza que deseja excluir este produto?');
      if (!confirmar) return;

      const { data, error } = await supabase.from('produtos').delete().eq('id', id);
      if (error) throw new Error(`Erro ao excluir produto: ${error.message}`);

      setProdutos((produtosAnteriores) =>
        produtosAnteriores.filter((produto) => produto.id !== id)
      );
      alert('Produto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir o produto');
    }
  };

  const produtosFiltrados = produtos.filter((produto) =>
    produto.name.toLowerCase().includes(filtro.toLowerCase())
  );

  if (carregando) {
    return <p>Carregando produtos...</p>;
  }

  if (produtos.length === 0) {
    return <p>Nenhum produto encontrado.</p>;
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="botao-home">Home</button>
      <input
        type="text"
        placeholder="Filtrar produtos..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="filtro-input"
      />
      <div className="produtos-container">
        {produtosFiltrados.map((produto) => (
          <div className="produto-card" key={produto.id}>
            <img className="produto-imagem" src={produto.imagem_url} alt={produto.name} />
            <div className="produto-info">
              <h3>{produto.name}</h3>
              <p>Preço: R${produto.price.toFixed(2)}</p>
              <button onClick={() => deletarProduto(produto.id)} className="botao-excluir">
                Excluir Produto
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDelete;
