import {View} from 'react-native';
import {styles} from './Styles.js';
import { IconButton } from './icon_button/IconButton';
import { Graph_Icon, Plus_Icon, Info_Icon } from './icon_button/Icons';

const Footer_Component = ({setInfoVisible, setPlusVisible, setStatsVisible}) => {
    return (
        <View style={styles.footerContainer}>
            <View style={styles.footerIcons}>
                <IconButton
                SVG={Graph_Icon}
                onPressFunction={() => {
                    setStatsVisible(true)
                }}>
                </IconButton>

                <IconButton
                SVG={Plus_Icon}
                onPressFunction={() => {
                    setPlusVisible(true)
                }}>
                </IconButton>

                <IconButton
                SVG={Info_Icon}
                onPressFunction={() => {
                    setInfoVisible(true)
                }}>
                </IconButton>
            </View>
        </View>
    );
}

export {Footer_Component};