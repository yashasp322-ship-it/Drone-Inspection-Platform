export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12 text-left">
        
        {/* Brand column */}
        <div className="col-span-2 space-y-6">
          <a href="#" className="flex items-center space-x-2 text-white font-extrabold text-2xl tracking-wider">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black">
              D
            </div>
            <span>
              DRONE<span className="text-gray-400">INSPECTOR</span>
            </span>
          </a>
          <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
            Drone Infrastructure Inspector runs drone imagery through a multi-agent AI pipeline to detect infrastructure defects and generate inspection reports — fast, consistent, and severity-ranked.
          </p>
          <div className="text-[10px] text-gray-500">
            © 2026 Drone Infrastructure Inspector. All rights reserved.
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h5>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Asset Management</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Live Agent Pipeline</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Defect Detection</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Inspection Reports</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Asset Types</h5>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Bridges</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Wind Turbines</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Solar Farms</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Roads</a></li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h5>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Academy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing plans</a></li>
            <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
