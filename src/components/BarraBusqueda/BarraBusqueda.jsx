import { SearchBar } from "@rneui/themed";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Icon } from '@rneui/themed';
import { verGruposFiltrado, verTomas, consultarIdGrupo, verTomasFiltrado } from "../../services/database/SQLite";
import { View, Animated, TouchableOpacity, Easing } from "react-native";
import { useSelector } from "react-redux";
import { Dropdown } from 'react-native-element-dropdown';

// como implementar en canales

// funcion para actualizar los grupos a mostrar
//const updateGrupos = (nuevosGrupos) => {
//    setGrupos(nuevosGrupos); // Actualizamos los grupos con los resultados de la búsqueda
//};

// nueva forma de implementar la barra de busqueda
// <BarraBusqueda titulo={'Buscar grupo'} pantalla={'canales'} onResult={updateGrupos} />

// como implementar en tomas

// funcion para actualizar las tomas a mostrar
//const updateTomas = (nuevosTomas) => {
//    setListaTomas(nuevosTomas);
//};

// nueva forma de implementar la barra de busqueda
//<BarraBusqueda titulo={'Buscar en las tomas'} pantalla={nombreCanal} onResult={updateTomas} />




const BarraBusqueda = ({ titulo, pantalla, onResult }) => {
    const {currentTheme, themes} = useSelector((state) => state.theme);

    const theme = themes[currentTheme] || themes.light;
    const {  
        colorPrimario,
        colorSecundario,
        colorTerciario,
        colorCuaternario,
        colorQuinario,
    } = theme;

    const [value, setValue] = useState('nombre_cientifico');
    const [isFocus, setIsFocus] = useState(false);
    const data_filtro = useMemo(() => [
        { label: 'Nombre científico', value: 'nombre_cientifico' },
        { label: 'Familia', value: 'familia' },
        { label: 'Nombre local', value: 'nombre_local' },
        { label: 'Estado', value: 'estado' },
        { label: 'Municipio', value: 'municipio' },
        { label: 'Localidad', value: 'localidad' },
        { label: 'Tipo de vegetación', value: 'tipo_vegetacion' },
        { label: 'Información ambiental', value: 'informacion_ambiental' },
        { label: 'Suelo', value: 'suelo' },
        { label: 'Asociada', value: 'asociada' },
        { label: 'Abundancia', value: 'abundancia' },
        { label: 'Forma biologica', value: 'forma_biologica' },
        { label: 'Tamaño', value: 'tamano' },
        { label: 'Flor', value: 'flor' },
        { label: 'Fruto', value: 'fruto' },
        { label: 'Usos', value: 'usos' },
        { label: 'Colector_es', value: 'colector_es' },
        { label: 'Fecha', value: 'fecha' },
        { label: 'Determino', value: 'determino' },
        { label: 'Otros datos', value: 'otros_datos' },
    ], []);
    const [search, setSearch] = useState("");
    const [buscando, setBuscando] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let timerId;
        if (search.trim() !== "") {
            setBuscando(true);
            timerId = setTimeout(() => {
                peticion(search);
            }, 300);
        } else {
            peticion('');
        }

        return () => clearTimeout(timerId);
    }, [search]);

    useEffect(() => {
        if (pantalla !== 'canales' && value) {
            peticion(search);
        }
    }, [value]);

    const updateSearch = useCallback((searchInput) => {
        setSearch(searchInput);
    }, []);

    useEffect(() => {
        Animated.timing(animation, {
            toValue: showSearchBar ? 1 : 0,
            duration: 300,
            easing: Easing.bezier(0,.46,.7,.79),
            useNativeDriver: false,
        }).start();
    }, [showSearchBar]);

    const toggleSearchBar = useCallback(() => {
        setShowSearchBar(!showSearchBar);
    }, [showSearchBar]);

    const searchBarWidth = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '95%'],
    });

    const searchBarTranslate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
    });

    const peticion = useCallback((buscar) => {
        if (pantalla === "grupos") {
            verGruposFiltrado(buscar)
                .then(result => {
                    setBuscando(false);
                    onResult(result);
                })
                .catch(error => {
                    setBuscando(false);
                    console.error('Ocurrió un error al obtener los grupos:', error);
                });
        } else {
            onResult([buscar, value]);
            setBuscando(false);
        }
    }, [pantalla, value, onResult]);

    
    return (
        <View style={{ flexDirection: 'row', flex:1, paddingVertical:5, position:"relative"}}>
            <View style={{flex: 9, alignItems:"flex-end"}}>
                <Animated.View style={{overflow: 'hidden', width:searchBarWidth, transform: [{ translateX: searchBarTranslate }]}}>
                    <SearchBar
                        placeholder={titulo}
                        searchIcon={false}
                        inputContainerStyle={{ 
                            backgroundColor: colorPrimario, 
                            borderTopLeftRadius: 20, 
                            borderBottomLeftRadius: 20, 
                            borderTopRightRadius: 0, 
                            borderBottomRightRadius: 0, 
                            height:'100%',
                            borderBottomWidth: 0.3,
                            borderLeftWidth: 0.3,
                            borderTopWidth: 0.3,
                            borderColor: colorQuinario
                        }}
                        containerStyle={{
                            padding: 0, 
                            margin: 0, 
                            borderTopWidth: 0, 
                            borderBottomWidth: 0, 
                            backgroundColor: 'rgba(0,0,0,0)'
                        }}
                        inputStyle={{ 
                            backgroundColor: colorPrimario,
                            color: colorQuinario
                        }}
                        onChangeText={updateSearch}
                        value={search}
                    />
                </Animated.View>
            </View>
            {pantalla !== 'grupos' && (
                <Dropdown
                    style={{ backgroundColor: colorPrimario, width:150, borderRadius: 20, position:"absolute", right: 10, top: 71, zIndex:2 }}
                    iconStyle={{ tintColor: colorQuinario, width: 20, height: 20, marginRight: 5 }}
                    selectedTextStyle={{ marginLeft: 15, color: colorCuaternario, fontSize: 12 }}
                    itemContainerStyle={{ borderWidth: 0}}
                    itemTextStyle={{ fontSize: 12, color: colorQuinario }}
                    containerStyle={{ backgroundColor:colorPrimario, borderWidth:0, borderRadius:20, overflow:"hidden"}}
                    activeColor={colorSecundario}
                    autoScroll={false}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    data={data_filtro}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                    }}
                />
            )}
            <TouchableOpacity style={{
                flex: 1, 
                backgroundColor: showSearchBar ? colorQuinario : colorPrimario, 
                height:'100%', 
                justifyContent:'center', 
                alignContent:'center', 
                borderTopRightRadius: 20, 
                borderBottomRightRadius: 20,
                borderTopLeftRadius: 0, 
                borderBottomLeftRadius: 0,
                }} onPress={toggleSearchBar}>
                <Icon name='search' size={25} color={showSearchBar ? colorPrimario : colorQuinario}/>
            </TouchableOpacity>
        </View>
    );

}

export default BarraBusqueda;
