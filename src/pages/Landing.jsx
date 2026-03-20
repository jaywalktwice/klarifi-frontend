import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';
import './Landing.css';

const TYPING_WORDS = ['finds them.', 'reads them.', 'extracts them.', 'understands them.', 'clarifies them.'];

export default function Landing() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const navigate = useNavigate();

  useEffect(() => {
    // Typing effect logic
    let typeTimer;
    const currentWord = TYPING_WORDS[currentWordIndex];
    
    if (isDeleting) {
      typeTimer = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        setTypingSpeed(40);
      }, typingSpeed);
    } else {
      typeTimer = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        setTypingSpeed(80);
      }, typingSpeed);
    }

    if (!isDeleting && currentText === currentWord) {
      typeTimer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
      setTypingSpeed(500);
    }

    return () => clearTimeout(typeTimer);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed]);

  useEffect(() => {
    // Advanced Staggered Scroll Observer for beautiful cascading waterfalls
    const els = document.querySelectorAll('.rv');
    if ('IntersectionObserver' in window) {
      let delayCounter = 0;
      let frameTimeout = null;

      const o = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Apply a staggered transition delay
            const delay = delayCounter * 120; // 120ms between each element rendering
            if (delay > 0) {
              entry.target.style.transitionDelay = `${delay}ms`;
            }
            
            // Force browser reflow so transitionDelay is applied before adding .v class
            void entry.target.offsetWidth;
            entry.target.classList.add('v');
            o.unobserve(entry.target);
            
            delayCounter++;
            
            // Reset delay counter after a short gap so completely separate scrolling actions don't inherit massive delays
            if (frameTimeout) clearTimeout(frameTimeout);
            frameTimeout = setTimeout(() => {
              delayCounter = 0;
            }, 100);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
      
      els.forEach(e => o.observe(e));
    } else {
      // Fallback for extremely old browsers
      els.forEach(e => e.classList.add('v'));
    }

    // Nav bar scroll effect
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleWaitlist = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="landing-wrapper">
      <NeuralBackground />
      
      <nav className="landing-nav" style={{ borderBottomColor: navScrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)' }}>
        <div className="nav-in">
          <a href="#" className="logo">
            <div className="logo-i">K</div>
            <div className="logo-t">Kleri<span>fi</span></div>
          </a>
          <button className="mb" onClick={() => setMenuOpen(!menuOpen)}>&#9776;</button>
          <ul className={`nl ${menuOpen ? 'open' : ''}`}>
            <li><a href="#industries" onClick={() => setMenuOpen(false)}>Industries</a></li>
            <li><a href="#how" onClick={() => setMenuOpen(false)}>How it works</a></li>
            <li><a href="#security" onClick={() => setMenuOpen(false)}>Security</a></li>
            <li><Link to="/login" className="nc">Try Demo</Link></li>
          </ul>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-gl"></div>
        <div className="hero-gr"></div>
        <div className="hero-c flex flex-col items-center mx-auto text-center w-full">
          <div className="hb"><span className="dot"></span> 4x hackathon winner & finalist — now production-ready</div>
          <h1 className="rv">
            Your documents hold <em>answers.</em><br />
            <span className="inline-flex items-center">
              Klerifi {currentText}
              <span className="inline-block w-[4px] h-[0.8em] align-middle bg-[var(--accent)] ml-3" style={{ animation: 'pu 1s infinite' }}></span>
            </span>
          </h1>
          <p className="hero-sub text-center w-full">AI-powered document intelligence that reads customs forms, invoices, contracts, and government paperwork — and turns them into structured, exportable data your systems can actually use.</p>
          <div className="hero-btns w-full flex justify-center">
            <Link to="/login" className="bp">Try Demo <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
            <a href="#how" className="bs">See how it works</a>
          </div>
          <div className="hs">
            <div className="hs-i rv"><div className="n">3-8s</div><div className="l">Per document</div></div>
            <div className="hs-i rv"><div className="n">95%+</div><div className="l">Accuracy</div></div>
            <div className="hs-i rv"><div className="n">Any</div><div className="l">Document type</div></div>
          </div>
        </div>
      </section>

      <section className="prob">
        <div className="ctn">
          <div className="sl rv">The problem</div>
          <h2 className="st rv">Namibian businesses are drowning in paperwork</h2>
          <p className="ss rv">Every document that enters your office starts the same way: someone reads it, types the data into a system, and hopes they don't make a mistake.</p>
          <div className="pg">
            <div className="pc rv">
              <div className="pi">🧾</div>
              <h3>Invoices pile up</h3>
              <p>A mid-size accounting firm processes 200-500 invoices per month. At 10 minutes each, that's 80+ hours of pure typing.</p>
              <div className="ps">= 2 full-time staff just doing data entry</div>
            </div>
            <div className="pc rv">
              <div className="pi">🚢</div>
              <h3>Shipments wait</h3>
              <p>Every shipment at Walvis Bay needs bills of lading, customs declarations, and packing lists typed into ASYCUDA. One wrong HS code means delays and penalties.</p>
              <div className="ps">NAD 2,000-5,000/day in demurrage</div>
            </div>
            <div className="pc rv">
              <div className="pi">⚖️</div>
              <h3>Contracts get missed</h3>
              <p>Due diligence on a property deal means reading 50+ contracts for key clauses. A missed termination clause can cost millions.</p>
              <div className="ps">Days of paralegal time per deal</div>
            </div>
            <div className="pc rv">
              <div className="pi">🏛️</div>
              <h3>Citizens wait</h3>
              <p>Government departments process thousands of applications manually. Backlogs grow. Service delivery suffers. Frustration builds.</p>
              <div className="ps">Weeks-long backlogs are common</div>
            </div>
          </div>
        </div>
      </section>

      <section className="diff">
        <div className="ctn">
          <div className="sl rv">What makes Klerifi different</div>
          <h2 className="st rv">This isn't another invoice scanner</h2>
          <p className="ss rv">Tools like Sage AutoEntry only handle invoices and receipts for accounting software. Klerifi reads any document and outputs to any system.</p>
          <div className="db rv">
            <div className="dl">
              <h3>Accounting add-ons scan invoices.<br />Klerifi reads <em style={{ color: 'var(--accent-l)', fontFamily: 'var(--fd)' }}>everything.</em></h3>
              <p>AutoEntry, Dext, and PaperLess are built for one thing: feeding invoices into Sage, Xero, or QuickBooks. If your document isn't an invoice — a customs form, a legal contract, a government application — they simply can't help.</p>
              <p>Klerifi uses general-purpose AI that understands any document type, in any format, in any language — including the ones no off-the-shelf tool was built for.</p>
              <div className="dc">
                <div className="dr them"><span className="x">✗</span> Accounting add-ons: Invoices and receipts only</div>
                <div className="dr them"><span className="x">✗</span> Locked to Sage, Xero, or QuickBooks</div>
                <div className="dr them"><span className="x">✗</span> Data stored on servers in UK/Europe</div>
                <div className="dr them"><span className="x">✗</span> No local support in Namibia</div>
                <div className="dr us"><span className="ck">✓</span> Klerifi: Any document, any format, any language</div>
                <div className="dr us"><span className="ck">✓</span> Exports CSV/JSON — works with any system</div>
                <div className="dr us"><span className="ck">✓</span> Data hosted in Southern Africa (SACU)</div>
                <div className="dr us"><span className="ck">✓</span> Local support — same-day in Windhoek</div>
              </div>
            </div>
            <div className="drt">
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--t3)', fontWeight: '600', marginBottom: '0.25rem' }}>Documents Klerifi reads</div>
              <div className="dtc rv"><div className="dti">🚢</div><div><h4>Customs Declarations & SAD Forms</h4><p>HS codes, CIF values, consignee, origin — ready for ASYCUDA</p></div></div>
              <div className="dtc rv"><div className="dti">📋</div><div><h4>Bills of Lading & Packing Lists</h4><p>Vessel, container, weight, descriptions, port details</p></div></div>
              <div className="dtc rv"><div className="dti">📑</div><div><h4>Contracts & Legal Documents</h4><p>Parties, dates, key clauses, obligations, termination terms</p></div></div>
              <div className="dtc rv"><div className="dti">🧾</div><div><h4>Invoices, Receipts & Statements</h4><p>Vendor, amounts, line items, VAT — export to Sage, Pastel, any CSV</p></div></div>
              <div className="dtc rv"><div className="dti">🏛️</div><div><h4>Government Forms & Applications</h4><p>Citizen data, permit details, ID documents, tax forms</p></div></div>
              <div className="dtc rv"><div className="dti">📄</div><div><h4>Any Other Document</h4><p>If a human can read it, Klerifi can extract it</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="demo">
        <div className="ctn">
          <div className="dw rv">
            <div className="dbar"><div className="dd"></div><div className="dd"></div><div className="dd"></div></div>
            <div className="dbdy">
              <div className="dml">
                <div className="dml-l">Input document</div>
                <div className="ddoc">
                  <div className="bg">📄</div>
                  <div>customs_declaration_walvis_bay.pdf</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--t4)' }}>Uploaded 2 seconds ago</div>
                </div>
              </div>
              <div className="dmr">
                <div className="dmr-l">Extracted data</div>
                <div className="df"><span className="fk">Consignee</span><span className="fv">Namibia Mining Corp</span></div>
                <div className="df"><span className="fk">HS Code</span><span className="fv">8474.20.00</span></div>
                <div className="df"><span className="fk">CIF Value</span><span className="fv">NAD 284,500.00</span></div>
                <div className="df"><span className="fk">Country of Origin</span><span className="fv">Germany</span></div>
                <div className="df"><span className="fk">Port of Entry</span><span className="fv">Walvis Bay</span></div>
                <div className="df"><span className="fk">Duty Rate</span><span className="fv">0% (SACU)</span></div>
                <div className="df"><span className="fk">VAT (15%)</span><span className="fv">NAD 42,675.00</span></div>
                <div className="dcf">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.67 3.5L5.25 9.92 2.33 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  97.3% confidence · 7 fields · 4.2s
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ind" id="industries">
        <div className="ctn">
          <div className="sl rv">Who it's for</div>
          <h2 className="st rv">Built for businesses that run on paper</h2>
          <p className="ss rv">Every industry has its document nightmare. Klerifi speaks your language.</p>
          <div className="ig">
            <div className="ic rv"><div className="ii">🚢</div><h3>Customs & Freight</h3><p>Extract data from shipping docs and paste straight into ASYCUDA. Clear shipments faster, avoid demurrage charges.</p><div className="iu">→ Bills of Lading, SAD Forms, Packing Lists</div></div>
            <div className="ic rv"><div className="ii">📊</div><h3>Accounting & Tax</h3><p>Process invoices, receipts, and bank statements. Export CSV into Sage, Pastel, or QuickBooks. Prepare NamRA submissions faster.</p><div className="iu">→ Invoices, Receipts, Bank Statements</div></div>
            <div className="ic rv"><div className="ii">⚖️</div><h3>Legal & Compliance</h3><p>Extract key clauses, parties, dates, and obligations from contracts. Complete due diligence in days, not weeks.</p><div className="iu">→ Contracts, Court Filings, Deeds</div></div>
            <div className="ic rv"><div className="ii">🏛️</div><h3>Government</h3><p>Digitize citizen applications, permits, and ID documents. Reduce backlogs and improve service delivery for all Namibians.</p><div className="iu">→ Applications, Permits, Tax Forms</div></div>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="ctn">
          <div className="sl rv">How it works</div>
          <h2 className="st rv">Three steps. Zero complexity.</h2>
          <p className="ss rv">No training needed. No setup fees. Upload a document and see results in seconds.</p>
          <div className="steps">
            <div className="step rv"><div className="sn">1</div><h3>Upload any document</h3><p>PDF, scan, photo — any format, any quality, any language. Drop it in and Klerifi handles the rest.</p><div className="sa">→</div></div>
            <div className="step rv"><div className="sn">2</div><h3>AI reads and extracts</h3><p>Our AI identifies the document type, reads every field, and returns structured data with confidence scores you can trust.</p><div className="sa">→</div></div>
            <div className="step rv"><div className="sn">3</div><h3>Export and use</h3><p>Download clean CSV or JSON. Import into Sage, Pastel, ASYCUDA, or any system. Review, approve, done.</p></div>
          </div>
        </div>
      </section>

      <section className="aft">
        <div className="ctn">
          <div className="sl rv">Beyond extraction</div>
          <h2 className="st rv">The data unlocks answers you've never had time to find</h2>
          <p className="ss rv">Extraction is step one. What you do with structured data is where the real value lives.</p>
          <div className="afg">
            <div className="afc rv"><div className="afh"><div className="afi">📈</div><h3>Spot spending patterns</h3></div><p>See which vendors you're paying most, which costs are increasing, and where money leaks — across thousands of invoices, instantly.</p><div className="afe">"We discovered we were paying 3 different vendors for the same supplies at different prices."</div></div>
            <div className="afc rv"><div className="afh"><div className="afi">⚠️</div><h3>Catch costly errors</h3></div><p>Duplicate invoices, mismatched amounts, wrong HS codes on customs forms. Klerifi flags inconsistencies that human eyes miss under time pressure.</p><div className="afe">A single wrong HS code can mean thousands in excess duty or clearance delays.</div></div>
            <div className="afc rv"><div className="afh"><div className="afi">🔄</div><h3>Feed your existing systems</h3></div><p>Export clean CSV directly into Sage, Pastel, QuickBooks, ASYCUDA, or any system you already use. No re-typing. No copy-paste. Zero errors.</p><div className="afe">What took 3 days of manual entry now takes a 10-second CSV import.</div></div>
            <div className="afc rv"><div className="afh"><div className="afi">📋</div><h3>Audit-ready in minutes</h3></div><p>Every extraction is logged with timestamps, confidence scores, and version history. When the auditor or NamRA calls, your records are digital and organized.</p><div className="afe">No more boxes of paper. Every document searchable, every field traceable.</div></div>
          </div>
        </div>
      </section>

      <section className="nw">
        <div className="ctn">
          <div className="sl rv">Now what?</div>
          <h2 className="st rv">Extracted data goes straight into the systems you already use</h2>
          <p className="ss rv">Klerifi doesn't replace your software. It feeds it. Here's what the workflow actually looks like for your industry.</p>
          <div className="nw-grid">
            <div className="nwc rv"><div className="nw-head"><div className="nw-icon">📊</div><h3>Accounting Firm → Sage / Pastel</h3></div><div className="nw-flow"><div className="nw-step"><span className="nws-n">1</span> Client drops off 200 invoices</div><div className="nw-step"><span className="nws-n">2</span> You scan and upload the batch to Klerifi</div><div className="nw-step"><span className="nws-n">3</span> Klerifi extracts vendor, date, amount, VAT, line items</div><div className="nw-step"><span className="nws-n">4</span> Download CSV pre-formatted for Sage Pastel</div><div className="nw-step"><span className="nws-n">5</span> Sage → Process → Suppliers → Batch Import → Done</div></div><div className="nw-result">3 days of typing → 10 minutes. Serve 3x more clients with the same staff.</div></div>
            <div className="nwc rv"><div className="nw-head"><div className="nw-icon">🚢</div><h3>Customs Broker → ASYCUDA</h3></div><div className="nw-flow"><div className="nw-step"><span className="nws-n">1</span> Shipment arrives with bill of lading + customs docs</div><div className="nw-step"><span className="nws-n">2</span> Upload shipping documents to Klerifi</div><div className="nw-step"><span className="nws-n">3</span> Klerifi extracts HS codes, CIF values, consignee, origin</div><div className="nw-step"><span className="nws-n">4</span> Copy pre-validated values into ASYCUDA fields</div><div className="nw-step"><span className="nws-n">5</span> Submit declaration. Shipment cleared.</div></div><div className="nw-result">Fewer HS code errors. Faster clearance. NAD 2,000-5,000/day saved in demurrage.</div></div>
            <div className="nwc rv"><div className="nw-head"><div className="nw-icon">⚖️</div><h3>Law Firm → Due Diligence</h3></div><div className="nw-flow"><div className="nw-step"><span className="nws-n">1</span> Upload 50+ contracts for a property transaction</div><div className="nw-step"><span className="nws-n">2</span> Klerifi extracts parties, dates, clauses, obligations</div><div className="nw-step"><span className="nws-n">3</span> Download summary spreadsheet of all contracts</div><div className="nw-step"><span className="nws-n">4</span> Sort by termination date, filter liability clauses</div><div className="nw-step"><span className="nws-n">5</span> Lawyer reviews summary, not 50 full documents</div></div><div className="nw-result">Due diligence in days, not weeks. Billable hours shift to high-value analysis.</div></div>
            <div className="nwc rv"><div className="nw-head"><div className="nw-icon">🏛️</div><h3>Government → Service Delivery</h3></div><div className="nw-flow"><div className="nw-step"><span className="nws-n">1</span> Citizen submits paper application for a permit</div><div className="nw-step"><span className="nws-n">2</span> Front desk scans and uploads to Klerifi</div><div className="nw-step"><span className="nws-n">3</span> Klerifi extracts citizen data, ID, application details</div><div className="nw-step"><span className="nws-n">4</span> Data populates the internal case management system</div><div className="nw-step"><span className="nws-n">5</span> Clerk reviews and approves — no typing needed</div></div><div className="nw-result">Backlogs reduced. Faster processing. Searchable digital archive replaces filing cabinets.</div></div>
          </div>
        </div>
      </section>

      <section className="sec" id="security">
        <div className="ctn">
          <div className="sl rv">Security & data privacy</div>
          <h2 className="st rv">Your data stays yours. Always.</h2>
          <p className="ss rv">Built with a data sovereignty model designed for Southern African businesses. No compromises.</p>
          <div className="sct">
            <div className="scc rv"><div className="si">🔐</div><h3>AES-256 Encryption</h3><p>All stored data encrypted at rest using the same standard as banks and military systems. Unreadable even with physical access.</p></div>
            <div className="scc rv"><div className="si">🛡️</div><h3>TLS 1.3 In Transit</h3><p>Every connection encrypted with the latest transport security. Documents protected from upload to download.</p></div>
            <div className="scc rv"><div className="si">🌍</div><h3>Hosted in SACU</h3><p>All infrastructure runs on dedicated servers in Cape Town, South Africa. Your data never leaves Southern Africa.</p></div>
            <div className="scc rv"><div className="si">🗑️</div><h3>Auto-Deletion</h3><p>Originals permanently deleted after extraction by default. We keep only extracted text. You choose: immediate, 7, 30, or 90 days.</p></div>
          </div>
          <div className="sf rv">
            <h3>How your document flows through Klerifi</h3>
            <div className="fr">
              <div className="fs"><div className="fn">1</div><div className="ft">You Upload</div><div className="fdd">Encrypted via TLS 1.3 to Cape Town server</div></div><div className="fa">→</div>
              <div className="fs"><div className="fn">2</div><div className="ft">AI Reads</div><div className="fdd">Processed in memory only. AI never stores your data.</div></div><div className="fa">→</div>
              <div className="fs"><div className="fn">3</div><div className="ft">Data Saved</div><div className="fdd">Only text fields saved to your encrypted, isolated database</div></div><div className="fa">→</div>
              <div className="fs"><div className="fn">4</div><div className="ft">Original Deleted</div><div className="fdd">Source document permanently destroyed. No copies.</div></div><div className="fa">→</div>
              <div className="fs"><div className="fn">5</div><div className="ft">You Export</div><div className="fdd">Download CSV/JSON. You own your data completely.</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="met">
        <div className="ctn">
          <div className="mg">
            <div className="mc rv"><div className="mv">3-8s</div><div className="ml">Per document</div></div>
            <div className="mc rv"><div className="mv">95%+</div><div className="ml">Extraction accuracy</div></div>
            <div className="mc rv"><div className="mv">$0</div><div className="ml">Setup cost</div></div>
            <div className="mc rv"><div className="mv">SACU</div><div className="ml">Data sovereignty</div></div>
          </div>
        </div>
      </section>

      <section className="cta" id="cta">
        <div className="ctb rv">
          <h2>Get <em>early access</em></h2>
          <p className="ctd">We're onboarding our first 20 Namibian businesses. Join the waitlist to eliminate document chaos and unlock the insights hiding in your paperwork.</p>
          <div className="ctf" id="wf">
            <input type="email" id="ei" placeholder="your@email.com" />
            <button onClick={handleWaitlist}>Try Demo</button>
          </div>
          <p className="ctn2">Free during early access · No credit card required · Built in Namibia 🇳🇦</p>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="fi">
          <div className="fl">© 2026 Klerifi · Built in Windhoek, Namibia</div>
          <div className="fls"><a href="mailto:hello@klarifi.com">Contact</a><a href="#">Privacy</a><a href="#">Terms</a></div>
        </div>
      </footer>
    </div>
  );
}
