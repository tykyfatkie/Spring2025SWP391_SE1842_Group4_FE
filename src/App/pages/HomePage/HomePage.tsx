import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";


const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Phần giữa - Nội dung chính */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 pt-24">
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome to Child Growth Tracking System!
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          A modern system for tracking and analyzing children's growth with accuracy.
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
