import React, { useMemo, useState } from 'react';
import { ArrowRight, Calculator, CheckCircle2, Clock3, MapPin, MessageCircle, Package, Phone, Search, ShieldCheck, Truck, Weight } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const LOGO = '/rapi10-logo.svg';
// Imagem oficial completa da Rapi10. O arquivo é servido diretamente pelo GitHub para evitar falha/canvas branco no Vercel.
const MAIN_IMAGE = 'https://raw.githubusercontent.com/Alexsandrolima255300/Rapi10/main/public/rapi10-main.webp?v=3';

function App() {
  const [form, setForm] = useState({ origin: 'Uberaba - MG', destination: 'Uberlândia - MG', weight: '', length: '', width: '', height: '', volume: '1', invoice: '' });
  const [result, setResult] = useState(null);
  const cubage = useMemo(() => {
    const l = Number(form.length) || 0, w = Number(form.width) || 0, h = Number(form.height) || 0, v = Number(form.volume) || 1;
    return l && w && h ? (l * w * h * v) / 6000 : 0;
  }, [form.length, form.width, form.height, form.volume]);
  function update(key, value) { setForm((f) => ({ ...f, [key]: value })); }
  function calculate(e) {
    e.preventDefault();
    const weight = Number(form.weight) || 0;
    const invoice = Number(String(form.invoice).replace(',', '.')) || 0;
    const chargeable = Math.max(weight, cubage * 300);
    const base = chargeable > 0 ? 85 + chargeable * 1.35 : 85;
    const insurance = invoice > 0 ? invoice * 0.003 : 0;
    setResult({ total: base + insurance, chargeable, cubage, estimate: 'Prazo sob consulta' });
  }
  function whatsapp() {
    const text = encodeURIComponent('Olá! Gostaria de solicitar uma cotação de frete com a Rapi10.');
    window.open(`https://wa.me/5534999724769?text=${text}`, '_blank', 'noopener,noreferrer');
  }
  return <div className="site">
    <header className="header"><div className="container nav"><a className="brand" href="#inicio"><img src={LOGO} alt="Rapi10 Encomendas e Serviços" /></a><nav><a href="#cotacao">Cotação</a><a href="#servicos">Serviços</a><a href="#rastreamento">Rastreamento</a><a href="#sobre">Sobre nós</a><a href="#contato">Contato</a></nav><button className="nav-whatsapp" onClick={whatsapp}><MessageCircle size={17}/> WhatsApp</button></div></header>
    <main>
      <section id="inicio" className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span></span> Transporte regional com agilidade</div><h1>Seu frete. <em>Rápido.</em><br/>Do jeito que precisa.</h1><p>Calcule uma estimativa de frete em poucos passos e fale diretamente com a Rapi10 para confirmar sua cotação.</p><div className="hero-actions"><a href="#cotacao" className="primary">Calcular meu frete <ArrowRight size={19}/></a><button className="secondary" onClick={whatsapp}><MessageCircle size={19}/> Falar no WhatsApp</button></div><div className="trust"><div><CheckCircle2/> Atendimento regional</div><div><ShieldCheck/> Carga com cuidado</div><div><Clock3/> Agilidade</div></div></div><div className="hero-card"><img className="official-main-image" src={MAIN_IMAGE} alt="Rapi10 Encomendas e Serviços — Uberaba e Uberlândia" decoding="async"/><div className="route"><div><small>ORIGEM</small><strong>Uberaba <b>MG</b></strong></div><ArrowRight/><div><small>DESTINO</small><strong>Uberlândia <b>MG</b></strong></div></div></div></div></section>
      <section id="cotacao" className="quote-section"><div className="container quote-grid"><div className="section-heading"><div className="icon-box"><Calculator/></div><span>COTAÇÃO ONLINE</span><h2>Calcule seu frete</h2><p>Preencha os dados da carga. O valor exibido é uma <strong>estimativa</strong> e deve ser confirmado pela Rapi10 antes da contratação.</p><div className="quote-note"><CheckCircle2 size={17}/> Sem cadastro para simular</div><div className="quote-note"><ShieldCheck size={17}/> Cotação sujeita à validação operacional</div></div><form className="quote-card" onSubmit={calculate}><div className="form-top"><div><span>01</span><strong>Origem e destino</strong></div><MapPin size={20}/></div><div className="fields two"><label>Origem<input value={form.origin} onChange={e=>update('origin',e.target.value)} placeholder="Cidade - UF"/></label><label>Destino<input value={form.destination} onChange={e=>update('destination',e.target.value)} placeholder="Cidade - UF"/></label></div><div className="form-top"><div><span>02</span><strong>Dados da carga</strong></div><Package size={20}/></div><div className="fields three"><label>Peso (kg)<input type="number" min="0.01" step="0.01" value={form.weight} onChange={e=>update('weight',e.target.value)} placeholder="0,00" required/></label><label>Volumes<input type="number" min="1" value={form.volume} onChange={e=>update('volume',e.target.value)}/></label><label>Valor NF (R$)<input value={form.invoice} onChange={e=>update('invoice',e.target.value)} placeholder="0,00"/></label></div><div className="fields three"><label>Comprimento (cm)<input type="number" min="0" value={form.length} onChange={e=>update('length',e.target.value)} placeholder="0"/></label><label>Largura (cm)<input type="number" min="0" value={form.width} onChange={e=>update('width',e.target.value)} placeholder="0"/></label><label>Altura (cm)<input type="number" min="0" value={form.height} onChange={e=>update('height',e.target.value)} placeholder="0"/></label></div>{cubage > 0 && <div className="cubage">Cubagem calculada: <strong>{cubage.toFixed(3)} m³</strong></div>}<button className="calculate" type="submit"><Calculator size={19}/> Calcular estimativa <ArrowRight size={18}/></button>{result && <div className="result"><div><small>ESTIMATIVA DE FRETE</small><strong>R$ {result.total.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><span>Base demonstrativa • confirmação necessária</span></div><div className="result-meta"><span><Weight/> Peso considerado: {result.chargeable.toFixed(1)} kg</span><span><Clock3/> {result.estimate}</span></div><button type="button" onClick={whatsapp}><MessageCircle/> Solicitar esta cotação</button></div>}</form></div></section>
      <section id="servicos" className="services"><div className="container"><div className="center-heading"><span>SOLUÇÕES RAPI10</span><h2>Transporte sem complicação.</h2><p>Uma operação próxima, prática e focada no que realmente importa: sua carga chegar bem.</p></div><div className="service-grid"><article><Truck/><h3>Encomendas</h3><p>Transporte de encomendas para empresas e particulares na região.</p></article><article><Package/><h3>Coletas</h3><p>Organize sua coleta e combine os detalhes diretamente com nossa equipe.</p></article><article><Search/><h3>Rastreamento</h3><p>Consulte o status da sua entrega com o código fornecido pela Rapi10.</p><button className="text-button" onClick={()=>document.getElementById('rastreamento')?.scrollIntoView({behavior:'smooth'})}>Consultar rastreio <ArrowRight size={16}/></button></article></div></div></section>
      <section id="rastreamento" className="tracking"><div className="container tracking-inner"><div><span>ACOMPANHE SUA CARGA</span><h2>Rastreamento</h2><p>Digite seu código para consultar. A integração com o sistema operacional da Rapi10 será conectada na próxima etapa.</p></div><form onSubmit={e=>{e.preventDefault();alert('Consulta de rastreamento preparada. Conectaremos ao sistema da Rapi10 na próxima etapa.')}}><Search/><input placeholder="Código de rastreio"/><button>Consultar</button></form></div></section>
      <section id="sobre" className="about"><div className="container about-grid"><div><span>RAPI10 • UBERABA</span><h2>De Uberaba para onde sua operação precisar.</h2></div><div><p>A Rapi10 Encomendas e Serviços atua no transporte regional, atendendo laboratórios, autopeças, refrigeração, oficinas, empresas e particulares.</p><p className="address"><MapPin size={18}/> Av. João XXIII, 765 — Uberaba/MG</p></div></div></section>
    </main>
    <footer id="contato"><div className="container footer"><div className="footer-brand"><img src={LOGO} alt="Rapi10"/><p>Encomendas e serviços com agilidade.</p></div><div><span>CONTATO</span><a href="tel:+5534999724769"><Phone size={16}/> (34) 99972-4769</a><a href="https://wa.me/5534999724769"><MessageCircle size={16}/> WhatsApp</a></div><div><span>ENDEREÇO</span><p>Av. João XXIII, 765<br/>Uberaba — MG</p></div></div><div className="copyright">© 2026 Rapi10 Encomendas e Serviços. Todos os direitos reservados.</div></footer>
  </div>
}
createRoot(document.getElementById('root')).render(<App />);
