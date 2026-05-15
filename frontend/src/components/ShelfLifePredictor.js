import React, { useState } from 'react';
import axios from 'axios';

const ShelfLifePredictor = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('produceImage', image);

    try {
      const response = await axios.post('http://localhost:5000/api/shelf-life/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Produce Shelf-Life Predictor</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Upload an image of produce:
            <input type="file" accept="image/*" onChange={handleImageChange} required />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Shelf-Life'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && result.success && (
        <div style={{ color: 'green', marginTop: '20px' }}>
          <p>Shelf-Life: {result.data.shelfLifeDays} day(s)</p>
          <p>Confidence: {(result.data.confidence * 100).toFixed(1)}%</p>
          <p>{result.data.message}</p>
        </div>
      )}
      {result && !result.success && (
        <div style={{ color: 'red' }}>{result.error || 'Prediction failed'}</div>
      )}
    </div>
  );
};

export default ShelfLifePredictor;