import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Phần giữa để trống */}
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-3xl font-semibold text-gray-700">Welcome to Child Growth Tracking System!</h1>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
