import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native';

const CountryCard = (props) => {

    const formatNumber = (num) => {
        if(!num){
            return 0;
        }

        if(num.toString().charAt(0) === '+'){
            num = num.substring(1, num.length);
        }

        let stringNum = num.toString();
        const length = stringNum.length;
        const exact = length % 3 === 0;
        const dots = exact ? Math.floor(length / 3) - 1 : Math.floor(length / 3);
       
        for(let i=1; i<=dots; i++){
            const dotIndex = length - (i*3);
            
            stringNum = stringNum.substring(0, dotIndex) 
                        + '.' 
                        +  stringNum.substring(dotIndex, length + (i-1));
        }

        return stringNum;
    } 

    const getPercent = (type) => {
        if(type === 'critical'){
            return (props.country.cases.critical * 100 / props.country.cases.active)
                    .toFixed(1).toString() + "%";
        }
        else{
            return (props.country.deaths.total * 100 / props.country.cases.total)
                    .toFixed(1).toString() + "%";
        }
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{props.country.country}</Text>
            <View style={styles.row}>
                <View style={{...styles.circle, backgroundColor: 'blue'}}>
                    <Text style={styles.dataTitle}>Total Cases:</Text>
                    <Text style={styles.data}>{formatNumber(props.country.cases.total)}</Text>
                </View>
                <View style={{...styles.circle, backgroundColor: 'red'}}>
                    <Text style={styles.dataTitle}>New Cases:</Text>
                    <Text style={styles.data}>{formatNumber(props.country.cases.new)}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={{...styles.circle, backgroundColor: 'blue'}}>
                    <Text style={styles.dataTitle}>Active Cases:</Text>
                    <Text style={styles.data}>{formatNumber(props.country.cases.active)}</Text>
                </View>
                <View style={{...styles.circle, backgroundColor: 'red'}}>
                    <Text style={styles.dataTitle}>Critical Cases:</Text>
                    <Text style={styles.data}>
                        {formatNumber(props.country.cases.critical) + ` (${getPercent('critical')})`}
                    </Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={{...styles.circle, backgroundColor: 'blue'}}>
                    <Text style={styles.dataTitle}>Total Deaths:</Text>
                    <Text style={styles.data}>
                        {formatNumber(props.country.deaths.total) + ` (${getPercent('deaths')})`}
                    </Text>
                </View>
                <View style={{...styles.circle, backgroundColor: 'red'}}>
                    <Text style={styles.dataTitle}>New Deaths:</Text>
                    <Text style={styles.data}>{formatNumber(props.country.deaths.new)}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('window').width * 0.90,
        backgroundColor: 'orange',
        alignItems: 'center',
        elevation: 5.0,
        borderRadius: 10,
        marginVertical: 20,
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
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    dataTitle:{
        fontSize: 19,
        fontWeight: 'bold',
        color: 'white'
    },
    data:{
        fontSize: 19,
        fontWeight: 'bold',
        color: 'white'
    }
});

export default CountryCard;