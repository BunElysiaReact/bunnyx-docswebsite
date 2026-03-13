import { InlineCode, Code } from "bertui-code";
import { useState } from "react";
import { api } from "../../../bunnyx-api/api-client";
import Comments from "../../components/Comments";

export default function EdenTest() {
  const [getResult, setGetResult]   = useState(null);
  const [postResult, setPostResult] = useState(null);
  const [paramResult, setParamResult] = useState(null);
  const [error, setError]           = useState('');

  const testGet = () => {
    setError('');
    api.api.test.get().then(({ data, error }) => {
      if (error) { setError(JSON.stringify(error)); return; }
      setGetResult(data);
    });
  };

  const testPost = () => {
    setError('');
    api.api.test.data.post( { name: 'Pease', age: 20 } ).then(({ data, error }) => {
      if (error) { setError(JSON.stringify(error)); return; }
      setPostResult(data);
    });
  };

  const testParam = () => {
    setError('');
    api.api.test.user({ id: 7 }).get().then(({ data, error }) => {
      if (error) { setError(JSON.stringify(error)); return; }
      setParamResult(data);
    });
  };

  return (
    <div>
      <h1>Eden Treaty Tests</h1>
      <p>
        Bunnyx uses Eden Treaty under the hood for the type-safe client. This page tests
        that Eden's core features — GET, POST, URL params, and error handling — all work
        correctly inside a Bunnyx app. None of this is Bunnyx doing anything special.
        It is just Elysia and Eden working as designed.
      </p>

      <h2>1. GET Request</h2>
      <p>
        Calling <InlineCode>GET /api/test/</InlineCode> — root route, no params, no body.
        Eden maps this to <InlineCode>api.api.test.get()</InlineCode>.
      </p>
      <Code>{`api.api.test.get().then(({ data, error }) => {
  if (error) return console.error(error)
  console.log(data.message) // fully typed ✅
})`}</Code>
      <button onClick={testGet}>Run GET</button>
      {getResult && (
        <div style={{ marginTop: '8px', padding: '10px', background: '#f0f0f0' }}>
          <p><strong>message:</strong> {getResult.message}</p>
          
        </div>
      )}

      <h2>2. POST Request with Body</h2>
      <p>
        Calling <InlineCode>POST /api/test/data</InlineCode> with a typed body.
        Eden enforces the body shape — if you pass the wrong type your IDE will catch it
        before the request is ever sent.
      </p>
      <Code>{`api.api.test.data.post( { name: 'Pease', age: 20 } )
  .then(({ data, error }) => {
    if (error) return console.error(error)
    console.log(data.received) // { name: 'Pease', age: 20 } ✅
  })`}</Code>
      <button onClick={testPost}>Run POST</button>
      {postResult && (
        <div style={{ marginTop: '8px', padding: '10px', background: '#f0f0f0' }}>
          <p><strong>received:</strong> {JSON.stringify(postResult.received)}</p>
          <p><strong>processed:</strong> {String(postResult.processed)}</p>
        </div>
      )}

      <h2>3. URL Params</h2>
      <p>
        Calling <InlineCode>GET /api/test/user/:id</InlineCode> with id 7.
        Dynamic path params in Eden are passed as an object — <InlineCode>{'api.api.test.user({ id: 7 })'}</InlineCode>.
        TypeScript enforces that <InlineCode>id</InlineCode> is a number because of the
        <InlineCode>t.Numeric()</InlineCode> validator on the Elysia route.
      </p>
      <Code>{`api.api.test.user({ id: 7 }).get().then(({ data, error }) => {
  if (error) return console.error(error)
  console.log(data.name) // "User 7" ✅
})`}</Code>
      <button onClick={testParam}>Run Params</button>
      {paramResult && (
        <div style={{ marginTop: '8px', padding: '10px', background: '#f0f0f0' }}>
          <p><strong>id:</strong> {paramResult.id}</p>
          <p><strong>name:</strong> {paramResult.name}</p>
          <p><strong>email:</strong> {paramResult.email}</p>
        </div>
      )}

      <h2>4. Error Handling</h2>
      <p>
        Eden always returns <InlineCode>{'{ data, error }'}</InlineCode>. If the request
        succeeds, <InlineCode>data</InlineCode> has the value and <InlineCode>error</InlineCode> is
        null. If it fails, <InlineCode>error</InlineCode> has the value and <InlineCode>data</InlineCode> is
        null. Both are typed — TypeScript narrows them correctly after the check.
      </p>
      <Code>{`const { data, error } = await api.api.users({ id: 999 }).get()

if (error) {
  switch (error.status) {
    case 404: console.log('not found'); break
    case 422: console.log('validation error'); break
    default:  console.log('something went wrong'); break
  }
  return
}

// here data is guaranteed non-null ✅
console.log(data.user.name)`}</Code>
      {error && (
        <div style={{ marginTop: '8px', padding: '10px', background: '#fee2e2' }}>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      <h2>5. Eden Treaty Path Mapping</h2>
      <p>
        Eden converts URL paths to dot notation. Every <InlineCode>/</InlineCode> becomes
        a <InlineCode>.</InlineCode> and dynamic segments become function calls.
        This is the full mapping reference:
      </p>
      <Code>{`// GET /api/test/
api.api.test.get()

// GET /api/test/user/:id
api.api.test.user({ id: 5 }).get()

// POST /api/test/data
api.api.test.data.post({ body: { name: 'x', age: 1 } })

// GET /api/users/
api.api.users.get()

// GET /api/users/:id
api.api.users({ id: 1 }).get()

// POST /api/users/
api.api.users.post({ body: { name: 'x' } })`}</Code>

      <p>
        All of this works in Bunnyx with zero extra setup. Eden Treaty is already installed
        as a dependency of Bunnyx and the client is auto-generated on every <InlineCode>bun run dev</InlineCode>.
      </p>
      <Comments/>

      <p>Back to <a href="/tests">tests</a>.</p>
    </div>
  );
}