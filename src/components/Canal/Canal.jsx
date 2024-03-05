import { View, Text, TouchableOpacity, Animated, ImageBackground } from "react-native";
import styles from "../../styles/style-app";
import stylesCanales from "../../screens/canales/style-canales";


const Canal = ({ animacion, navigation, informacion, nombre }) => {
    return (
        //<Animated.View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 32, transform: [{ scale: animacion }] }}>
            <TouchableOpacity 
                style={[stylesCanales.cardVertical, styles.fondoT, { width: '45%', marginBottom: 20, margin: 10 }]} 
                onPress={() => { navigation.navigate('Tomas', {nombre}) }}
                >
                <View style={[stylesCanales.cardVImagen]}>
                    <ImageBackground 
                        source={require('../../assets/images/Campo_flores.jpg')}
                        resizeMode="cover"
                        style={styles.image}>
                    </ImageBackground>
                </View>
                <View style={[styles.botongrupo, styles.fondoP]}>
                    <Text style={[styles.textT, { textAlign: 'center', fontWeight: 'bold' }]}>
                        {informacion}
                    </Text>
                </View>
            </TouchableOpacity>
        //</Animated.View>
    );
}


export default Canal;