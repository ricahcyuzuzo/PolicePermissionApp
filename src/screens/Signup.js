import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import PoliceIcon from '../assets/images/police.png';
import axios from 'axios';
import { API_URL } from '../api';
import { LOGIN } from '../constants';

const Signup = ({ navigation }) => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignUp = () => {
        setLoading(true);
        setErrorMessage('');
        const payload = {
            code,
            password
        }
        axios.post(`${API_URL}/signup`, payload).then((res) => {
            console.log(res.data);
            setLoading(false);
            navigation.navigate(LOGIN);
        }).catch((err) => {
            console.log(err);
            setErrorMessage(err?.response?.data?.message);
            setLoading(false);
        })
    }
  return (
    <SafeAreaView>
     <View style={styles.container}>
        <ScrollView>
        <StatusBar style='light' />
        <Image source={PoliceIcon} style={{ width: 200, height: 200, alignSelf: 'center', }} />
        <Text style={styles.headerTitle}>Signup now!</Text>
        <Text style={styles.smallTextHeader}>Signup now to request for permission</Text>
        <View style={styles.body}>
            <TextInput value={code} placeholder='Enter Code' onChangeText={(val) => setCode(val)} style={styles.textInput} />
            <View style={{ marginTop: 20, }}>
                <TextInput value={password} secureTextEntry={isPasswordHidden} placeholder='Enter Password' onChangeText={(val) => setPassword(val)} style={styles.textInput} />
                <TouchableOpacity onPress={() => setIsPasswordHidden(!isPasswordHidden)} style={styles.eye}>
                    <Feather name={isPasswordHidden ? 'eye' : 'eye-off'} size={24} color={'#fff'} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSignUp} activeOpacity={.7} style={styles.button}>
                {loading ? <ActivityIndicator color={'#fff'} size={24} /> : <Text style={styles.buttonText}>Sign Up</Text>}
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20, justifyContent: 'center', }}>
                <Text style={{ color: '#fff', fontSize: 16, }}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: '#38a3a5', fontSize: 16,  }}>Login</Text>
                </TouchableOpacity>
            </View>

            <Text style={{ color: '#e76f51', fontSize: 16, textAlign: 'center', marginTop: 10, }}>{errorMessage?.slice(0, 1)?.toUpperCase() + errorMessage?.slice(1)}</Text>
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Signup

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    button: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        backgroundColor: '#38a3a5',
        borderRadius: 10,
    },
    eye: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    textInput: {
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: '#0096c7',
        borderRadius: 10,
    },
    body: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 40,
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#023e8a',
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 30,
        color: '#fff',
        fontWeight: '900',
        marginTop: 50,
        width: '90%',
        alignSelf: 'center',
        textAlign: 'center',
    },
    smallTextHeader: {
        fontSize: 16,
        color: '#fff',
        width: '90%',
        alignSelf: 'center',
        fontWeight: '300',
        textAlign: 'center',
    }
    
})