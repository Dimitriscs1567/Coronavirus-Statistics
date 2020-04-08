import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack' 
import AllCountriesScreen from '../screens/AllCountriesScreen';
import CountryScreen from '../screens/CountryScreen';

const StackNavigator = createStackNavigator();

const AppNavigator = (props) => {

    return <NavigationContainer>
        <StackNavigator.Navigator>
            <StackNavigator.Screen 
                name='AllCountries' 
                component={AllCountriesScreen} 
                options={{
                    headerTitle: 'All Countries',
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: 'pink' }
                }}
            />
            <StackNavigator.Screen 
                name='Country' 
                component={CountryScreen} 
                options={
                    (navData)=>{
                        return {
                            headerTitle: navData.route.params.country.country,
                            headerTitleAlign: 'center',
                            headerStyle: { backgroundColor: 'pink' }
                        };
                    }
                }
            />
        </StackNavigator.Navigator>
    </NavigationContainer>;
}

export default AppNavigator;