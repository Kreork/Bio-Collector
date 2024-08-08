import React, { useEffect, useState } from 'react';
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
    KeyboardAvoidingView,
    TextInput,
    Image,
    ActivityIndicator,
    Alert,
} from "react-native";
import styles from '../../styles/style-app';
import animaciones from '../../components/animaciones/animaciones';
import { crearTablas } from '../../services/database/SQLite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCache } from "./../../services/storage/CacheContext";
import { useSelector, useDispatch } from 'react-redux';
import { setModeTheme, setTheme } from '../../services/redux/slices/themeSlice';
import { useForm, Controller } from 'react-hook-form';
import pb from '../../services/PocketBase/pocketbase';
import { loginUser, logoutUser, registerUser, checkUserAuthentication } from '../../services/auth/AuthFunctions';

const Inicio = ({ navigation }) => {
    const {
        unoAnim,
        translateAnimDOWN,
        translateAnimUP,
        startAnimations,
        resetAnimations,
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
          marginBottom: 20,
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

    // const [isLogin, setIsLogin] = useState(true);
    // const [errorMessage, setErrorMessage] = useState('');

    const { isAuthenticated, loading, error, token } = useSelector((state) => state.auth);

    // const { control, handleSubmit, reset } = useForm({
    //     defaultValues: {
    //         username: '',
    //         email: '',
    //         password: '',
    //         passwordConfirm: '',
    //     },
    // });

    // const [cargando, setCargando] = useState(false);

    // const onSubmit = async (data) => {
    //     setCargando(true);
    //     if (isLogin) {
    //         await dispatch(loginUser(data.email, data.password));
    //         console.log('Token despues del login...', token);
    //         const authToken = await AsyncStorage.getItem('userToken');
    //         console.log('Token despues del login en AsyncStorage...', authToken);
    //         if (authToken) {
    //             reset();
    //             resetAnimations(navigation,'Home');
    //             setTimeout(() => {
    //                 startAnimations();
    //             }, 500);
    //         }
    //     } else {
    //         await dispatch(registerUser(data.username, data.email, data.password, data.passwordConfirm));
    //         setIsLogin(true);
    //         reset();
    //     }
    //     setCargando(false);
    // };

    const handleLogout = async () => {
        await dispatch(logoutUser());
    };

    useEffect(() => {
        // Verifica el estado de autenticación al montar el componente
        const checkAuth = async () => {
            try {
                // await AsyncStorage.removeItem('userToken');
                // dispatch(logoutUser());
                console.log('Checking authentication...');
                await dispatch(checkUserAuthentication());
            } catch (error) {
                console.error('Error checking authentication:', error);
                // Handle the error here, e.g. show an error message to the user
            }
        };
        checkAuth();
    }, [dispatch]);    

    useEffect(() => {
        console.log('isAuthenticated changed:', isAuthenticated);
    }, [isAuthenticated]);


    return (
        <ImageBackground source={imageBackgroundInicio} resizeMode="cover" style={{ flex: 1, width: '100%', height: '100%' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar
                    animated={true}
                    backgroundColor={colorStatusBarInicio}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1, width:'100%'}}
                >

                    <Animated.View style={{ flex: 30, flexDirection: 'row', overflow: 'hidden', transform: [{ translateY: translateAnimDOWN }, { scale: unoAnim }] }}>
                        <View style={{ flex: 1 }}></View>
                        <ImageBackground source={logoInicio} resizeMode="contain" style={{ flex: 8, margin:20 }}></ImageBackground>
                        <View style={{ flex: 1 }}></View>
                    </Animated.View>

                { !isAuthenticated ? (
                    <Animated.View style={{ flex: 10, width: '100%', opacity: unoAnim, gap:10, justifyContent:'center' }}>
                        <TouchableOpacity style={[styles.button, { alignSelf: 'center' }]} onPress={() => navigation.navigate("Home")}>
                            <Text style={styles.buttonText}>Ir a Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { alignSelf: 'center' }]} onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <Animated.View style={{ flex: 10, width: '100%', opacity: unoAnim, gap:10, justifyContent:'center' }}>
                        <TouchableOpacity style={[styles.button, { alignSelf: 'center' }]} onPress={() => navigation.navigate("Home")}>
                            <Text style={styles.buttonText}>Ir a Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { alignSelf: 'center' }]} onPress={handleLogout}>
                            <Text style={styles.buttonText}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    );
};

export default Inicio;
