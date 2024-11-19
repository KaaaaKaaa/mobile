import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Alert } from 'react-native';

const App = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = '1fcbf508ba47d5cb88a2af309d1d7906'; 
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  const inputLatRef = useRef(null); 
  const inputLonRef = useRef(null);

  const isInputValid = useMemo(() => {
    return (
      !isNaN(parseFloat(latitude)) &&
      !isNaN(parseFloat(longitude)) &&
      latitude !== '' &&
      longitude !== ''
    );
  }, [latitude, longitude]); 

  const fetchWeather = async () => {
    if (!isInputValid) {
      Alert.alert('Erro', 'Por favor, insira valores válidos.');
      return;
    }

    setLoading(true);
    setWeather(null);

    try {
      const response = await fetch(
        `${apiUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );
      if (!response.ok) throw new Error('Erro ao buscar os dados climáticos');
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os dados do clima.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inputLatRef.current.focus(); 
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clima Atual</Text>
      <TextInput
        ref={inputLatRef}
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        ref={inputLonRef}
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
      <Button title="Buscar Clima" onPress={fetchWeather} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {weather && (
        <View style={styles.climaconteiner}>
          <Text style={styles.cidade}>{weather.name || 'Local desconhecido'}</Text>
          <Text style={styles.temperatura}>Temperatura: {weather.main.temp}°C</Text>
          <Text style={styles.umidade}>Umidade: {weather.main.humidity}%</Text>
          <Text style={styles.desc}>Clima: {weather.weather[0].description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ff1493',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    backgroundColor:"#f18dbc",
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  climaconteiner: {
    marginTop: 22,
    alignItems: 'center',
  },
  cidade: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  temperatura: {
    fontSize: 22,
    marginVertical: 5,
  },
  umidade: {
    fontSize: 22,
  },
  desc: {
    fontSize: 20,
    color: '#555',
  },
});

export default App;
