import React, { useEffect, useState, Fragment } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native';
import Constants from 'expo-constants';
import CountryCard from './components/CountryCard';
import { x_rapidapi_host, x_rapidapi_key } from 'react-native-dotenv';

export default function App() {

  const [countries, setCountries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getData = () => {
    setRefreshing(true);

    fetch("https://covid-193.p.rapidapi.com/statistics", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": `${x_rapidapi_host}`,
        "x-rapidapi-key": `${x_rapidapi_key}`
      }
    }).then(response => {
      response.json().then(result => {
        setRefreshing(false);
        setCountries(filterData(result.response))
      })
      .catch(err => {
        setRefreshing(false);
        console.log(err);
      });
    })
    .catch(err => {
      setRefreshing(false);
      console.log(err);
    });
  }

  const filterData = (unfilteredCountries) => {
    const unsortedCountries = unfilteredCountries.filter(
      c => c.country !== 'All'
    );

    unsortedCountries.sort((c1, c2) => {
      if (c1.cases.total > c2.cases.total) {
        return -1;
      }
      else if (c1.cases.total < c2.cases.total) {
        return 1;
      }

      return 0;
    });

    return unsortedCountries;
  }

  useEffect(() => {
    getData();
  }, []);

  const body = countries.length === 0
    ? <ActivityIndicator size="large" color="blue" />
    : (
      <Fragment>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.title}>All Countries</Text>
        <FlatList
          onRefresh={getData}
          refreshing={refreshing}
          contentContainerStyle={styles.list}
          data={countries}
          renderItem={item => <CountryCard country={item.item} />}
          keyExtractor={item => item.country}
        />
      </Fragment>
    );

  return (
    <View style={styles.background}>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    justifyContent: 'center',
  },
  list: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center'
  },
});
