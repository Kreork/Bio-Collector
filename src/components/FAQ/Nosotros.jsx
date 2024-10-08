import styles from '../../styles/style-app';
import {principal, tercero, cuarto} from '../../styles/style-colors';
import imagenEquipo from '../../assets/images/logoEquipo.jpg';
import imagenBiologia from '../../assets/images/buap.png';
import {useSelector, useDispatch} from 'react-redux';
import VideoBioCollector from '../../assets/video/BioCollector.mp4';
import React, {useState, useRef, useEffect} from 'react';
import {Icon} from 'react-native-elements';
import Video from 'react-native-video';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  ImageBackground,
  useColorScheme,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';

const Nosotros = ({navigation}) => {
  const systemTheme = useColorScheme();

  const {currentTheme, themes, modeTheme} = useSelector(state => state.theme);
  const theme = themes[currentTheme] || themes[systemTheme] || themes.light;
  const {
    logoInicio,
    colorPrimario,
    colorSecundario,
    colorTerciario,
    colorCuaternario,
    colorQuinario,
  } = theme;

  const desarrolladores = [
    {
      nombre: 'Irvyn Xicale Cabrera',
      github: 'irvyn2703',
      url: 'https://irvyn2703.github.io/',
      posicion: true,
    },
    {
      nombre: 'Jesus Pichón Ramirez',
      github: 'JesusPichon',
      url: 'https://github.com/JesusPichon',
      posicion: false,
    },
    {
      nombre: 'Sergio Enrique Rivera Vidal',
      github: 'EnriqueRV10',
      url: 'https://github.com/EnriqueRV10',
      posicion: true,
    },
    {
      nombre: 'Abner Pino Federico',
      github: 'Abnerpino',
      url: 'https://github.com/Abnerpino',
      posicion: false,
    },
    {
      nombre: 'Christian Santiago Rodriguez',
      github: 'Kreork',
      url: 'https://github.com/Kreork',
      posicion: true,
    },
  ];

  const lodoMayor =
    Dimensions.get('screen').width > Dimensions.get('screen').height
      ? Dimensions.get('screen').width
      : Dimensions.get('screen').height;

  const localStyles = StyleSheet.create({
    imagenBackground: {
      opacity: 0.1,
      minHeight: lodoMayor,
      minWidth: lodoMayor,
      position: 'absolute',
      top: 30,
      left: 50,
    },
    Borde: {
      borderColor: colorQuinario,
      borderWidth: 3,
    },
    Titulo: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorQuinario,
      marginVertical: 20,
      paddingVertical: 5,
      paddingHorizontal: 20,
      margin: 0,
      textAlign: 'center',
      textAlignVertical: 'center',
      borderRadius: 20,
    },
    TextContenido: {
      textTransform: 'lowercase',
      textAlign: 'justify',
      fontSize: 16,
      fontWeight: 'bold',
      color: colorQuinario,
      opacity: 0.6,
    },
    DevContenedor: {
      backgroundColor: colorQuinario,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 20,
      zIndex: 1,
    },
    DevText: {
      color: colorPrimario,
      fontSize: 16,
      fontWeight: 'bold',
      textTransform: 'capitalize',
    },
  });

  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.seek(currentTime - 10);
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.seek(currentTime + 10);
    }
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setPaused(true);
    });

    // Cleanup: quitar el listener cuando el componente se desmonta o el efecto se reejecuta
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex: 1, marginTop: 20}}>
      {/*logo*/}
      <View style={{width: '100%', alignItems: 'center', position: 'relative'}}>
        <View
          style={[
            {
              borderRadius: 200,
              padding: 10,
              width: 115,
              height: 115,
              zIndex: 2,
              backgroundColor: colorPrimario,
            },
            localStyles.Borde,
          ]}>
          <Image style={{height: 85, width: 85}} source={logoInicio} />
        </View>
        <View
          style={{
            width: '100%',
            height: 5,
            backgroundColor: colorQuinario,
            position: 'absolute',
            bottom: 57,
            zIndex: 1,
          }}></View>
      </View>
      {/* Descripción */}
      <View style={{alignItems: 'center', paddingHorizontal: 20}}>
        <Text style={[localStyles.Titulo, localStyles.Borde]}>
          BIO COLLECTOR
        </Text>
        <Text style={[localStyles.TextContenido]}>
          UNA APLICACIÓN MOVIL DISEÑADA PARA LA RECOLECCIÓN DE DATOS BIOLOGICOS,
          OBTENIDOS EN PRUEBAS DE CAMPO. LA APLICACIÓN PERMITE A LOS USUARIOS
          COMPARTIR LOS DATOS DE FORMA PÚBLICA DENTRO DE LA MISMA APLICACIÓN. EL
          OBJETIVO ES CREAR REPOSITORIOS DE INFORMACIÓN PARA INVESTIGADORES Y
          ALUMNOS DENTRO DEL CAMPO DE LA BIOLOGIA.
        </Text>
      </View>
      {/* Desarrolladores */}
      <View style={{alignItems: 'center', paddingHorizontal: 20, gap: 15}}>
        <Text style={[localStyles.Titulo, localStyles.Borde]}>
          Desarrolladores
        </Text>
        {/* Nosotros */}
        {desarrolladores.map((desarrollador, index) => (
          <View key={index}>
            <TouchableOpacity
              onPress={() => Linking.openURL(desarrollador.url)}>
              <View
                style={{
                  flexDirection: desarrollador.posicion ? 'row' : 'row-reverse',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                }}>
                <Image
                  style={[
                    {height: 85, width: 85, borderRadius: 200, zIndex: 2},
                    localStyles.Borde,
                  ]}
                  source={{
                    uri: `https://github.com/${desarrollador.github}.png`,
                  }}
                />
                <View
                  style={[
                    {
                      marginLeft: desarrollador.posicion ? -10 : 0,
                      marginRight: desarrollador.posicion ? 0 : -10,
                    },
                    localStyles.DevContenedor,
                  ]}>
                  <Text style={[localStyles.DevText]}>
                    {desarrollador.nombre}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {/* Primeros pasos */}
      <View
        style={{
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}>
        <Text style={[localStyles.Titulo, localStyles.Borde]}>
          Primeros pasos
        </Text>
        <Video
          ref={videoRef}
          source={require('../../assets/video/BioCollector.mp4')}
          style={{width: '100%', height: 200}}
          paused={paused}
          onProgress={onProgress}
          repeat={true}
          audioOutput="speaker"
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
            backgroundColor: colorQuinario,
          }}>
          <Icon
            name="fast-rewind"
            type="material"
            color={colorPrimario}
            size={30}
            onPress={handleRewind}
          />
          {paused ? (
            <Icon
              name="play-arrow"
              type="material"
              color={colorPrimario}
              size={30}
              onPress={handlePlayPause}
            />
          ) : (
            <Icon
              name="pause"
              type="material"
              color={colorPrimario}
              size={30}
              onPress={handlePlayPause}
            />
          )}
          <Icon
            name="fast-forward"
            type="material"
            color={colorPrimario}
            size={30}
            onPress={handleForward}
          />
        </View>
      </View>
    </View>
  );
};

export default Nosotros;
