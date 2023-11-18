"use server";

import UserLocation from "../models/userLocation.model";
import { connectToDB } from "../mongoose";

export async function updateLocationToUser({
  userId,
  lng,
  lat,
}: {
  userId: string;
  lng: number;
  lat: number;
}) {
  connectToDB();
  try {
    await UserLocation.findOneAndUpdate(
      { id: userId },
      { $set: { longitude: lng, latitude: lat } },
      { upsert: true, new: true }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getLocationFromUsers(userId: string) {
  connectToDB();
  try {
    const result = await UserLocation.find({ id: { $ne: userId } });

    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getPrivacyState(userId: string) {
  await connectToDB(); // 建立與數據庫的連接

  try {
    const userLocation = await UserLocation.findOne({ id: userId }).select("privacy"); // 使用 select 方法只選擇 privacy 屬性
    if (userLocation) {
      return userLocation.privacy; // 返回 privacy 屬性的值
    } else {
      return null; // 如果找不到對應的文檔，返回 null 或其他適當的值
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function togglePrivacy(userId: string, state: boolean) {
  connectToDB();
  try {
    await UserLocation.findOneAndUpdate(
      { id: userId },
      { $set: { privacy: state } }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
}