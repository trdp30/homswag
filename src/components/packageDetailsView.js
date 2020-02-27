import React, { useState, useLayoutEffect, useEffect } from "react";
import { TouchableOpacity, ScrollView, Image } from 'react-native';
import DefaultStyles from '../style/customStyles';
import { StyleSheet } from 'react-native';
import { connect } from "react-redux";
import { createCartItem, deleteItem } from "../../store/actions/cartItemAction";
import _ from 'lodash';
import { Layout, Text } from '@ui-kitten/components';
import { Dimensions } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);

const ItemContainer = ({items, packageService}) => {
  let showDescription = false
  if(packageService.description) {
    showDescription = true
  }
    return (
      <Layout style={{paddingHorizontal: 20, paddingVertical: 20}}>
        { showDescription ?
          <Layout style={{paddingTop: 10, paddingBottom: 10, paddingRight: 10}}>
            <Text style={{fontSize: 16}}>{packageService.description}</Text>
          </Layout> : null
        }
        <Text style={{fontFamily: 'roboto-medium', fontSize: 18}}>Items</Text>
        {items.map((item, index) => (
          <Layout key={index} style={{paddingHorizontal: 10, paddingVertical: 10}}>
            <Layout>
              <Layout style={{flexDirection: 'row'}}>
                <Image source={{uri: item.image_source}} style={{width: 60, height: 40}}/>
                <Layout style={{marginLeft: 10, width: '75%'}}>
                  <Text>{item.name}</Text>
                  <Text category='c1'>{item.description}</Text>
                </Layout>
              </Layout>
            </Layout>
          </Layout>
        ))}
      </Layout>
    )
}

const PackageDetails = (props) => {
  const { tab: packageService, cartItemModel, addItemToCart, deletePackage, networkAvailability } = props
  const [ isAdded, setIsAdded ] = useState(false)

  const addPackageToCart = () => {
    addItemToCart(packageService.id, packageService.price, true)
  }

  useEffect(() => {
    if(!cartItemModel.isLoading && cartItemModel.error) {
      alert(cartItemModel.error)
    }
  }, [cartItemModel.error])

  const removePackageFromCart = () => {
    let cartPackages = cartItemModel.values.filter((cartItem) => cartItem.is_package == true)
    let cartItem = _.find(cartPackages, ['package.id', packageService.id])
    deletePackage(cartItem.id)
  }

  useLayoutEffect(() => {
    isPackageAdded()
  }, [cartItemModel.isLoading])

  const isPackageAdded = () => {
    if(cartItemModel && !cartItemModel.isLoading && cartItemModel.values.length) {
      let cartPackages = cartItemModel.values.filter((cartItem) => cartItem.is_package == true)
      if(_.find(cartPackages, ['package.id', packageService.id])) {
        setIsAdded(true)
      } else {
        setIsAdded(false)
      }
    } else {
      setIsAdded(false)
    }
  }

  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{paddingBottom: 20}}>
        <Image source={{uri: packageService.poster_image_source}} style={{width: screenWidth, height: 260}}/>
        <ItemContainer items={packageService.items} packageService={packageService}/>
      </ScrollView>
      { cartItemModel.isLoading ?
        <Layout style={[styles.button, {height: 55, backgroundColor: 'grey'}]}>
          <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Loading..</Text>
        </Layout> :
        <Layout>
          {!networkAvailability.isOffline &&
            <Layout>
              { isAdded ? 
                <Layout style={[{height: 55}, DefaultStyles.brandBackgroundColor]}>
                  <TouchableOpacity style={[styles.button, DefaultStyles.brandColorButton]} onPress={removePackageFromCart}>
                    <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Remove Package</Text>
                  </TouchableOpacity>
                </Layout> :
                <Layout style={[{height: 55}, DefaultStyles.brandBackgroundColor]}>
                  <TouchableOpacity style={[styles.button, DefaultStyles.brandColorButton]} onPress={addPackageToCart}>
                    <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Book Now</Text>
                  </TouchableOpacity>
                </Layout>
              }
            </Layout>
          }
        </Layout>
      }
    </Layout>
  )
}

const mapStateToProps = state => ({
  networkAvailability: state.networkAvailability
})

const mapDispatchToProps = dispatch => ({
  addItemToCart: (package_id, package_price, is_package) => dispatch(createCartItem(package_id, package_price, is_package)),
  deletePackage: (cart_item_id) => dispatch(deleteItem(cart_item_id))
})

export default connect(mapStateToProps, mapDispatchToProps)(PackageDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    color:'#fff',
    height: 55
  }
})