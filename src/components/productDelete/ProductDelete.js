import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./ProductDelete.css";

const ProductDelete = () => {
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
  ]; // 2. CORRIGIDO: O useEffect agora busca dados com base no filtro de categoria,

  // exatamente como no seu ProductList.js
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setCarregando(true);
        let query = supabase.from("produtos").select("*");

        if (categoriaFiltro) {
          query = query.eq("category", categoriaFiltro);
        }

        const { data, error } = await query.order("name"); // Adicionado .order('name')
        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
      } finally {
        setCarregando(false);
      }
    };
    fetchProdutos();
  }, [categoriaFiltro]); // A busca é refeita sempre que o filtro de categoria muda

  const deletarProduto = async (id, nomeProduto) => {
    // A sua função de apagar continua intacta
    try {
      const confirmar = window.confirm(
        `Tem a certeza que deseja excluir o produto "${nomeProduto}"?`
      );
      if (!confirmar) return;

      const { error } = await supabase.from("produtos").delete().eq("id", id);
      if (error) throw new Error(`Erro ao excluir produto: ${error.message}`);

      alert(`Produto "${nomeProduto}" excluído com sucesso!`); // A lista será atualizada automaticamente por causa do useEffect [categoriaFiltro]
      // Mas para garantir a remoção da categoria "Todas", chamamos fetchProdutos
      // Vamos simplificar:
      setProdutos(produtos.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert(
        "Erro ao excluir o produto. Verifique as permissões (RLS) no Supabase."
      );
    }
  };

  // 3. CORRIGIDO: A filtragem de produtos agora só precisa de filtrar por nome,
  // pois a filtragem de categoria já foi feita pelo Supabase
  const produtosFiltrados = produtos.filter((produto) => {
    const matchesName = produto.name
      .toLowerCase()
      .includes(filtro.toLowerCase());
    return matchesName;
  });

  // 4. ADICIONADO: A função para mudar o filtro
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
      {" "}
      <aside className="admin-sidebar">
        <h2>Filtros</h2>       {" "}
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
                        Todas          {" "}
          </button>
          {/* 5. CORRIGIDO: O map agora usa a lista fixa 'todasAsCategorias' */}
                   {" "}
          {todasAsCategorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => handleCategoriaFiltro(categoria)}
              className={`botao-categoria ${
                categoriaFiltro === categoria ? "active" : ""
              }`}
            >
                           {" "}
              {categoria.replace(/-/g, " ").replace(/\bE\b/g, " & ")}           {" "}
            </button>
          ))}
                 {" "}
        </div>
               {" "}
        <button onClick={() => navigate("/")} className="botao-home">
                    Voltar para Home        {" "}
        </button>
             {" "}
      </aside>
           {" "}
      <main className="admin-main-content">
                <h1>Excluir Produtos ({produtosFiltrados.length})</h1>       {" "}
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
                />{" "}
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
                    onClick={() => deletarProduto(produto.id, produto.name)}
                    className="botao-excluir"
                  >
                    Excluir Produto{" "}
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

export default ProductDelete;
