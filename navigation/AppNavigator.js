import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator} from "react-navigation-stack";

import Livlag from "../helpers/Livlag";

import AboutScreen from "../screens/AboutScreen";
import CalculateScreen from "../screens/CalculateScreen";
import CalculateRangeScreen from "../screens/CalculateRangeScreen";
import CalculateChartScreen from "../screens/CalculateChartScreen";
import GalleryScreen from "../screens/GalleryScreen";
import DataBaseScreen from "../screens/DataBaseScreen";
import ContactsScreen from "../screens/ContactsScreen";
import GPSScreen from "../screens/GPSScreen";
import MapScreen from "../screens/MapScreen"
import HofmanScreen from "../screens/HofmanScreen";


const Screens = [
    {
        name: 'About',
        title: "Про автора",
        screen: AboutScreen
    },
    [
        {
            name: "Calculate",
            title: "Розрахунок",
            screen: CalculateScreen,
            hide: true
        },
        {
            name: "CalculateRange",
            title: "Розрахунок проміжку",
            screen: CalculateRangeScreen,
            hide: true
        },
        {
            name: "CalculateChart",
            title: "Графік функції",
            screen: CalculateChartScreen,
            hide: true
        }
    ],
    {
        name: "Gallery",
        title: "Галерея",
        screen: GalleryScreen,
        hide: true
    },
    {
        name: "DataBase",
        title: "БД",
        screen: DataBaseScreen
    },
    {
        name: "Contacts",
        title: "Контакти",
        screen: ContactsScreen,
        hide: true
    },
    [
        {
            name: "GPS",
            title: "GPS",
            screen: GPSScreen
        },
        {
            name: "Map",
            title: "Map",
            screen: MapScreen
        }
    ],
    {
        name: "Hofman",
        title: "Кодування",
        screen: HofmanScreen
    }
];

function getInnerNavigator(value) {
    let config = {};
    if (value instanceof Array) {
        for (let i = 0; i < value.length; i++) {
            if (!value[i].hide) {
                config[value[i].name] = {
                    screen: value[i].screen,
                    navigationOptions: {
                        title: value[i].title
                    }
                }
            }
        }
    }
    else {
        if (!value.hide) {
            config[value.name] = {
                screen: value.screen,
                navigationOptions: {
                    title: value.title
                }
            }
        }
    }
    return Livlag.objectIsEmpty(config) ? null : createStackNavigator(config);
}
function getNavConfig() {
    let config = {};
    for (let i = 0; i < Screens.length; i++) {
        let value = Screens[i];
        let firstValue = (value instanceof Array) ? value[0] : value;

        let screenConfig = getInnerNavigator(value);
        if (screenConfig) {
            config[firstValue.name] = {
                screen: getInnerNavigator(value),
                navigationOptions: {
                    title: firstValue.title
                }
            }
        }


    }
    return config;
}

const AppNavigator = createBottomTabNavigator(getNavConfig(), {
    initialRouteName: "GPS"
});

export default createAppContainer(AppNavigator)