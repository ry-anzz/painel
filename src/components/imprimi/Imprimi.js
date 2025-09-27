import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Imprimi.css';

const Imprimi = () => {
  const [idPedido, setIdPedido] = useState('');
  const [pedido, setPedido] = useState(null);
  const [erro, setErro] = useState('');

  const buscarPedido = async () => {
    try {
      setErro('');
      setPedido(null);

      const pedidosCollection = collection(db, 'pedidos');
      const q = query(pedidosCollection, where('idPedido', '==', idPedido));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErro('Pedido não encontrado.');
      } else {
        const pedidoEncontrado = querySnapshot.docs[0].data();
        setPedido(pedidoEncontrado);
      }
    } catch (error) {
      setErro('Erro ao buscar o pedido.');
      console.error("Erro ao buscar o pedido: ", error);
    }
  };

  const imprimirPedido = () => {
    const conteudoImprimir = document.getElementById('pedidoImprimir');
    const janelaImpressao = window.open('', '', 'height=600,width=800');

    janelaImpressao.document.write('<html><head><title>Imprimir Pedido</title>');
    janelaImpressao.document.write('<style>/* Estilos para impressão */');
    janelaImpressao.document.write(`
      body { font-family: Arial, sans-serif; margin: 20px; }
      h3, h4 { color: #333; }
      p { font-size: 14px; color: #555; }
      ul { padding-left: 20px; }
      li { margin-bottom: 10px; }
    `);
    janelaImpressao.document.write('</style></head><body>');
    janelaImpressao.document.write(conteudoImprimir.innerHTML);
    janelaImpressao.document.write('</body></html>');
    janelaImpressao.document.close();
    janelaImpressao.print();
  };

  return (
    <div className="imprimi-container">
      <h2>Imprimir Nota Fiscal</h2>
      
      <div className="input-container">
        <label htmlFor="idPedido">ID do Pedido:</label>
        <input
          type="text"
          id="idPedido"
          value={idPedido}
          onChange={(e) => setIdPedido(e.target.value)}
          className="input-id-pedido"
        />
        <button onClick={buscarPedido} className="buscar-button">Buscar</button>
      </div>

      {erro && <p className="error-message">{erro}</p>}

      {pedido && (
        <div>
          <div id="pedidoImprimir" className="pedido-container">
            <h3>Pedido - ID: {pedido.idPedido}</h3>
            <h4>Cliente</h4>
            <p><strong>Nome:</strong> {pedido.cliente.nome}</p>
            <p><strong>Endereço:</strong> {pedido.cliente.endereco}, {pedido.cliente.rua}</p>
            <p><strong>Referência:</strong> {pedido.cliente.cep}</p>

            <p><strong>Data:</strong> {new Date(pedido.data).toLocaleString()}</p>

            <h4>Produtos</h4>
            <ul>
              {pedido.produtos.map((produto, index) => {
                const precoFormatado = produto.preco ? produto.preco.toFixed(2) : 'Preço não disponível';
                const totalProduto = produto.total || produto.preco * produto.quantidade;
                const totalFormatado = totalProduto ? totalProduto.toFixed(2) : 'Total não disponível';

                return (
                  <li key={index}>
                    <p><strong>Produto:</strong> {produto.nome}</p>
                    <p><strong>Preço:</strong> R${precoFormatado}</p>
                    <p><strong>Quantidade:</strong> {produto.quantidade}</p>
                    <p><strong>Total:</strong> R${totalFormatado}</p>
                  </li>
                );
              })}
            </ul>

            <h4>Total do Pedido</h4>
            <p><strong>Total: </strong>R${pedido.produtos.reduce((acc, produto) => {
              const totalProduto = produto.total || produto.preco * produto.quantidade;
              return acc + totalProduto;
            }, 0).toFixed(2)}</p>
          </div>

          <button onClick={imprimirPedido} className="imprimir-button">Imprimir Pedido</button>
        </div>
      )}
    </div>
  );
};

export default Imprimi;
