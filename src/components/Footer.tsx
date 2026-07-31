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
              DRONE<span className="text-gray-400">DEPLOY</span>
            </span>
          </a>
          <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
            DroneDeploy is the leading cloud software platform for commercial drones and reality capture, making aerial and ground site data accessible and productive for everyone.
          </p>
          <div className="text-[10px] text-gray-500">
            © 2026 DroneDeploy Inc. All rights reserved. All original visual designs and assets simulated for demonstration purposes.
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h5>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Drone Mapping</a></li>
            <li><a href="#" className="hover:text-white transition-colors">360 Ground Walk</a></li>
            <li><a href="#" className="hover:text-white transition-colors">AI Analysis</a></li>
            <li><a href="#" className="hover:text-white transition-colors">BIM Compare</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Industries</h5>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Construction</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Energy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Agriculture</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Mining</a></li>
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
