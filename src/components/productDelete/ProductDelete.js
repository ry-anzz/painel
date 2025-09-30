import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './ProductDelete.css';

const ProductDelete = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  const fetchProdutos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase.from('produtos').select('*').order('name');
      if (error) throw new Error(error.message);
      if (data) {
        setProdutos(data);
        const categoriasUnicas = [...new Set(data.map(p => p.category))].sort();
        setCategorias(categoriasUnicas);
      }
    } catch (error) {
      console.error('Erro ao carregar os produtos:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const deletarProduto = async (id, nomeProduto) => {
    try {
      const confirmar = window.confirm(`Tem a certeza que deseja excluir o produto "${nomeProduto}"?`);
      if (!confirmar) return;

      const { error } = await supabase.from('produtos').delete().eq('id', id);
      if (error) throw new Error(`Erro ao excluir produto: ${error.message}`);

      alert(`Produto "${nomeProduto}" excluído com sucesso!`);
      fetchProdutos(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir o produto. Verifique as permissões (RLS) no Supabase.');
    }
  };

  const produtosFiltrados = produtos.filter((produto) => {
    const matchesName = produto.name.toLowerCase().includes(filtro.toLowerCase());
    const matchesCategoria = categoriaFiltro ? produto.category === categoriaFiltro : true;
    return matchesName && matchesCategoria;
  });

  if (carregando) {
    return <p className="loading-message">A carregar produtos...</p>;
  }

  return (
    <div className="admin-layout">
        {/* --- Barra Lateral para Filtros --- */}
        <aside className="admin-sidebar">
            <h2>Filtros</h2>
            <input
                type="text"
                placeholder="Filtrar por nome..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="filtro-input-sidebar"
            />
            <h3>Categorias</h3>
            <div className="botoes-categorias">
                <button
                    onClick={() => setCategoriaFiltro('')}
                    className={`botao-categoria ${categoriaFiltro === '' ? 'active' : ''}`}
                >
                    Todas
                </button>
                {categorias.map((categoria) => (
                    <button
                        key={categoria}
                        onClick={() => setCategoriaFiltro(categoria)}
                        className={`botao-categoria ${categoriaFiltro === categoria ? 'active' : ''}`}
                    >
                        {categoria.replace('-', ' ').replace('E', ' & ')}
                    </button>
                ))}
            </div>
            <button onClick={() => navigate('/')} className="botao-home">Voltar para Home</button>
        </aside>

        {/* --- Conteúdo Principal com a Grelha de Produtos --- */}
        <main className="admin-main-content">
            <h1>Excluir Produtos ({produtosFiltrados.length})</h1>
            {produtosFiltrados.length > 0 ? (
                <div className="produtos-grid-admin">
                    {produtosFiltrados.map((produto) => (
                        <div className="produto-card-admin" key={produto.id}>
                            <img className="produto-imagem-admin" src={produto.imagem_url} alt={produto.name} />
                            <div className="produto-info-admin">
                                <h3>{produto.name}</h3>
                                <p className="produto-categoria-admin">{produto.category}</p>
                                <p className="produto-preco-admin">R${produto.price.toFixed(2)}</p>
                                <button
                                    onClick={() => deletarProduto(produto.id, produto.name)}
                                    className="botao-excluir"
                                >
                                    Excluir Produto
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhum produto encontrado com os filtros atuais.</p>
            )}
        </main>
    </div>
  );
};

export default ProductDelete;