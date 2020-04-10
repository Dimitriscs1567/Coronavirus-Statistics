import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { formatNumber, getPercent, formatDate } from '../utils/utils'
import DateTimePicker from '@react-native-community/datetimepicker';

const CountryStats = (props) => {

    if(props.loading){
        return <View style={styles.main}>
            <View style={styles.titleContainer}>
                <Text style={styles.pressableText} onPress={props.datePicker}>
                    {formatDate(props.date)}
                </Text>
            </View>
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        </View>
    }

    return <View style={styles.main}>

        { props.showDatePicker && (
            <DateTimePicker 
                mode='date'
                onChange={props.onChange}
                value={props.date}
                minimumDate={new Date('2020-01-01')}
                maximumDate={new Date(Date.now())}
            />
        )}

        <View style={styles.titleContainer}>
            <Text style={styles.pressableText} onPress={props.datePicker}>
                {formatDate(props.date)}
            </Text>
        </View>
        <View style={styles.row}>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    Total Cases:{'\n' + formatNumber(props.country.cases.total)}
                </Text>
            </View>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    New Cases:{'\n' + formatNumber(props.country.cases.new)}
                </Text>
            </View>
        </View>
        <View style={styles.row}>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    Active Cases:{'\n' + formatNumber(props.country.cases.active)}
                </Text>
            </View>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    Critical Cases:{
                        '\n' + formatNumber(props.country.cases.critical)
                        + ` (${getPercent(props.country, 'critical')})`
                    }
                </Text>
            </View>
        </View>
        <View style={styles.row}>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    Total Deaths:{
                        '\n' + formatNumber(props.country.deaths.total)
                        + ` (${getPercent(props.country, 'deaths')})`
                    }
                </Text>
            </View>
            <View style={styles.miniRow}>
                <Text style={styles.text}>
                    New Deaths:{'\n' + formatNumber(props.country.deaths.new)}
                </Text>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        height: 350,
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

export default CountryStats;