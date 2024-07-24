import React, { useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    StatusBar,
    ImageBackground,
    PermissionsAndroid,
    useColorScheme,
    Appearance,
    AppState,
    StyleSheet,
    TextInput,
    Image,
} from "react-native";
import styles from '../../styles/style-app';
import animaciones from '../../components/animaciones/animaciones';
import { crearTablas } from '../../services/database/SQLite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCache } from "./../../services/storage/CacheContext";
import { useSelector, useDispatch } from 'react-redux';
import { setModeTheme, setTheme } from '../../services/redux/slices/themeSlice';

const Inicio = ({ navigation }) => {
    const {
        unoAnim,
        translateAnimDOWN,
        startAnimations,
    } = animaciones();

    const requestWritePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Permiso de escritura en almacenamiento externo',
                    message: 'Necesitamos tu permiso para escribir en el almacenamiento externo.',
                    buttonNeutral: 'Preguntar más tarde',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'OK',
                },
            );
            granted;
        } catch (err) {
            console.warn(err);
        }
    };

    const { setCacheData } = useCache();

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@form_default');
            if (jsonValue !== null) {
                const defaultData = JSON.parse(jsonValue);
                setCacheData(defaultData);
            }
        } catch (e) {
            console.error('Error al recuperar datos de AsyncStorage:', e);
        }
    };

    const dispatch = useDispatch();
    const systemTheme = useColorScheme();
    const { currentTheme, themes, modeTheme } = useSelector((state) => state.theme);

    const initializeTheme = async () => {
        try {
            const themeValue = await AsyncStorage.getItem('theme');
            dispatch(setModeTheme(themeValue || 'system'));
        } catch (e) {
            console.error('Error al recuperar datos de AsyncStorage:', e);
        }
    };

    useEffect(() => {
        const initializeApp = async () => {
            await crearTablas();
            await requestWritePermission();
            await getData();
            await initializeTheme();
            startAnimations();
        };
        initializeApp();
    }, []);

    useEffect(() => {
        if (modeTheme === 'system') {
            dispatch(setTheme(systemTheme));
        } else {
            dispatch(setTheme(modeTheme));
        }
    }, [modeTheme, systemTheme]);

    useEffect(() => {
        if (modeTheme === 'system') {
            const handleAppearanceChange = ({ colorScheme }) => {
                dispatch(setTheme(colorScheme));
            };
            const listener = Appearance.addChangeListener(handleAppearanceChange);
            return () => listener.remove();
        }
    }, [modeTheme]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active' && modeTheme === 'system') {
                dispatch(setTheme(Appearance.getColorScheme()));
            }
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [modeTheme]);

    const theme = themes[currentTheme] || themes[systemTheme] || themes.light;
    const { imageBackgroundInicio, logoInicio, colorStatusBarInicio, iconoUsuario, iconoContraseña, colorPrimario, colorTerciario, colorTexto } = theme;

    const styles = StyleSheet.create({
        input: {
          backgroundColor: colorPrimario,
          borderColor: colorTerciario,
          color: colorTexto,
          fontWeight: 'bold',
          borderWidth: 2,
          borderRadius: 10,
          paddingLeft: 10,
          marginBottom: 25,
          height: 40,
          width: '85%'
        },
        button: {
          backgroundColor: colorTerciario,
          borderRadius: 25,
          width: '35%',
          paddingVertical: 10,
          alignItems: 'center',
        },
        buttonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
        },
        labelText: {
          color: colorTexto,
          fontSize: 16,
        },
    });

    return (
        <ImageBackground source={imageBackgroundInicio} resizeMode="cover" style={{ flex: 1, width: '100%', height: '100%' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <StatusBar
                    animated={true}
                    backgroundColor={colorStatusBarInicio}
                />
                <Animated.View style={{ flex: 1, flexDirection: 'row', overflow: 'hidden', transform: [{ translateY: translateAnimDOWN }, { scale: unoAnim }] }}>
                    <View style={{ flex: 1 }}></View>
                    <ImageBackground source={logoInicio} resizeMode="contain" style={{ flex: 8 }}></ImageBackground>
                    <View style={{ flex: 1 }}></View>
                </Animated.View>
                <Animated.View style={{ flex: 1, width: '100%', opacity: unoAnim }}>
                    <View style={{width: '80%',  alignSelf: 'center'}}>
                        <View style={{flexDirection: 'row', alignSelf: 'center' }}>
                            <Image source={iconoUsuario} style={{ width: 40, height: 40, marginRight: 10 }}/>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de Usuario"
                                placeholderTextColor="#888"
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignSelf: 'center' }}>
                            <Image source={iconoContraseña} style={{ width: 45, height: 45, marginRight: 5 }}/>
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                secureTextEntry
                                placeholderTextColor="#888"
                            />
                        </View>
                        <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.labelText, { marginTop: -20, textDecorationLine: 'underline' }]}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>
                        
                    </View>
                    <TouchableOpacity style={[styles.button, { alignSelf: 'center', marginTop: 25 }]}  onPress={() => { navigation.navigate('Home'); }}>
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'column', paddingLeft: 30,  }}>
                        <Text style={[styles.labelText, { marginTop: 100 }]}>¿No tienes cuenta?</Text>
                        <TouchableOpacity style={[styles.button, { marginTop: 5 }]}>
                            <Text style={styles.buttonText}>Registrate</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </ImageBackground>
    );
};

export default Inicio;
