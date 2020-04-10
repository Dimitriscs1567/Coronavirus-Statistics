import React, {useState} from 'react'
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native'
import { formatNumber, getPercent, formatDate } from '../utils/utils'
import DateTimePicker from '@react-native-community/datetimepicker';
import { x_rapidapi_host, x_rapidapi_key } from 'react-native-dotenv';

const CountryScreen = (props) => {

    const [country, setCountry] = useState(props.route.params.country);
    const [date, setDate] = useState(new Date(props.route.params.country.day));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const datePicker = () => {
        setShowDatePicker(true);
    }

    const onChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');

        if(!selectedDate || selectedDate.toISOString() === date.toISOString()){
            return;
        }

        setDate(selectedDate);

        setLoading(true);

        fetch(`https://covid-193.p.rapidapi.com/history?day=${formatDate(selectedDate)}&country=${country.country}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": `${x_rapidapi_host}`,
                "x-rapidapi-key": `${x_rapidapi_key}`,
            }
        })
        .then(response => {
            response.json().then(result => {
                if(result.response.length === 0){
                    allZeros();
                }
                else{
                    setCountry(result.response[0])
                }
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err)
            setLoading(false);
        });
    };

    const allZeros = () => {
        setCountry(prevCountry => {
            const newCountry = {
                ...prevCountry,
                cases: { total: 0, new: 0, critical:0 },
                deaths: { total: 0, new: 0 }  
            };

            return newCountry;
        });
    }

    if(loading){
        return <View style={styles.main}>
            <View style={styles.titleContainer}>
                <Text style={styles.pressableText} onPress={datePicker}>
                    {formatDate(date)}
                </Text>
            </View>
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        </View>
    }

    return <View style={styles.main}>
        <View style={styles.titleContainer}>
            <Text style={styles.pressableText} onPress={datePicker}>
                {formatDate(date)}
            </Text>
        </View>
        <View style={styles.row}>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    Total Cases:{'\n' + formatNumber(country.cases.total)}
                </Text>
            </View>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    New Cases:{'\n' + formatNumber(country.cases.new)}
                </Text>
            </View>
        </View>
        <View style={styles.row}>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    Active Cases:{'\n' + formatNumber(country.cases.active)}
                </Text>
            </View>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    Critical Cases:{
                        '\n' + formatNumber(country.cases.critical)
                        + ` (${getPercent(country, 'critical')})`
                    }
                </Text>
            </View>
        </View>
        <View style={styles.row}>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    Total Deaths:{
                        '\n' + formatNumber(country.deaths.total)
                        + ` (${getPercent(country, 'deaths')})`
                    }
                </Text>
            </View>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    New Deaths:{'\n' + formatNumber(country.deaths.new)}
                </Text>
            </View>
            { showDatePicker && (
                <DateTimePicker 
                    mode='date'
                    onChange={onChange}
                    value={date}
                    minimumDate={new Date('2020-01-01')}
                    maximumDate={new Date(Date.now())}
                />
            )}
        </View>
    </View>
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        flex: 1,
    },
    titleContainer: {
        alignItems: 'center',
        margin: 20,
    },
    row: {
        flexDirection: 'row',
        margin: 20,
    },
    miniRow: {
        flex: 1,
    },  
    text: {
        fontSize: 19,
        textAlign: 'center'
    },
    pressableText:{
        fontSize: 21,
        color: 'blue',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    loading:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CountryScreen;