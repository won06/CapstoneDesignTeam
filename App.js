import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Login from './src/screens/login';
import SignUp from './src/screens/signup';
import Test from './src/screens/test';
import Test2 from './src/screens/test2';
import Job from './src/screens/job';
import Job12 from './src/screens/job12';
import Home from './src/screens/home';
import Lecture from './src/screens/lecture';
import Credential from './src/screens/credential';
import Company from './src/screens/company';
import Setting from './src/screens/setting';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Lecture') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Credential') {
            iconName = focused ? 'ribbon' : 'ribbon-outline';
          } else if (route.name === 'Job') {
            iconName = focused ? 'business' : 'business-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          backgroundColor: '#fff',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen 
        name="Lecture" 
        component={Lecture}
        options={{
          tabBarLabel: '강의',
        }}
      />
      <Tab.Screen 
        name="Credential" 
        component={Credential}
        options={{
          tabBarLabel: '자격증',
        }}
      />
      <Tab.Screen 
        name="Job" 
        component={Company}
        options={{ 
          tabBarLabel: '회사'
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{
          headerShown: true,
          headerBackTitle: '뒤로',
          headerBackVisible: true,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Test" 
          component={Test}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Test2" 
          component={Test2}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Job" 
          component={Job}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Job12" 
          component={Job12}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Setting" 
          component={Setting}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}