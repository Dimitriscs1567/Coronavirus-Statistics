import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { formatNumber, getPercent } from '../utils/utils'

const CountryScreen = (props) => {
    const country = props.route.params.country;

    return <View style={styles.main}>
        <View style={styles.row}>
            <Text style={styles.text}>
                Total Cases: {formatNumber(country.cases.total)}
            </Text>
            <Text style={styles.text}>
                New Cases: {formatNumber(country.cases.new)}
            </Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.text}>
                Active Cases: {formatNumber(country.cases.active)}
            </Text>
            <Text style={styles.text}>
                Critical Cases: {formatNumber(country.cases.critical)}
            </Text>
        </View>
    </View>
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: "space-between",
        margin: 20,
    },
    text: {
        fontSize: 15,
    }
});

export default CountryScreen;