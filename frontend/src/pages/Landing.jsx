import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendarDays, HiOutlineUsers, HiOutlineChartBarSquare } from 'react-icons/hi2';
import Footer from '../components/Footer';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white mt-9">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
          <div className="text-center">
            {/* Elegant Badge */}
            <div className="inline-flex items-center px-4 py-3 border border-gray-200 rounded-3xl mb-8 bg-black">
              <span className="text-sm font-light text-white tracking-wide">PROFESSIONAL EVENT MANAGEMENT</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl font-extralight text-black mb-6 tracking-tight leading-[0.9]">
              EventEase
            </h1>
            
            <div className="w-24 h-px bg-black mx-auto mb-8"></div>
            
            {/* Subheading */}
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Sophisticated event orchestration for discerning educational institutions.
              Where precision meets elegance.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button 
                onClick={() => navigate('/signup')}
                className="px-5 py-2 bg-black text-white font-light tracking-wide hover:bg-gray-900 transition-all duration-300 rounded-2xl"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-10 py-3 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 transition-all duration-300 rounded-2xl"
              >
                Login
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-12 text-gray-400 text-sm font-light">
              <div className="flex items-center">
                <div className="w-1 h-1 bg-gray-300 rounded-full mr-3"></div>
                Enterprise Grade
              </div>
              <div className="flex items-center">
                <div className="w-1 h-1 bg-gray-300 rounded-full mr-3"></div>
                Premium Support
              </div>
              <div className="flex items-center">
                <div className="w-1 h-1 bg-gray-300 rounded-full mr-3"></div>
                Institutional Focus
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 border border-gray-300 flex items-center justify-center mx-auto mb-6 group-hover:border-black transition-all duration-500 rounded-3xl">
                <HiOutlineCalendarDays className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-light text-black mb-4 tracking-wide">Orchestration</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Masterful event coordination with precision timing, resource harmony, 
                and seamless execution that elevates every gathering.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 border border-gray-300 flex items-center justify-center mx-auto mb-6 group-hover:border-black transition-all duration-500 rounded-3xl">
                <HiOutlineUsers className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-light text-black mb-4 tracking-wide">Engagement</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Cultivate meaningful connections through sophisticated participant 
                management and personalized experience curation.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 border border-gray-300 flex items-center justify-center mx-auto mb-6 group-hover:border-black transition-all duration-500 rounded-3xl">
                <HiOutlineChartBarSquare className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-light text-black mb-4 tracking-wide">Intelligence</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Transform data into wisdom with sophisticated analytics that reveal 
                the deeper story behind every event's success.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;