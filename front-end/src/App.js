import './App.css';

function App() {

  const loginIntra42 = () => {

    window.open('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c60411c86a448fa5a8f4013c06d125659a69ab17aa0aec7f9f70873bdaaea9a4&redirect_uri=https%3A%2F%2Fobachbghitingolhalk.com&response_type=code')
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
