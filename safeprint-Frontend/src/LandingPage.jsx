import React from 'react';
import { Shield, Printer, School, Gavel, Lock, ChevronRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <Shield className="text-emerald-400" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SafePrint<span className="text-emerald-500">.</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Solutions</a>
            <a href="#security" className="hover:text-white transition-colors">Security Protocol</a>
            <a href="#pricing" className="hover:text-white transition-colors">Enterprise</a>
          </div>
          <button 
            onClick={() => navigate('/upload')}
            className="bg-white text-slate-950 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center relative">
        {/* Background Glow Effect */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live System Status: Operational
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Share Once. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Gone Forever.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ephemeral file-transfer protocol for high-stakes environments. 
            Upload files that automatically self-destruct after a single download.
            <span className="block mt-2 text-emerald-500/80 font-medium">No Logs. No Accounts. No Trace.</span>
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/upload')}
              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 group"
            >
              Start Secure Transfer
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/print')}
              className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg text-white border border-slate-700 hover:bg-slate-800 transition-all"
            >
              View Deployment Options
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- TARGET SECTORS (THE "NEON CARDS") --- */}
      {/* --- TARGET SECTORS (UPDATED CONTENT) --- */}
{/* --- TARGET SECTORS (UPDATED CONTENT) --- */}
<section id="features" className="py-24 bg-slate-900/30 border-y border-white/5">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-white mb-4">Real-World Solutions</h2>
      <p className="text-slate-400">Solving the privacy gaps in our daily digital interactions.</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* 1. Print Shops (The "Aadhaar" & "Bridge" Angle) */}
      <SectorCard 
        icon={<Printer className="text-emerald-400" size={32} />}
        title="Xerox & Print Shops"
        badge="WhatsApp Bridge"
        desc="Stop logging into WhatsApp Web or Email on public PCs. Securely print sensitive IDs (Aadhaar, PAN) without leaving a digital trail on the shop owner's computer."
        color="border-emerald-500/30 hover:border-emerald-500/80"
        shadow="shadow-emerald-500/10"
      />

      {/* 2. Schools/Colleges (The "24/7 Shop" Angle) */}
<SectorCard 
  icon={<School className="text-blue-400" size={32} />}
  title="Campus Kiosk"
  badge="24/7 Private Shop"
  desc="Think of it as a printer shop that never sleeps and never peeks. Fully automated 24/7 printing with zero privacy leaks—no shopkeeper, no public login, just you and your file."
  color="border-blue-500/30 hover:border-blue-500/80"
  shadow="shadow-blue-500/10"
/>

      {/* 3. Legal/Finance (The "Client" Angle) */}
      <SectorCard 
        icon={<Gavel className="text-amber-400" size={32} />}
        title="Legal & Finance"
        badge="Client Vault"
        desc="A secure drop-zone for clients. Collect tax returns and legal proofs via a one-time link that expires immediately after the file is received."
        color="border-amber-500/30 hover:border-amber-500/80"
        shadow="shadow-amber-500/10"
      />

      {/* 4. Enterprise (The "Docker" Angle) */}
      <SectorCard 
        icon={<Shield className="text-purple-400" size={32} />}
        title="Enterprise"
        badge="Self-Hosted"
        desc="Prevent data leaks on 'WeTransfer'. Deploy SafePrint as a Docker container within your firewall to keep proprietary code and internal memos strictly internal."
        color="border-purple-500/30 hover:border-purple-500/80"
        shadow="shadow-purple-500/10"
      />

    </div>
  </div>
</section>

      {/* --- HOW IT WORKS (THE "NUKE" PROTOCOL) --- */}
      <section id="security" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block p-3 rounded-2xl bg-slate-800 mb-6">
              <Lock className="text-emerald-400" size={32} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">The "Burn-After-Reading" Protocol</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Traditional cloud storage keeps your files forever. SafePrint is designed to destroy them. 
              Our architecture ensures that data cannot be recovered once the transaction is complete.
            </p>
            
            <div className="space-y-6">
              <FeatureRow 
                title="RAM-Only Buffer" 
                desc="Files are streamed through memory, minimizing disk writes." 
              />
              <FeatureRow 
                title="Cryptographic Randomization" 
                desc="Filenames are obfuscated with 256-bit entropy." 
              />
              <FeatureRow 
                title="Instant Purge (fs.unlink)" 
                desc="Server triggers physical deletion immediately after the byte stream closes." 
              />
            </div>
          </div>

          {/* Visual Representation of the Tech */}
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 relative overflow-hidden">
             {/* Mock Code Block */}
             <div className="font-mono text-sm">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-2 text-slate-400">
                  <p><span className="text-purple-400">const</span> <span className="text-blue-400">handleDownload</span> = <span className="text-yellow-400">async</span> (req, res) ={'>'} {'{'}</p>
                  <p className="pl-4 text-slate-500">// 1. Stream file to client</p>
                  <p className="pl-4"><span className="text-blue-400">await</span> streamFile(res, filePath);</p>
                  <p className="pl-4 text-slate-500">// 2. Trigger immediate destruction</p>
                  <p className="pl-4 text-red-400">fs.unlinkSync(filePath);</p>
                  <p className="pl-4 text-emerald-400">console.log("EVIDENCE_DESTROYED");</p>
                  <p>{'}'}</p>
                </div>
             </div>
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm">
        <p>© 2026 SafePrint Technologies. Designed for the RNSIT Innovation Lab.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Destruction</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">GitHub</a>
        </div>
      </footer>

    </div>
  );
};

// Helper Components
const SectorCard = ({ icon, title, badge, desc, color, shadow }) => (
  <div className={`bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border ${color} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${shadow} group`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-950 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-slate-300 border border-white/5 uppercase tracking-wide">
        {badge}
      </span>
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-3">
      {desc}
    </p>
  </div>
);

const FeatureRow = ({ title, desc }) => (
  <div className="flex gap-4">
    <div className="mt-1">
      <CheckCircle size={20} className="text-emerald-500" />
    </div>
    <div>
      <h4 className="text-white font-bold">{title}</h4>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  </div>
);

export default LandingPage;