import { useEffect, useState } from "react";
import { client } from "./rpc";

function App() {
  const [message, setMessage] = useState("loading...");

  useEffect(() => {
    client.ping.$get().then(async (res) => {
      const data = await res.json();
      setMessage(data.message);
    });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Pravah AI</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
