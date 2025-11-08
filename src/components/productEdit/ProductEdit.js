import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import "./ProductEdit.css";

const ProductEdit = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState(""); // Começa vazio para mostrar tudo
  const navigate = useNavigate(); // 1. A SUA LISTA DE CATEGORIAS FIXA (DO MODELO CORRETO)

  const todasAsCategorias = [
  "DESTILADOS",
    "LICOR",
    "CACHAÇA",
    "CERVEJA",
    "ENERGETICOS",
    "VINHO",
    "WHISKYS",
    "VODKAS",
    "ESPECIARIAS",
    "FARDO-GELADO",
    "FARDO-QUENTE",
    "REFRIGERANTES",
    "SUCOS",
    "AGUA",
    "BEBIDAS NAO ALCOÓLICAS",
    "MERCEARIA",
    "PADARIA",
    "FRIOS E LATICINIOS",
    "DOCES",
    "DOCES E BISCOITOS",
    "BISCOITOS SALGADOS",
    "HIGIENE",
    "LIMPEZA",
    "ESPUMANTES",
    "GELO",
    "SORVETES",
    "CIGARROS",
    "CONGELADOS",
    "KITSEPROMOCOES",
    "PROMOÇÕES E BEBIDAS",
    "PETSHOP",
  ]; // 2. O SEU USEEFFECT CORRETO (DO MODELO CORRETO)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCarregando(true);
        let query = supabase.from("produtos").select("*"); // Se uma categoria específica for selecionada, filtra no banco de dados

        if (categoriaFiltro) {
          query = query.eq("category", categoriaFiltro);
        }

        const { data, error } = await query.order("name");
        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
      } finally {
        setCarregando(false);
      }
    };
    fetchData();
  }, [categoriaFiltro]); // A busca é refeita sempre que o filtro de categoria muda // 3. O SEU FILTRO DE NOME CORRETO (DO MODELO CORRETO)

  const produtosFiltrados = produtos.filter((produto) =>
    produto.name.toLowerCase().includes(filtro.toLowerCase())
  ); // 4. A SUA FUNÇÃO DE FILTRO CORRETA (DO MODELO CORRETO)

  const handleCategoriaFiltro = (categoria) => {
    setCategoriaFiltro((prevFiltro) =>
      prevFiltro === categoria ? "" : categoria
    );
  };

  if (carregando) {
    return <p className="loading-message">A carregar produtos...</p>;
  }

  return (
    <div className="admin-layout">
     {/* --- Barra Lateral (O SEU LAYOUT ORIGINAL) --- */}{" "}
      <aside className="admin-sidebar">
                <h2>Filtros</h2>
               {" "}
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-input-sidebar"
        />
                <h3>Categorias</h3>       {" "}
        <div className="botoes-categorias">
                   {" "}
          <button
            onClick={() => handleCategoriaFiltro("")}
            className={`botao-categoria ${
              categoriaFiltro === "" ? "active" : ""
            }`}
          >
           Todas {" "}
          </button>
          {/* 5. O MAP CORRIGIDO (DO MODELO CORRETO) */}{" "}
          {todasAsCategorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => handleCategoriaFiltro(categoria)}
              className={`botao-categoria ${
                categoriaFiltro === categoria ? "active" : ""
              }`}
            >
             {" "}
              {categoria.replace(/-/g, " ").replace(/\bE\b/g, " & ")}{" "}
            </button>
          ))}
         {" "}
        </div>
      {" "}
        <button onClick={() => navigate("/")} className="botao-home">
         Voltar para Home {" "}
        </button>
       {" "}
      </aside>
       {/* --- Conteúdo Principal (O SEU LAYOUT ORIGINAL) --- */}{" "}
      <main className="admin-main-content">
       <h1>Editar Produtos ({produtosFiltrados.length})</h1>{" "}
        {produtosFiltrados.length > 0 ? (
          <div className="produtos-grid-admin">
           {" "}
            {produtosFiltrados.map((produto) => (
              <div className="produto-card-admin" key={produto.id}>
              {" "}
                <img
                  className="produto-imagem-admin"
                  src={produto.imagem_url}
                  alt={produto.name}
                />
              {" "}
                <div className="produto-info-admin">
                  <h3>{produto.name}</h3>{" "}
                  <p className="produto-categoria-admin">{produto.category}</p> 
                  {" "}
                  <p className="produto-preco-admin">
                   R${produto.price.toFixed(2)}
                    {" "}
                  </p>
                 {" "}
                  <button
                    onClick={() => navigate(`/modificar/${produto.id}`)}
                    className="botao-atualizar"
                  >
                    Editar Produto {" "}
                  </button>
                  {" "}
                </div>
                {" "}
              </div>
            ))}
           {" "}
          </div>
        ) : (
          <p>Nenhum produto encontrado com os filtros atuais.</p>
        )}
             {" "}
      </main>
         {" "}
    </div>
  );
};

export default ProductEdit;
