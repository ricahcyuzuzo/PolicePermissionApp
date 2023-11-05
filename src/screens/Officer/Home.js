import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '../../api';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import AppContext from '../../Context/AppContext';
import { NOTIFICATIONS } from '../../constants';

const Home = ({ navigation }) => {
    const [user, setUser] = useState({});
    const [count, setCount] = useState(0);
    const [permissions, setPermissions] = useState([]);
    const [modalView, setModalView] = useState(false);
    const [from, setFrom] = useState(new Date());
    const [to, setTo] = useState(new Date());
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setIsLoggedIn } = useContext(AppContext);


    useEffect(() => {
        getRequests();
        handleGetUser();
    }, [])
    
    const handleGetUser = async () => {
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.user);
    }

    const datePicker = (setData, date) => {
      DateTimePickerAndroid.open({
        value: date,
        onChange: (event, selectedDate) => {
          setData(selectedDate);
        },
        mode: 'date',
      });
    }

    const handleRequest = async () => {
      const token = await AsyncStorage.getItem('token');
      const payload = {
        startDate: from,
        endDate: to, 
        reason
      }
      setLoading(true);
      axios.post(`${API_URL}/permission`, payload, {
        headers: {
          Authorization: token
        }
      }).then(res => {
        setLoading(false);
        setModalView(false);
        getRequests();
      }).catch(err => {
        setLoading(false);
        setErrorMessage(err?.response?.data?.message);
      });
    }

    const getRequests = async () => {
        const token = await AsyncStorage.getItem('token');
        axios.get(`${API_URL}/permission`, {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900', alignSelf: 'center', }}>Hi Officer {user?.name},</Text>
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
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        marginTop: 30,
      }}>
        <Text style={{ color: '#fff', fontSize: 18, }}>Permissions</Text>
        <TouchableOpacity onPress={() => setModalView(true)} style={{ width: 100, height: 40, backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ color: '#023e8a', fontSize: 18, }}>Request</Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: '90%', alignSelf: 'center', marginTop: 40, }}>
        <ScrollView>
        {permissions.map((item, idx) => <View key={idx} style={{ width: '100%', height: 100, borderRadius: 20, backgroundColor: '#0077b6', padding: 10, marginTop: 10, }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{moment(item.startDate).format('DD MMM YYYY')} to {moment(item.endDate).format('DD MMM YYYY')}</Text>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '300', marginTop: 10, }}>{item.reason}</Text>
          <View style={{ width: 100, height: 30, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, right: 0, borderRadius: 20,}}>
            <Text style={{ color: item.status === 'pending' ? '#ffb703' : item.status === 'approved' ? '#63af90' : '#ef233c', }}>{item.status.slice(0, 1).toUpperCase() + item.status.slice(1)}</Text>
          </View>
        </View>)}
        </ScrollView>
      </View>
      <Modal
        transparent={true}
        visible={modalView}
        onRequestClose={() => setModalView(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 25, marginTop: 10, fontWeight: '700', marginLeft: 5 }}>Request for Permissions</Text>
            <Text style={{ fontSize: 18, color: '#000', marginTop: 40, marginLeft: 20, }}>Start Date</Text>
            <TouchableOpacity onPress={() => datePicker(setFrom, from)} style={{
              width: '90%',
              height: 40,
              borderRadius: 10,
              borderWidth: 1,
              justifyContent: 'center',
              paddingHorizontal: 10,
              alignSelf: 'center',
              marginTop: 10,
            }}>
              <Text>{moment(from).format('DD MMM YYYY')}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, color: '#000', marginTop: 20, marginLeft: 20, }}>End Date</Text>
            <TouchableOpacity onPress={() => datePicker(setTo, to)} style={{
              width: '90%',
              height: 40,
              borderRadius: 10,
              borderWidth: 1,
              justifyContent: 'center',
              paddingHorizontal: 10,
              alignSelf: 'center',
              marginTop: 10,
            }}>
              <Text>{moment(to).format('DD MMM YYYY')}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, color: '#000', marginTop: 20, marginLeft: 20, }}>Reason</Text>
            <TextInput
              value={reason}
              style={{
                width: '90%',
                height: 90,
                borderRadius: 10,
                borderWidth: 1,
                justifyContent: 'center',
                padding: 10,
                alignSelf: 'center',
                marginTop: 10,
                textAlignVertical: 'top'
              }}
              onChangeText={(val) => setReason(val)}
              editable
              multiline
              placeholder='Enter your reason'
            />

            <TouchableOpacity disabled={reason.length > 0 ? false : true} onPress={handleRequest} style={{
              width: '90%',
              height: 50,
              borderRadius: 10,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 30,
              backgroundColor: reason.length > 0 ? '#023e8a' : '#4c4c4c',
            }}>
              { loading ? <ActivityIndicator color={'#fff'} size={24} /> : <Text style={{ color: '#fff' }}>Submit</Text> }
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.8} onPress={() => setModalView(false)} style={{
              width: 50,
              height: 50,
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: '#d62828',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 20,
            }}>
              <FontAwesome name="times" size={34} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  modalView: {
    width: '90%',
    height: 510,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignSelf: 'center',
  },
  centeredView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  counterView: {
    width: '90%',
    height: 150,
    backgroundColor: '#63af90',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#023e8a',
    paddingTop: 20,
  },
  header: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})