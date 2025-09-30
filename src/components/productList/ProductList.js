import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import "./ProductList.css"; // Certifique-se que este ficheiro existe e tem o nome correto

const ProductList = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState(""); // Começa vazio para mostrar tudo
  const navigate = useNavigate();

  // Lista de todas as categorias possíveis para os botões de filtro
  const todasAsCategorias = [
    "DESTILADOS",
    "LICOR",
    "CACHAÇA",
    "CERVEJA",
    "ENERGETICOS",
    "VINHO",
    "WHISKYS",
    "ESPECIARIAS",
    "FARDO-GELADO",
    "FARDO-QUENTE",
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
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCarregando(true);
        let query = supabase.from("produtos").select("*");

        // Se uma categoria específica for selecionada, filtra no banco de dados
        if (categoriaFiltro) {
          query = query.eq("category", categoriaFiltro);
        }

        const { data, error } = await query;

        console.log("Dados recebidos do Supabase:", data); // Linha de diagnóstico

        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
      } finally {
        setCarregando(false);
      }
    };
    fetchData();
  }, [categoriaFiltro]); // A busca é refeita sempre que o filtro de categoria muda
  // A filtragem por nome agora é feita na lista que já veio do Supabase
  const produtosFiltrados = produtos.filter((produto) =>
    produto.name.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleCategoriaFiltro = (categoria) => {
    // Se clicar na mesma categoria, limpa o filtro. Senão, define o novo filtro.
    setCategoriaFiltro((prevFiltro) =>
      prevFiltro === categoria ? "" : categoria
    );
  };

  return (
    <div className="product-list-container">
      <h1>Lista de Todos os Produtos</h1>     {" "}
      <button onClick={() => navigate("/")}>Voltar para Home</button>     {" "}
      <div className="search-and-filter-container">
               {" "}
        <input
          type="text"
          placeholder="Filtrar produtos por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filter-input"
        />
               {" "}
        <div className="category-buttons-wrapper">
          {/* Botão para limpar o filtro e mostrar tudo */}
          <button
            className={`category-button ${
              categoriaFiltro === "" ? "active" : ""
            }`}
            onClick={() => handleCategoriaFiltro("")}
          >
            Todas as Categorias
          </button>
          {todasAsCategorias.map((categoria) => (
            <button
              key={categoria}
              className={`category-button ${
                categoriaFiltro === categoria ? "active" : ""
              }`}
              onClick={() => handleCategoriaFiltro(categoria)}
            >
              {categoria.replace("-", " ").replace("E", " & ")}
            </button>
          ))}
                 {" "}
        </div>
      </div>
           {" "}
      {carregando ? (
        <p>A carregar produtos...</p>
      ) : produtosFiltrados.length > 0 ? (
        <div className="produtos-grid">
          {produtosFiltrados.map((produto) => (
            <div className="produto-card" key={produto.id}>
              <img
                className="produto-imagem"
                src={produto.imagem_url}
                alt={produto.name}
              />
              <div className="produto-info">
                <h3>{produto.name}</h3>
                <p className="produto-categoria">
                  Categoria: {produto.category}
                </p>
                <p className="produto-preco">
                  Preço: R${parseFloat(produto.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum produto encontrado com os filtros atuais.</p>
      )}
         {" "}
    </div>
  );
};

export default ProductList;
