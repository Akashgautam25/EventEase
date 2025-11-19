import { HiHeart } from 'react-icons/hi2';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-3xl font-bold text-black mb-6">EventEase</h3>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Professional college event management platform designed to streamline campus events with modern simplicity and efficiency.
            </p>
          
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-black mb-6">Product</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-black transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Updates</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-black mb-6">Support</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-black transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 EventEase. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Terms</a>
            <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;