import React, { Fragment } from 'react'
import { View, StyleSheet, ActivityIndicator, Dimensions, Text } from 'react-native'
import { LineChart } from "react-native-chart-kit";

const CountryCharts = (props) => {

    const chartConfig = {
        backgroundGradientFrom: "grey",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "grey",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 1,
        barPercentage: 0.5,
        decimalPlaces: 0,
        propsForDots: {
            r: "3",
        },
    };

    const getLabels = ()=>{
        const add = Math.floor(props.chartStats.length / 4);
        const labels = [props.chartStats[0].day];
        
        for(let i=1; i<props.chartStats.length; i++){
            if(i % add === 0){
                labels.push(props.chartStats[i].day);
            }
            else{
                labels.push('');
            }
        }

        if(labels[labels.length - 1] === ''){
            labels[labels.length - 1] = props.chartStats[props.chartStats.length - 1].day;
        }

        labels[labels.length - 2] = '';
        labels[labels.length - 3] = '';
        labels[labels.length - 4] = '';

        return labels;
    }

    const getChart = (title, data)=>{
        return <Fragment>
            <Text style={styles.chartTitle}>{title}</Text>
            <LineChart 
                width={Dimensions.get("window").width}
                height={220}
                data={{
                    labels: getLabels(),
                    datasets: [
                        {
                            data: data
                        }
                    ]
                }}
                chartConfig={chartConfig}
            />
        </Fragment>
    }

    if(props.loading){
        return <View style={styles.main}>
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        </View>
    }

    return <View style={styles.main}>
        {getChart('Total Cases', props.chartStats.map(stat => stat.totalCases))}
        {getChart('New Cases', props.chartStats.map(stat => stat.newCases))}
        {getChart('Active Cases', props.chartStats.map(stat => stat.activeCases))}
        {getChart('Critical Cases', props.chartStats.map(stat => stat.criticalCases))}
        {getChart('Total Deaths', props.chartStats.map(stat => stat.totalDeaths))}
        {getChart('New Deaths', props.chartStats.map(stat => stat.newDeaths))}
    </View>
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
    },
    loading:{
        flex: 1,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 25.0,
        textAlign: 'center',
        marginBottom: 10.0,
        marginTop: 25.0
    }
});

export default CountryCharts;