import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './AdminOfertas.css';

const AdminOfertas = () => {
    const [produtos, setProdutos] = useState([]);
    const [produtosEmOferta, setProdutosEmOferta] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [oferta, setOferta] = useState({ novo_preco_oferta: '', fim_oferta: '', estoque_oferta: '' });
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const fetchProdutos = async () => {
        // CORREÇÃO 1: A busca agora seleciona todos os dados ('*') dos produtos
        const { data, error } = await supabase.from('produtos').select('*').order('name');
        if (data) {
            setProdutos(data);
        } else {
            console.error("Erro ao buscar lista de produtos:", error);
        }
    };

    const fetchOfertas = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .not('fim_oferta', 'is', null)
            .gt('fim_oferta', new Date().toISOString())
            .order('fim_oferta', { ascending: true });

        if (data) setProdutosEmOferta(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProdutos();
        fetchOfertas();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOferta(prev => ({ ...prev, [name]: value }));
    };

    const handleCriarOferta = async (e) => {
        e.preventDefault();
        if (!produtoSelecionado || !oferta.novo_preco_oferta || !oferta.fim_oferta || !oferta.estoque_oferta) {
            setFeedback({ message: 'Preencha todos os campos da oferta.', type: 'error' });
            return;
        }

        // CORREÇÃO 2: A comparação agora usa '==' em vez de '===' para ignorar a diferença de tipo
        const produtoOriginal = produtos.find(p => p.id == produtoSelecionado);
        
        if (!produtoOriginal) {
            setFeedback({ message: 'Produto selecionado não foi encontrado na lista interna. Por favor, recarregue a página.', type: 'error' });
            return;
        }

        const { error } = await supabase
            .from('produtos')
            .update({
                price: parseFloat(oferta.novo_preco_oferta),
                preco_antigo: produtoOriginal.price,
                fim_oferta: new Date(oferta.fim_oferta).toISOString(),
                estoque_oferta: parseInt(oferta.estoque_oferta),
                estoque_vendido: 0
            })
            .eq('id', produtoSelecionado);

        if (error) {
            setFeedback({ message: `Erro ao criar oferta: ${error.message}`, type: 'error' });
        } else {
            setFeedback({ message: 'Produto colocado em oferta com sucesso!', type: 'success' });
            setOferta({ novo_preco_oferta: '', fim_oferta: '', estoque_oferta: '' });
            fetchProdutos(); // Atualiza a lista de produtos
            fetchOfertas(); // Atualiza a lista de ofertas ativas
        }
    };

    const handleRemoverOferta = async (produto) => {
        if(window.confirm(`Tem a certeza que deseja remover "${produto.name}" das ofertas? O preço voltará a ser R$ ${produto.preco_antigo.toFixed(2)}.`)) {
            const { error } = await supabase
                .from('produtos')
                .update({
                    price: produto.preco_antigo,
                    preco_antigo: null,
                    fim_oferta: null,
                    estoque_oferta: null,
                    estoque_vendido: 0
                })
                .eq('id', produto.id);
            
            if (error) {
                setFeedback({ message: `Erro ao remover oferta: ${error.message}`, type: 'error' });
            } else {
                setFeedback({ message: 'Produto removido da oferta com sucesso!', type: 'success' });
                fetchProdutos();
                fetchOfertas();
            }
        }
    };

    return (
        <div className="admin-page-container">
            <header className="admin-header">
                <h1>Gerir Ofertas Relâmpago</h1>
                <button onClick={() => navigate('/')}>Voltar ao Painel</button>
            </header>

            {feedback.message && (
                <p className={`feedback-message ${feedback.type}`}>{feedback.message}</p>
            )}

            <div className="admin-content-layout">
                <div className="form-section">
                    <h3>Colocar Produto em Oferta</h3>
                    <form onSubmit={handleCriarOferta} className="oferta-form">
                        <select value={produtoSelecionado} onChange={(e) => setProdutoSelecionado(e.target.value)} required>
                            <option value="">Selecione um Produto...</option>
                            {produtos.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input 
                            type="number" step="0.01" name="novo_preco_oferta"
                            placeholder="Novo Preço da Oferta (ex: 19.90)"
                            value={oferta.novo_preco_oferta} onChange={handleInputChange} required
                        />
                        <input 
                            type="datetime-local" name="fim_oferta"
                            value={oferta.fim_oferta} onChange={handleInputChange} required
                        />
                        <input 
                            type="number" name="estoque_oferta"
                            placeholder="Estoque para a oferta (ex: 50)"
                            value={oferta.estoque_oferta} onChange={handleInputChange} required
                        />
                        <button type="submit">Criar Oferta</button>
                    </form>
                </div>

                <div className="list-section">
                    <h3>Ofertas Ativas no Momento</h3>
                    {loading ? <p>A carregar...</p> : (
                        <ul className="ofertas-list">
                            {produtosEmOferta.map(p => (
                                <li key={p.id}>
                                    <div className="oferta-info">
                                        <img src={p.imagem_url} alt={p.name} />
                                        <div>
                                            <span className="oferta-nome-admin">{p.name}</span>
                                            <span className="oferta-detalhes">
                                                De R${p.preco_antigo.toFixed(2)} por R${p.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemoverOferta(p)} className="remove-btn">
                                        Remover
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOfertas;