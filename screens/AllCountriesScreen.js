import React, { useEffect, useState, Fragment } from 'react';
import { 
    StyleSheet, 
    View, 
    FlatList, 
    ActivityIndicator, 
    TouchableNativeFeedback, 
    TextInput,
    Animated,
    Dimensions,
    Keyboard,
} from 'react-native';
import CountryCard from '../components/CountryCard';
import { x_rapidapi_host, x_rapidapi_key } from 'react-native-dotenv';
import { AntDesign, FontAwesome } from '@expo/vector-icons'

const AllCountriesScreen = (props) => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [showFloatButton, setShowFloatButton] = useState(false);
    const [flatList, setFlatList] = useState(null);
    const [filter, setFilter] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [leftPosition] = useState(new Animated.Value(
        - (Dimensions.get('window').width / 2) + 40
    ));

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
                getFilteredCountries(filterData(result.response));
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

    const getFilteredCountries = (allCountries, tempFilter)=>{
        const finalFilter = tempFilter ?? filter;

        if(finalFilter !== ''){
            setFilteredCountries(allCountries.filter(
                c => c.country.toLowerCase().includes(finalFilter.toLowerCase()))
            )
        }
        else{
            setFilteredCountries(allCountries)
        }
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

    const changeFilter = (text) => {
        setFilter(text);
        getFilteredCountries(countries, text);
    }

    const toggleSearchOpen = ()=>{
        if(!isSearchOpen){
            Animated.timing(leftPosition, {
                toValue: 0,
                duration: 200,
            }).start(()=>{
                setIsSearchOpen(true);
            });
        }
        else{
            Animated.timing(leftPosition, {
                toValue: - (Dimensions.get('window').width / 2) + 40,
                duration: 200,
            }).start(()=>{
                setIsSearchOpen(false);
                Keyboard.dismiss();
            });
        }
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
                    data={filteredCountries}
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
                <Animated.View style={{...styles.search, left: leftPosition}}>
                    <TextInput 
                        onChangeText={changeFilter} 
                        style={styles.input} 
                        editable={isSearchOpen} />
                    <TouchableNativeFeedback style={styles.searchIcon} onPress={toggleSearchOpen} >
                        <FontAwesome 
                            style={styles.searchIcon} 
                            name='search' 
                            size={25} 
                            color={filter !== '' ? 'green' : 'black'} />
                    </TouchableNativeFeedback>
                </Animated.View>
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
    search: {
        position: 'absolute',
        flexDirection: 'row',
        top: 15.0,
        backgroundColor: 'white',
        width: '50%',
        borderTopRightRadius: 20.0,
        borderBottomRightRadius: 20.0
    }, 
    searchIcon: {
        position: 'absolute',
        top: 5.0,
        right: 6.0,
    },
    input: {
        fontSize: 20.0,
        flex: 1,
        borderColor: 'black',
        borderTopWidth: 1.0,
        borderBottomWidth: 1.0,
        borderRightWidth: 1.0,
        paddingVertical: 3.0,
        paddingLeft: 5.0,
        paddingRight: 28.0,
        borderTopRightRadius: 20.0,
        borderBottomRightRadius: 20.0
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