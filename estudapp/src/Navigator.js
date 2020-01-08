//import React from 'react';

import {createAppContainer} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';

import Agenda from './screens/Agenda';

import Auth from './screens/Auth';



const MainRoutes = createStackNavigator(

  {

    Auth: {

      name: 'Auth',

      screen: Auth,

    },

    Home: {

      name: 'Home',

      screen: Agenda,

    },

  },

  {

    headerMode: 'none',

    navigationOptions: {

      headerVisible: false,

    },

  },

);



const MainNavigator = createAppContainer(MainRoutes, {

  initialRouteName: 'Auth',

});

export default MainNavigator;