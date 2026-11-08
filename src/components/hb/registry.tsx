"use client";
/* Hungry Bird — screen registry */
import React from "react";
import { ScreenId } from "@/lib/store";
import { Splash, Onboard, Login, Otp, Signup, LocationScreen } from "./screens/intro";
import { Home } from "./screens/home";
import { Search, Restaurant, Dish } from "./screens/discover";
import { Cart, Checkout, Success, Tracking, Rider } from "./screens/order";
import { History, Favorites, Offers, Rate, Profile, Notifications, StatesGallery } from "./screens/account";
import { DesignSystem } from "./screens/system";

export const SCREENS: Record<ScreenId, React.ComponentType> = {
  splash: Splash, onboard: Onboard, login: Login, otp: Otp, signup: Signup, location: LocationScreen,
  home: Home,
  search: Search, restaurant: Restaurant, dish: Dish,
  cart: Cart, checkout: Checkout, success: Success, tracking: Tracking, rider: Rider,
  history: History, favorites: Favorites, offers: Offers, rate: Rate, profile: Profile, notifications: Notifications,
  states: StatesGallery, "design-system": DesignSystem,
};
