import React, {useState} from 'react'
import { View, StyleSheet, Platform, ScrollView } from 'react-native'
import { formatDate } from '../utils/utils'
import { x_rapidapi_host, x_rapidapi_key } from 'react-native-dotenv';
import { LineChart } from "react-native-chart-kit";
import CountryStats from '../components/CountryStats';

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

    return <ScrollView >
            <CountryStats 
                showDatePicker={showDatePicker}
                onChange={onChange}
                date={date}
                datePicker={datePicker}
                country={country}
                loading={loading}
            />
        <View>
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
});

export default CountryScreen;