import { getUserAccount } from '@decentraland/EthereumController'
import * as eth from 'eth-connect/eth-connect'
import { Profiles } from './types'

/**
 * Returns profile of an address
 *
 * @param address ETH address
 */
export async function getUserInfo(address?: eth.Address) {
  if (!address) address = await getUserAccount()

  return (await fetch(`https://peer.decentraland.org/content/entities/profiles?pointer=${address}`)
    .then(res => res.json())
    .then(res => (res.length ? res[0] : res))) as Profiles
}

/**
 * Returns wearables inventory of an address
 *
 * @param address ETH address
 */
export async function getUserInventory(address?: eth.Address) {
  if (!address) address = await getUserAccount()
  const profile = await getUserInfo(address)
  return profile.metadata.avatars[0].inventory
}

/**
 * Returns boolean if the user has an item in their inventory or equiped
 *
 * @param wearable DCL name of the wearable ('dcl://dcl_launch/razor_blade_upper_body')
 * @param equiped true if currently wearing
 */
export async function itemInInventory(wearable: string, equiped: boolean = false) {
  const profile = await getUserInfo()
  if (equiped) {
    for (const item of profile.metadata.avatars[0]?.avatar.wearables) {
      if (item == wearable) return true
    }
  } else {
    for (const item of profile.metadata.avatars[0].inventory) {
      if (item == wearable) return true
    }
  }
  return false
}

/**
 * Returns boolean if the user has one of the items in their inventory or equiped
 *
 * @param wearables List of DCL names of the wearable (['dcl://dcl_launch/razor_blade_upper_body'])
 * @param equiped true if currently wearing
 */
export async function itemsInInventory(wearables: string[], equiped: boolean = false) {
  const profile = await getUserInfo()
  if (equiped) {
    for (const item of profile.metadata.avatars[0]?.avatar.wearables) {
      if (wearables.indexOf(item) != -1) return true
    }
  } else {
    for (const item of profile.metadata.avatars[0]?.inventory) {
      if (wearables.indexOf(item) != -1) return true
    }
  }
  return false
}

/**
 * Returns the equiped items
 */
export async function equipedItems() {
  const profile = await getUserInfo()
  return profile.metadata.avatars[0]?.avatar.wearables
}