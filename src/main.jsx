import React, { useMemo, useState } from 'react';
import { ArrowRight, Calculator, CheckCircle2, Clock3, MapPin, MessageCircle, Package, Phone, Search, ShieldCheck, Truck, Weight } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const LOGO = '/rapi10-logo.svg';
const MAIN_IMAGE = 'https://images.pexels.com/photos/37674323/pexels-photo-37674323.jpeg?auto=compress&cs=tinysrgb&w=1600';
const ALLOWED_CITIES = ['Uberaba', 'Uberlândia'];

function App() {
  const [form, setForm] = useState({ origin: 'Uberaba - MG', destination: 'Uberlândia - MG', weight: '', length: '', width: '', height: '', volume: '1', invoice: '' });
  const [result, setResult] = useState(null);
  const cubage = useMemo(() => {
    const l = Number(form.length) || 0, w = Number(form.width) || 0, h = Number(form.height) || 0, v = Number(form.volume) || 1;
    return l && w && h ? (l * w * h * v) / 6000 : 0;
  }, [form.length, form.width, form.height, form.volume]);
  function update(key, value) { setForm((f) => ({ ...f, [key]: value })); }
  function cityFrom(value) { return value.split('-')[0].trim().toLowerCase(); }
  function calculate(e) {
    e.preventDefault();
    const weight = Number(form.weight) || 0;
    const invoice = Number(form.invoice) || 0;
    const origin = cityFrom(form.origin);
    const destination = cityFrom(form.destination);
    if (!weight || !invoice) return;
    if (!ALLOWED_CITIES.some(c => c.toLowerCase() === origin) || !ALLOWED_CITIES.some(c => c.toLowerCase() === destination) || origin === destination) {
      setResult({ error: 'No momento, atendemos apenas os trechos entre Uberaba e Uberlândia.' });
      return;
    }
    const insuredByRapi10 = invoice <= 3000;
    const total = insuredByRapi10 ? 50 + Math.max(0, weight - 30) * 0.50 : invoice * 0.05;
    setResult({ total, weight, invoice, insuredByRapi10, cubage, estimate: 'Prazo sob consulta', origin: form.origin, destination: form.destination, volume: Number(form.volume) || 1 });
  }
  function whatsapp() {
    if (!result || result.error) return;
    const text = encodeURIComponent(`Olá! Gostaria de solicitar minha coleta com a Rapi10.\n\nOrigem: ${result.origin}\nDestino: ${result.destination}\nPeso: ${result.weight.toLocaleString('pt-BR',{maximumFractionDigits:2})} kg\nVolumes: ${result.volume}\nValor da NF: R$ ${result.invoice.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}\nValor do frete: R$ ${result.total.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`);
    window.open(`https://wa.me/5534999724769?text=${text}`, '_blank', 'noopener,noreferrer');
  }
  return <div className="site">
    <header className="header"><div className="container nav"><a className="brand" href="#inicio"><img src={LOGO} alt="Rapi10 Encomendas e Serviços" /></a><nav><a href="#cotacao">Cotação</a><a href="#servicos">Serviços</a><a href="#rastreamento">Rastreamento</a><a href="#sobre">Sobre nós</a><a href="#contato">Contato</a></nav><button className="nav-whatsapp" onClick={whatsapp}><MessageCircle size={17}/> WhatsApp</button></div></header>
    <main>
      <section id="inicio" className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span></span> Transporte regional com agilidade</div><h1>Seu frete. <em>Rápido.</em><br/>Do jeito que precisa.</h1><p>Calcule seu frete em poucos passos e descubra as condições de transporte da Rapi10.</p><div className="hero-actions"><a href="#cotacao" className="primary">Calcular meu frete <ArrowRight size={19}/></a><button className="secondary" onClick={whatsapp}><MessageCircle size={19}/> Falar no WhatsApp</button></div><div className="trust"><div><CheckCircle2/> Atendimento regional</div><div><ShieldCheck/> Carga com cuidado</div><div><Clock3/> Agilidade</div></div></div><div className="hero-card"><div className="main-image-wrap"><img className="official-main-image" src={MAIN_IMAGE} alt="Caminhão verde de transporte Rapi10" decoding="async" loading="eager"/><div className="truck-brand-overlay"><img src={LOGO} alt="Rapi10"/></div></div><div className="route"><div><small>ORIGEM</small><strong>Uberaba <b>MG</b></strong></div><ArrowRight/><div><small>DESTINO</small><strong>Uberlândia <b>MG</b></strong></div></div></div></div></section>
      <section id="cotacao" className="quote-section"><div className="container quote-grid"><div className="section-heading"><div className="icon-box"><Calculator/></div><span>COTAÇÃO ONLINE</span><h2>Calcule seu frete</h2><p>Informe os dados da sua carga e receba sua cotação de forma rápida.</p><div className="quote-note"><CheckCircle2 size={17}/> Notas fiscais até R$ 3.000: a Rapi10 assegura.</div></div><form className="quote-card" onSubmit={calculate}><div className="form-top"><div><span>01</span><strong>Origem e destino</strong></div><MapPin size={20}/></div><div className="fields two"><label>Origem<input value={form.origin} onChange={e=>update('origin',e.target.value)} placeholder="Uberaba - MG ou Uberlândia - MG"/></label><label>Destino<input value={form.destination} onChange={e=>update('destination',e.target.value)} placeholder="Uberaba - MG ou Uberlândia - MG"/></label></div><div className="form-top"><div><span>02</span><strong>Dados da carga</strong></div><Package size={20}/></div><div className="fields three"><label>Peso (kg)<input type="number" min="0.01" step="0.01" value={form.weight} onChange={e=>update('weight',e.target.value)} placeholder="0,00" required/></label><label>Volumes<input type="number" min="1" value={form.volume} onChange={e=>update('volume',e.target.value)}/></label><label>Valor da NF (R$)<input type="number" min="0.01" step="0.01" value={form.invoice} onChange={e=>update('invoice',e.target.value)} placeholder="0,00" required/></label></div><div className="fields three"><label>Comprimento (cm)<input type="number" min="0" value={form.length} onChange={e=>update('length',e.target.value)} placeholder="0"/></label><label>Largura (cm)<input type="number" min="0" value={form.width} onChange={e=>update('width',e.target.value)} placeholder="0"/></label><label>Altura (cm)<input type="number" min="0" value={form.height} onChange={e=>update('height',e.target.value)} placeholder="0"/></label></div>{cubage > 0 && <div className="cubage">Cubagem calculada: <strong>{cubage.toFixed(3)} m³</strong></div>}<button className="calculate" type="submit"><Calculator size={19}/> Calcular frete <ArrowRight size={18}/></button>{result && (result.error ? <div className="result"><strong>Trecho não disponível</strong><span>{result.error}</span></div> : <div className="result"><div><small>VALOR DA COTAÇÃO</small><strong>R$ {result.total.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><span>Notas fiscais até R$ 3.000: a Rapi10 assegura.</span></div><div className="result-meta"><span><Weight/> {result.weight.toFixed(1)} kg</span><span><Package/> {result.volume} volume(s)</span><span><Clock3/> {result.estimate}</span></div><button type="button" onClick={whatsapp}><MessageCircle/> Solicitar sua coleta pelo WhatsApp</button></div>)}</form></div></section>
      <section id="servicos" className="services"><div className="container"><div className="center-heading"><span>SOLUÇÕES RAPI10</span><h2>Transporte sem complicação.</h2><p>Uma operação próxima, prática e focada no que realmente importa: sua carga chegar bem.</p></div><div className="service-grid"><article><Truck/><h3>Encomendas</h3><p>Transporte de encomendas entre Uberaba e Uberlândia, nos dois sentidos.</p></article><article><Package/><h3>Coletas</h3><p>Solicite sua coleta de forma rápida e combine os detalhes com nossa equipe.</p></article><article><Search/><h3>Rastreamento</h3><p>Consulte o status da sua entrega com o código fornecido pela Rapi10.</p><button className="text-button" onClick={()=>document.getElementById('rastreamento')?.scrollIntoView({behavior:'smooth'})}>Consultar rastreio <ArrowRight size={16}/></button></article></div></div></section>
      <section id="rastreamento" className="tracking"><div className="container tracking-inner"><div><span>ACOMPANHE SUA CARGA</span><h2>Rastreamento</h2><p>Digite seu código para consultar. A integração com o sistema operacional da Rapi10 será conectada na próxima etapa.</p></div><form onSubmit={e=>{e.preventDefault();alert('Consulta de rastreamento preparada. Conectaremos ao sistema da Rapi10 na próxima etapa.')}}><Search/><input placeholder="Código de rastreio"/><button>Consultar</button></form></div></section>
      <section id="sobre" className="about"><div className="container about-grid"><div><span>RAPI10 • UBERABA</span><h2>De Uberaba para onde sua operação precisar.</h2></div><div><p>A Rapi10 Encomendas e Serviços atua no transporte regional, atendendo laboratórios, autopeças, refrigeração, oficinas, empresas e particulares.</p><p className="address"><MapPin size={18}/> Av. João XXIII, 765 — Uberaba/MG</p></div></div></section>
    </main>
    <footer id="contato"><div className="container footer"><div className="footer-brand"><img src={LOGO} alt="Rapi10"/><p>Encomendas e serviços com agilidade.</p></div><div><span>CONTATO</span><a href="tel:+5534999724769"><Phone size={16}/> (34) 99972-4769</a><a href="https://wa.me/5534999724769"><MessageCircle size={16}/> WhatsApp</a></div><div><span>ENDEREÇO</span><p>Av. João XXIII, 765<br/>Uberaba — MG</p></div></div><div className="copyright">© 2026 Rapi10 Encomendas e Serviços. Todos os direitos reservados.</div></footer>
  </div>
}
createRoot(document.getElementById('root')).render(<App />);
