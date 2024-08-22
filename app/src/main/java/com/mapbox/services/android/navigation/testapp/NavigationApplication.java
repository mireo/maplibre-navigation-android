package com.mapbox.services.android.navigation.testapp;

import android.app.Application;

import com.mapbox.mapboxsdk.BuildConfig;
import com.mapbox.mapboxsdk.Mapbox;

import timber.log.Timber;
import timber.log.Timber.DebugTree;

public class NavigationApplication extends Application {

  @Override
  public void onCreate() {
    super.onCreate();

    if (BuildConfig.DEBUG) {
      Timber.plant(new DebugTree());
    }

    Mapbox.getInstance(getApplicationContext());
  }

}
