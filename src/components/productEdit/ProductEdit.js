import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';
import './ProductEdit.css';

const ProductEdit = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');
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

  const produtosFiltrados = produtos.filter((produto) => {
    const matchesName = produto.name.toLowerCase().includes(filtro.toLowerCase());
    const matchesCategory = produto.category.toLowerCase().includes(filtro.toLowerCase());
    return matchesName || matchesCategory;
  });

  // Dividindo os produtos filtrados por categoria
  const categoriasFiltradas = produtos.reduce((acc, produto) => {
    if (!acc[produto.category]) acc[produto.category] = [];
    acc[produto.category].push(produto);
    return acc;
  }, {});

  if (carregando) {
    return <p>Carregando produtos...</p>;
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="botao-home">Home</button>

      {/* Campo de filtro */}
      <input
        type="text"
        placeholder="Filtrar produtos..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="filtro-input"
      />

      {/* Botões de categoria */}
      <div className="botoes-categorias">
        {Object.keys(categoriasFiltradas).map((categoria) => (
          <button
            key={categoria}
            onClick={() => setFiltro(categoria)}
            className="botao-categoria"
          >
            {categoria}
          </button>
        ))}
        <button
          onClick={() => setFiltro('')}
          className="botao-categoria limpar-filtro"
        >
          Todos
        </button>
      </div>

      {/* Exibição das categorias e produtos */}
      {produtosFiltrados.length > 0 ? (
        Object.keys(categoriasFiltradas).map((categoria) => {
          const produtosDaCategoria = produtosFiltrados.filter(
            (produto) => produto.category === categoria
          );

          return (
            produtosDaCategoria.length > 0 && (
              <div key={categoria} style={{ textAlign: 'center', marginBottom: '30px' }}>
                {/* Nome da categoria */}
                <h2 className="categoria-titulo">{categoria}</h2>

                {/* Exibição dos produtos dentro da categoria */}
                <div className="produtos-container">
                  {produtosDaCategoria.map((produto) => (
                    <div className="produto-card" key={produto.id}>
                      <img className="produto-imagem" src={produto.imagem_url} alt={produto.name} />
                      <div className="produto-info">
                        <h3>{produto.name}</h3>
                        <p>Preço: R${produto.price.toFixed(2)}</p>
                        <button
                          onClick={() => navigate(`/modificar/${produto.id}`)}
                          className="botao-atualizar"
                        >
                          Atualizar Produto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          );
        })
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );
};

export default ProductEdit;
