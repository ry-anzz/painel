import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import "./CardAdd.css";

const CardAdd = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    imagem_url: "",
    destaque: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const uploadImage = async () => {
    if (!imageFile) return "";
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { data, error } = await supabase.storage
      .from("peinelImg")
      .upload(fileName, imageFile);

    if (error) {
      console.error("Erro ao fazer upload da imagem:", error.message);
      return "";
    }

    return data?.path
      ? supabase.storage.from("peinelImg").getPublicUrl(data.path).data
          .publicUrl
      : "";
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || !imageFile) {
      setErrorMessage(
        "Por favor, preencha todos os campos obrigatórios (Nome, Tipo, Categoria e Imagem)."
      );
      setSuccessMessage("");
      return;
    }

    setErrorMessage("");

    const imageUrl = await uploadImage();

    const productToInsert = {
      ...newProduct,
      imagem_url: imageUrl,
    };

    const { data, error } = await supabase
      .from("produtos")
      .insert([productToInsert]);

    if (error) {
      console.error("Erro ao adicionar produto:", error.message);
      setSuccessMessage("");
      setErrorMessage(
        "Opa! Houve um erro ao adicionar o produto. Tente novamente."
      );
    } else {
      console.log("Produto adicionado com sucesso:", data);
      setNewProduct({
        name: "",
        price: "",
        category: "",
        imagem_url: "",
        destaque: false,
      });
      setImageFile(null);
      setSuccessMessage("Produto cadastrado com sucesso!");
    }
  };

  return (
    <div className="card-add-container">
      <h1>Adicionar Novo Produto</h1>
      <button onClick={() => navigate("/")}>Voltar para a Home</button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form className="product-form">
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            placeholder="Nome"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Preço</label>
          <input
            type="text"
            id="price"
            placeholder="Preço"
            value={newProduct.price}
            onChange={(e) => {
              const value = e.target.value.replace(",", ".");
              setNewProduct({ ...newProduct, price: value });
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoria</label>
          <select
            id="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            required
          >
            {/* Bebidas */}
            <optgroup label="Bebidas">
              <option>Escolha uma categoria...</option>
              <option value="DESTILADOS">Destilados</option>
              <option value="LICOR">Licor</option>
              <option value="CACHAÇA">Cachaça</option>
              <option value="CERVEJA">Cervejas</option>
              <option value="ENERGETICOS">Energéticos</option>
              <option value="VINHO">Vinhos</option>
              <option value="WHISKYS">Whiskys</option>
              <option value="ESPECIARIAS">Especiarias</option>
              <option value="FARDO-GELADO">Fardo-Gelado</option>
              <option value="FARDO-QUENTE">Fardo-Quente</option>
              <option value="ESPUMANTES">Espumantes</option>
              <option value="VODKAS">Vodkas</option>
              <option value="BEBIDAS NAO ALCOÓLICAS">
                Bebidas Não Alcoólicas
              </option>
              <option value="REFRIGERANTES">Refrigerantes</option>
              <option value="AGUA">Águas</option>
              <option value="SUCO">Sucos</option>
            </optgroup>

            {/* Mercearia e Alimentos */}
            <optgroup label="Mercearia e Alimentos">
              <option value="MERCEARIA">Mercearia</option>
              <option value="PADARIA">Padaria</option>
              <option value="FRIOS E LATICINIOS">Frios & Laticínios</option>
              <option value="DOCES E BISCOITOS">
                Doces & Biscoitos (Removido)
              </option>
              <option value="DOCES">Doces</option>
              <option value="DOCES E BISCOITOS">Biscoitos Doces</option>
              <option value="BISCOITOS SALGADOS">Biscoitos Salgados</option>
              <option value="HIGIENE E LIMPEZA">
                Higiene & Limpeza (Removido)
              </option>
              <option value="HIGIENE">Higiene</option>
              <option value="LIMPEZA">Limpeza</option>
              <option value="CONGELADOS">Congelados</option>
            </optgroup>

            {/* Outros */}
            <optgroup label="Outros">
              <option value="SORVETES">Sorvetes</option>
              <option value="CIGARROS">Cigarros</option>
              <option value="GELO">Gelos</option>
              <option value="KITSEPROMOCOES">Kits e Promoções</option>
              <option value="PROMOÇÕES E BEBIDAS">Promoções e Bebidas</option>
              <option value="PETSHOP">Petshop</option>
            </optgroup>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Imagem</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="destaque">Destaque</label>
          <select
            id="destaque"
            value={newProduct.destaque ? "sim" : "nao"}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                destaque: e.target.value === "sim",
              })
            }
          >
            <option value="nao">Não</option>
            <option value="sim">Sim</option>
          </select>
        </div>

        <button type="button" onClick={addProduct}>
          Adicionar Produto
        </button>
      </form>
    </div>
  );
};

export default CardAdd;
