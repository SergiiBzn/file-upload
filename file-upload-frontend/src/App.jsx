import { useState } from 'react';

const App = () => {
  const [file, setFile] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = new FormData();
    data.append('file', file);

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5432/file-upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      setImageUrl(result.location);
      setSuccessMessage('Danke für das Hochladen der Datei');
      setTimeout(() => {
        setSuccessMessage('');
        setImageUrl('');
        setFile(null);
        setResetKey((k) => k + 1);
      }, 5000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-md space-y-6'>
        <h1 className='text-2xl font-semibold text-gray-900'>File Upload</h1>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <input
              key={resetKey}
              type='file'
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className='block w-full text-sm text-gray-900
                         file:mr-4 file:rounded-md file:border-0
                         file:bg-gray-200 file:px-4 file:py-2
                         file:text-sm file:font-medium
                         hover:file:bg-gray-300
                         '
            />
            {file && (
              <p className='text-xs text-gray-600 mt-1'>
                Ausgewählt: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={!file || loading}
            className='inline-flex items-center justify-center rounded-md
                       border border-gray-300 px-4 py-2 text-sm font-medium
                       text-gray-900 hover:bg-gray-100
                       disabled:cursor-not-allowed disabled:opacity-50'
          >
            {loading ? 'Uploading…' : 'Upload'}
          </button>

          {error && <p className='text-sm text-red-600'>{error}</p>}
          {successMessage && (
            <p className='text-sm text-green-600'>{successMessage}</p>
          )}
        </form>

        {imageUrl && (
          <div className='space-y-2'>
            <p className='text-sm text-gray-600'>Uploaded:</p>
            <img
              src={imageUrl}
              alt='uploaded'
              className='max-w-full h-auto rounded-md border border-gray-200'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
