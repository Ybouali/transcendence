import './App.css';

function App() {

  const loginIntra42 = () => {

    window.open('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c94bdd67c38cd35f385cecf527ac87319c235fa65febee8393dd2bef053a2648&redirect_uri=http%3A%2F%2F192.168.5.79&response_type=code')
  }

  return (
    <div className='flex items-center justify-center min-h-screen' >
      <button onClick={loginIntra42} className='border-2 border-gray-400 text-lg text-white bg-orange-500 rounded-xl p-2' >
        LOG IN INTRA 42
      </button>
    </div>
  );
}

export default App;
