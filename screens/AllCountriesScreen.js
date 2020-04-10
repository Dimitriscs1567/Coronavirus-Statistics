import React, { useEffect, useState, Fragment } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import CountryCard from '../components/CountryCard';
import { x_rapidapi_host, x_rapidapi_key } from 'react-native-dotenv';
import { AntDesign } from '@expo/vector-icons'

const AllCountriesScreen = (props) => {
    const [countries, setCountries] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showFloatButton, setShowFloatButton] = useState(false);
    const [flatList, setFlatList] = useState(null);

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
            c => c.country !== 'Europe'
                && c.country !== 'Asia'
                && c.country !== 'Africa'
                && c.country !== 'Oceania'
                && c.country !== 'North-America'
                && c.country !== 'South-America'
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

    const handleScroll = (event) => {
        if(event.nativeEvent.contentOffset.y > 2000){
            if(!showFloatButton){
                setShowFloatButton(true);
            } 
        }
        else{
            if(showFloatButton){
                setShowFloatButton(false);
            }
        }
    }

    const goToTop = () => {
        if(flatList){
            flatList.scrollToOffset({ animated: true, offset: 0 });
        }
    }

    const onCountryPress = (country) => {
        props.navigation.navigate('Country', { country: country });
    }

    const body = countries.length === 0
        ? <ActivityIndicator size="large" color="blue" />
        : (
        <Fragment>
            <FlatList
                ref={(ref) => { setFlatList(ref); }}
                onScroll={handleScroll}
                onRefresh={getData}
                refreshing={refreshing}
                contentContainerStyle={styles.list}
                data={countries}
                renderItem={item => <CountryCard country={item.item} onCountryPress={onCountryPress} />}
                keyExtractor={item => item.country}
            />
            { showFloatButton ? <View style={styles.touchContainer}>
                <TouchableNativeFeedback onPress={goToTop} >
                    <View style={styles.floatButton}>
                        <AntDesign name='arrowup' size={40} />
                    </View>
                </TouchableNativeFeedback>
            </View> : null}
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
        justifyContent: 'center'
    },
    list: {
        alignItems: 'center',
    },
    floatButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'green',
        borderRadius: 30,
    },  
    touchContainer:{
        overflow: 'hidden',
        position: 'absolute',
        elevation: 5.0,
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
    },
});

export default AllCountriesScreen;