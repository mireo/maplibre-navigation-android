package com.mapbox.services.android.navigation.testapp;

public class SampleItem {

  private final String name;
  private final String description;
  private final Class activity;
  private final boolean local;

  public SampleItem(String name, String description, Class activity, boolean loc) {
    this.name = name;
    this.description = description;
    this.activity = activity;
    this.local = loc;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public Class getActivity() {
    return activity;
  }

  public boolean isLocal() {
    return local;
  }
}
