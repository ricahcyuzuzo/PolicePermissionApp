import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../api';
import moment from 'moment';

const Notifications = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        getNotifications();
    }, []);
    
    const getNotifications = async () => {
        const token = await AsyncStorage.getItem('token');
        axios.get(`${API_URL}/notifications`, {
            headers: {
            Authorization: token
            }
        }).then(res => {
            setNotifications(res.data.notifications);
        }).catch((err) => {
            console.log(err);
        })
    }

  return (
    <SafeAreaView>
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                alignItems: 'center',
                marginBottom: 20,
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{
                    width: 45,
                    height: 45,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#fff',
                    borderRadius: 10,
                }}>
                    <AntDesign name='arrowleft' color={'#fff'} size={30} />
                </TouchableOpacity>
                <Text style={{ color: '#fff', fontSize: 25, fontWeight: '700' }}>Notifications</Text>
            </View>
            <ScrollView>
            <View>
                {
                    notifications.map((item, idx) => <View key={idx} style={{
                    width: '90%',
                    height: 100,
                    backgroundColor: '#0077b6',
                    borderRadius: 10,
                    alignSelf: 'center',
                    marginTop: 20,
                    padding: 5,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{ color: '#fff', fontSize: 15, margin: 5, fontWeight: 'bold' }}>{item.title}</Text>
                        <Text style={{ color: '#fff', fontSize: 15, margin: 5, fontWeight: 'bold' }}>{moment(item.createdAt).format('DD MMM YYYY')}</Text>
                    </View>
                    <Text style={{ fontSize: 17, color: '#fff', fontWeight: '200', paddingHorizontal: 5, marginTop: 10,  }}>{item.message}</Text>
                 </View>)   
                }
            </View>
            <View style={{ height: 10, }} />
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

export default Notifications

const styles = StyleSheet.create({
    header: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#023e8a',
        paddingTop: 20,
    },
})