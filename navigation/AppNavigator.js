import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator} from "react-navigation-stack";

import AboutScreen from "../screens/AboutScreen";
import CalculateScreen from "../screens/CalculateScreen";
import CalculateRangeScreen from "../screens/CalculateRangeScreen";
import CalculateChartScreen from "../screens/CalculateChartScreen";
import GalleryScreen from "../screens/GalleryScreen";
import DataBaseScreen from "../screens/DataBaseScreen";
import ContactsScreen from "../screens/ContactsScreen";


const _About = createStackNavigator({
    About: {
        screen: AboutScreen,
        navigationOptions: {
            title: "Про автора"
        }
    }
})
const _Calculate = createStackNavigator({
    Calculate: {
        screen: CalculateScreen,
        navigationOptions: {
            title: "Розрахунок"
        }
    },
    CalculateRange: {
        screen: CalculateRangeScreen,
        navigationOptions: {
            title: "Розрахунок проміжку"
        }
    },
    CalculateChart: {
        screen: CalculateChartScreen,
        navigationOptions: {
            title: "Графік функції"
        }
    }
})
const _Gallery = createStackNavigator({
    Gallery: {
        screen: GalleryScreen,
        navigationOptions: {
            title: "Галерея"
        }
    }
})
const _DataBase = createStackNavigator({
    DataBase: {
        screen: DataBaseScreen,
        navigationOptions: {
            title: "БД"
        }
    }
})
const _Contacts = createStackNavigator({
    Contacts: {
        screen: ContactsScreen,
        navigationOptions: {
            title: "Контакти"
        }
    }
})

const AppNavigator = createBottomTabNavigator({
    About: {
        screen: _About,
        navigationOptions: {
            title: "Про автора"
        }
    },
    Calculate: {
        screen: _Calculate,
        navigationOptions: {
            title: "Розрахунок"
        }
    },
    Gallery: {
        screen: _Gallery,
        navigationOptions: {
            title: "Галерея"
        }
    },
    DataBase: {
        screen: _DataBase,
        navigationOptions: {
            title: "БД"
        }
    },
    Contacts: {
        screen: _Contacts,
        navigationOptions: {
            title: "Контакти"
        }
    }
}, {
    initialRouteName: "Contacts"
});

export default createAppContainer(AppNavigator)