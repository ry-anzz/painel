import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';
import './ProductEditForm.css'; // Importa o arquivo CSS, se necessário

const ProductEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState({
    name: '',
    price: '',
    tipo: '',
    category: '',
    imagem_url: '',
    destaque: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw new Error(error.message);
        setProduto(data);
      } catch (error) {
        console.error('Erro ao carregar o produto:', error);
      } finally {
        setCarregando(false);
      }
    };
    fetchProduct();
  }, [id]);

  const uploadImage = async () => {
    if (!imageFile) return produto.imagem_url;  // Não altera a URL se nenhuma imagem for selecionada.
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { data, error } = await supabase.storage
      .from('peinelImg')
      .upload(fileName, imageFile);

    if (error) {
      console.error("Erro ao fazer upload da imagem:", error.message);
      return produto.imagem_url;
    }

    return data?.path ? supabase.storage.from('peinelImg').getPublicUrl(data.path).data.publicUrl : produto.imagem_url;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prevProduto) => ({
      ...prevProduto,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dados para atualizar:", produto); // Exibe os dados que serão enviados para Supabase

    try {
      const imageUrl = await uploadImage();  // Faz o upload da imagem antes de enviar

      const { data, error } = await supabase
        .from('produtos')
        .update({
          name: produto.name,
          price: parseFloat(produto.price), // Certifique-se de que price está em formato numérico
          tipo: produto.tipo,
          category: produto.category,
          imagem_url: imageUrl,
          destaque: produto.destaque,
        })
        .eq('id', id);

      if (error) throw new Error(error.message);

      console.log("Resposta do Supabase:", data); // Exibe a resposta do Supabase

      alert('Produto atualizado com sucesso!');
      navigate('/'); // Redireciona para a página inicial após a atualização
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
      alert('Erro ao atualizar o produto');
    }
  };

  const handleGoHome = () => {
    navigate('/'); // Redireciona para a página inicial quando o botão "Home" é clicado
  };

  if (carregando) return <p>Carregando produto...</p>;

  return (
    <div className="container">
      <h2>Editar Produto</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={produto.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Preço:
          <input
            type="number"
            name="price"
            step="0.01"
            value={produto.price}
            onChange={handleChange}
          />
        </label>
       
        <label>
          Categoria:
          <select
            name="category"
            value={produto.category}
            onChange={handleChange}
          >

{/* Bebidas */}
<optgroup label="Bebidas">
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
  <option value="BEBIDAS NAO ALCOÓLICAS">Bebidas Não Alcoólicas</option>
  <option value="REFRIGERANTES">Refrigerantes</option>
  <option value="AGUA">Águas</option>
  <option value="SUCO">Sucos</option>
</optgroup>

{/* Mercearia e Alimentos */}
<optgroup label="Mercearia e Alimentos">
  <option value="MERCEARIA">Mercearia</option>
  <option value="PADARIA">Padaria</option>
  <option value="FRIOS E LATICINIOS">Frios & Laticínios</option>
  <option value="DOCES E BISCOITOS">Doces & Biscoitos (Removido)</option>
  <option value="DOCES">Doces</option>
  <option value="DOCES E BISCOITOS">Biscoitos Doces</option>
  <option value="BISCOITOS SALGADOS">Biscoitos Salgados</option>
  <option value="HIGIENE E LIMPEZA">Higiene & Limpeza (Removido)</option>
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
        </label>
        <label>
          URL da Imagem:
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        <label>
          Destaque:
          <select
            name="destaque"
            value={produto.destaque ? "sim" : "nao"}
            onChange={(e) => setProduto({ ...produto, destaque: e.target.value === "sim" })}
          >
            <option value="nao">Não</option>
            <option value="sim">Sim</option>
          </select>
        </label>
        <button type="submit" className="button-atualizar">Atualizar Produto</button>
      </form>
      <button onClick={handleGoHome} className="button-home">Voltar para Home</button>
    </div>
  );
};

export default ProductEditForm;
