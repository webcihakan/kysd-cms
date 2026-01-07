import { useState, useEffect } from 'react';
import api from '../utils/api';

export function useCurrency() {
  const [currency, setCurrency] = useState({
    usd: null,
    eur: null,
    gold: null,
    silver: null,
    lastUpdate: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchCurrency();

    // Her 5 dakikada bir güncelle
    const interval = setInterval(fetchCurrency, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchCurrency = async () => {
    try {
      const response = await api.get('/currency');
      setCurrency({
        ...response.data,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Döviz kurları alınamadı:', error);
      setCurrency(prev => ({
        ...prev,
        loading: false,
        error: 'Döviz kurları yüklenemedi'
      }));
    }
  };

  return currency;
}
