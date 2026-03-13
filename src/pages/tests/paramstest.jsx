import { InlineCode, Code } from "bertui-code";
import { useState } from "react";
import { api } from "../../../bunnyx-api/api-client";

export default function ParamsTest() {
  const [id, setId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const search = () => {
    if (!id) return;
    setError('');
    setResult(null);
    api.api.users({ id: Number(id) }).get().then(({ data, error }) => {
      if (error) { setError('User not found'); return; }
      setResult(data);
    });
  };

  return (
    <div>
      <h1>URL Params Test</h1>
      <p>
        Elysia route params work exactly as expected in Bunnyx. This page calls
        <InlineCode>GET /api/users/:id</InlineCode> with a user-provided ID from a React input.
        No special setup — just standard React state and the typed Eden client.
      </p>

      <h2>Try It</h2>
      <div>
        <input
          type="number"
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="Enter user ID"
        />
        <button onClick={search}>Search</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '16px', padding: '10px', background: '#f0f0f0' }}>
          <p><strong>ID:</strong> {result.user?.id ?? result.id}</p>
          <p><strong>Name:</strong> {result.user?.name ?? result.name}</p>
        </div>
      )}

      <h2>The Code</h2>
      <Code>
        {`const [id, setId] = useState('')
const [result, setResult] = useState(null)

const search = () => {
  api.api.users({ id: Number(id) }).get().then(({ data }) => {
    setResult(data)
  })
}

return (
  <>
    <input value={id} onChange={e => setId(e.target.value)} />
    <button onClick={search}>Search</button>
    {result && <p>{result.user.name}</p>}
  </>
)`}
      </Code>

      <p>
        Eden's param call <InlineCode>api.api.users({'{ id: Number(id) }'})</InlineCode> is fully
        typed — your IDE enforces that <InlineCode>id</InlineCode> is a number, not a string.
        That validation flows directly from the <InlineCode>t.Numeric()</InlineCode> you defined
        in the Elysia route. One definition, enforced everywhere.
      </p>

      <p>Back to <a href="/tests">tests</a>.</p>
    </div>
  );
}