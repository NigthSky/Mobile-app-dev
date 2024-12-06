import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text, Image } from 'react-native';


export default function test() {
    
    return(
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
          <Button title='try' onPress={() => {const date = new Date();  alert(date.toISOString().split('T')[0]); return;}}/>
          
        </View>
    )
}

