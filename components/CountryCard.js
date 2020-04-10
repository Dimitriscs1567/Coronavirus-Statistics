import React from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableNativeFeedback } from 'react-native';
import { formatNumber, getPercent } from '../utils/utils'

const CountryCard = (props) => {    

    return (
        <View style={styles.touch} >
            <TouchableNativeFeedback onPress={()=>props.onCountryPress(props.country)} >
                <View style={styles.card}>
                    <Text style={styles.title}>{props.country.country}</Text>
                    <View style={styles.row}>
                        <View style={{...styles.circle, backgroundColor: '#95cff3'}}>
                            <Text style={styles.dataTitle}>Total Cases:</Text>
                            <Text style={styles.data}>{formatNumber(props.country.cases.total)}</Text>
                        </View>
                        <View style={{...styles.circle, backgroundColor: '#95cff3'}}>
                            <Text style={styles.dataTitle}>New Cases:</Text>
                            <Text style={styles.data}>{formatNumber(props.country.cases.new)}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{...styles.circle, backgroundColor: '#95cff3'}}>
                            <Text style={styles.dataTitle}>Active Cases:</Text>
                            <Text style={styles.data}>{formatNumber(props.country.cases.active)}</Text>
                        </View>
                        <View style={{...styles.circle, backgroundColor: '#95cff3'}}>
                            <Text style={styles.dataTitle}>Critical Cases:</Text>
                            <Text style={styles.data}>
                                {formatNumber(props.country.cases.critical) + ` (${getPercent(props.country, 'critical')})`}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{...styles.circle, backgroundColor: '#95cff3'}}>
                            <Text style={styles.dataTitle}>Total Deaths:</Text>
                            <Text style={styles.data}>
                                {formatNumber(props.country.deaths.total) + ` (${getPercent(props.country, 'deaths')})`}
                            </Text>
                        </View>
                        <View style={{...styles.circle, backgroundColor: '#95cff3'}}>
                            <Text style={styles.dataTitle}>New Deaths:</Text>
                            <Text style={styles.data}>{formatNumber(props.country.deaths.new)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    touch: {
        overflow: 'hidden',
        borderRadius: 10,
        elevation: 5.0,
        marginVertical: 20,
    },
    card: {
        width: Dimensions.get('window').width * 0.90,
        backgroundColor: '#5b7180',
        alignItems: 'center',
        borderRadius: 10,
        padding: 5
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flex: 1,
        paddingVertical: 3,
    },
    circle: {
        elevation: 5.0,
        borderRadius: Dimensions.get('window').width * 0.90 * 0.45 / 2,
        width: Dimensions.get('window').width * 0.90 * 0.45,
        height: Dimensions.get('window').width * 0.90 * 0.45,
        alignItems: 'center',
        justifyContent: 'center',
    },  
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white'
    },
    dataTitle:{
        fontSize: 21,
        fontWeight: 'bold',
        color: 'black'
    },
    data:{
        fontSize: 19,
        fontWeight: 'bold',
        color: '#38361c'
    }
});

export default CountryCard;