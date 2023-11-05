import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import AppContext from '../../Context/AppContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { API_URL } from '../../api'
import moment from 'moment';
import { NOTIFICATIONS } from '../../constants'

const HomeDPU = ({ navigation }) => {
  const { setIsLoggedIn } = useContext(AppContext);
  const [count, setCount] = useState(0);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    getRequests();
  }, [])

  const getRequests = async () => {
    const token = await AsyncStorage.getItem('token');
    axios.get(`${API_URL}/all-permissions`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
        setCount(res.data.permissions.length);
        setPermissions(res.data.permissions);
    }).catch((err) => {
        console.log(err);
    })
  }

  const handleRequest = async (status, officerId, id) => {
    const token = await AsyncStorage.getItem('token');
    const payload = {
      status,
      officerId,
      id,
    }
    axios.patch(`${API_URL}/permission`, payload, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      console.log(res.data);
      getRequests();
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900', alignSelf: 'center', }}>Hi DPU Officer,</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate(NOTIFICATIONS)} style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#fff', justifyContent: 'center', alignItems: 'center', }}>
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={async() => {
                await AsyncStorage.setItem('loggedIn', 'not-logged-in');
                setIsLoggedIn('not-logged-in');
            }} style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#fff', justifyContent: 'center', alignItems: 'center', }}>
              <MaterialIcons name="logout" size={24} color="#ef233c" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.counterView}>
          <Text style={{ fontSize: 50, color: '#fff', fontWeight: '900', textAlign: 'center', }}>{count}</Text>
          <Text style={{ fontSize: 50, color: '#fff', fontWeight: '300', textAlign: 'center', }}>Permissions</Text>
        </View>
        <View style={{ width: '90%', alignSelf: 'center', marginTop: 40, }}>
          <ScrollView>
            {permissions.map((item, idx) => <View key={idx} style={{ width: '100%', height: 150, borderRadius: 20, backgroundColor: '#0077b6', padding: 10, marginBottom: 10, }}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{moment(item.startDate).format('DD MMM YYYY')} to {moment(item.endDate).format('DD MMM YYYY')}</Text>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '300', marginTop: 10, }}>{item.reason}</Text>
              <View style={{ width: 100, height: 30, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, right: 0, borderRadius: 20,}}>
                <Text style={{ color: item.status === 'pending' ? '#ffb703' : item.status === 'approved' ? '#63af90' : '#ef233c', }}>{item.status.slice(0, 1).toUpperCase() + item.status.slice(1)}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 20, position: 'absolute', bottom: 20, right: 20, }}>
                <TouchableOpacity onPress={() => handleRequest('approved', item.officerId, item._id)}>
                  <Text style={{ color: '#63af90', fontWeight: 'bold', }}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRequest('rejected', item.officerId, item._id)}>
                  <Text style={{ color: '#a12', fontWeight: 'bold', }}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>)}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HomeDPU

const styles = StyleSheet.create({
  counterView: {
    width: '90%',
    height: 150,
    backgroundColor: '#63af90',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
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