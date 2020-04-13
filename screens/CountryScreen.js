import React, {useState, useEffect} from 'react'
import { View, StyleSheet, Platform, ScrollView, Text } from 'react-native'
import { formatDate } from '../utils/utils'
import { x_rapidapi_host, x_rapidapi_key } from 'react-native-dotenv';
import CountryStats from '../components/CountryStats';
import { formatDateForChart } from '../utils/utils'
import CountryCharts from '../components/CountryCharts';

const CountryScreen = (props) => {

    const [country, setCountry] = useState(props.route.params.country);
    const [date, setDate] = useState(new Date(props.route.params.country.day));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loadingStats, setLoadingStats] = useState(false);
    const [loadingCharts, setLoadingCharts] = useState(true);
    const [chartStats, setChartStats] = useState([]);

    useEffect(() => {
        fetch(`https://covid-193.p.rapidapi.com/history?country=${country.country}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": `${x_rapidapi_host}`,
                "x-rapidapi-key": `${x_rapidapi_key}`,
            }
        })
        .then(response => {
            response.json().then(result => {
                if(result.results > 0){
                    getStatsPerDay(result.response);
                    setLoadingCharts(false);
                }
            })
            .catch(err => {
                console.log(err);
                setLoadingCharts(false);
            });
        })
        .catch(err => {
            console.log(err);
            setLoadingCharts(false);
        });
    }, []);

    const getStatsPerDay = (allData) => {
    
        let totalStats = [{
            totalCases: allData[0].cases.total,
            newCases: allData[0].cases.new,
            totalDeaths: allData[0].deaths.total,
            day: formatDateForChart(new Date(allData[0].time)),
        }];
        let prevDate = new Date(allData[0].time.toString().split('T')[0])

        for(let i = 1; i < allData.length; i++){
            let newDate = new Date(allData[i].time.toString().split('T')[0]);

            if(prevDate.getTime() > newDate.getTime()){
                totalStats.push({
                    totalCases: allData[i].cases.total,
                    newCases: allData[i].cases.new,
                    totalDeaths: allData[i].deaths.total,
                    day: formatDateForChart(new Date(allData[i].time)),
                });
                prevDate = new Date(newDate.getTime());
            }
        } 

        setChartStats(totalStats.reverse());
    }

    const datePicker = () => {
        setShowDatePicker(true);
    }

    const onChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');

        if(!selectedDate || selectedDate.toISOString() === date.toISOString()){
            return;
        }

        setDate(selectedDate);

        setLoadingStats(true);

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
                setLoadingStats(false);
            })
            .catch(err => {
                setLoadingStats(false);
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err)
            setLoadingStats(false);
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
            loading={loadingStats}
        />
        <View style={styles.divider}/>
        <CountryCharts loading={loadingCharts} chartStats={chartStats} />
    </ScrollView>
}

const styles = StyleSheet.create({
    divider: {
        flexDirection: 'row',
        margin: 10.0,
        borderBottomWidth: 2.0,
        borderBottomColor: 'black'
    },
});

export default CountryScreen;