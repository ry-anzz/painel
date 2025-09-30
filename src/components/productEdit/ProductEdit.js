import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import "./ProductEdit.css";

const ProductEdit = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const navigate = useNavigate();

  // Estado para armazenar todas as categorias únicas
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .order("name");
        if (error) throw new Error(error.message);
        if (data) {
          setProdutos(data);
          // Extrai e armazena as categorias únicas dos produtos carregados
          const categoriasUnicas = [
            ...new Set(data.map((p) => p.category)),
          ].sort();
          setCategorias(categoriasUnicas);
        }
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
      } finally {
        setCarregando(false);
      }
    };
    fetchData();
  }, []);
  const produtosFiltrados = produtos.filter((produto) => {
    const matchesName = produto.name
      .toLowerCase()
      .includes(filtro.toLowerCase());
    const matchesCategoria = categoriaFiltro
      ? produto.category === categoriaFiltro
      : true;
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
            onClick={() => setCategoriaFiltro("")}
            className={`botao-categoria ${
              categoriaFiltro === "" ? "active" : ""
            }`}
          >
            Todas
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaFiltro(categoria)}
              className={`botao-categoria ${
                categoriaFiltro === categoria ? "active" : ""
              }`}
            >
              {categoria.replace("-", " ").replace("E", " & ")}
            </button>
          ))}
        </div>
        <button onClick={() => navigate("/")} className="botao-home">
          Voltar para Home
        </button>
      </aside>

      {/* --- Conteúdo Principal com a Grelha de Produtos --- */}
      <main className="admin-main-content">
        <h1>Editar Produtos ({produtosFiltrados.length})</h1>
        {produtosFiltrados.length > 0 ? (
          <div className="produtos-grid-admin">
            {produtosFiltrados.map((produto) => (
              <div className="produto-card-admin" key={produto.id}>
                <img
                  className="produto-imagem-admin"
                  src={produto.imagem_url}
                  alt={produto.name}
                />
                <div className="produto-info-admin">
                  <h3>{produto.name}</h3>
                  <p className="produto-categoria-admin">{produto.category}</p>
                  <p className="produto-preco-admin">
                    R${produto.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => navigate(`/modificar/${produto.id}`)}
                    className="botao-atualizar"
                  >
                    Editar Produto
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

export default ProductEdit;
